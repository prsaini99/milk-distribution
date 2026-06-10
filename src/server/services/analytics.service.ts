import type { OrderStatus } from "@/domain";
import {
  orderRepository,
  productRepository,
  subscriptionRepository,
} from "@/server/repositories";
import { formatCurrency } from "@/lib/format";
import { ORDER_STATUS_LABELS } from "@/lib/order";

export interface InsightDetail {
  label: string;
  value: string;
}

/** One answerable question + its computed answer. */
export interface Insight {
  id: string;
  question: string;
  answer: string;
  details?: InsightDetail[];
}

/**
 * Compute the admin "Ask your data" insights from live orders, products and
 * subscriptions. The natural-language layer is mocked (predefined questions),
 * but every ANSWER is a real aggregation over current data.
 */
export async function getInsights(): Promise<Insight[]> {
  const [orders, products, subscriptions] = await Promise.all([
    orderRepository.findAll(),
    productRepository.findAll(),
    subscriptionRepository.findAll(),
  ]);

  const paid = orders.filter((o) => o.status !== "cancelled");

  // Top products by units sold
  const unitsByName = new Map<string, number>();
  for (const o of paid)
    for (const it of o.items)
      unitsByName.set(it.name, (unitsByName.get(it.name) ?? 0) + it.quantity);
  const topProducts = [...unitsByName.entries()].sort((a, b) => b[1] - a[1]);

  // Revenue
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  // Best customers by spend
  const byCustomer = new Map<string, { name: string; total: number; count: number }>();
  for (const o of paid) {
    const cur = byCustomer.get(o.customer.email) ?? {
      name: o.customer.name,
      total: 0,
      count: 0,
    };
    cur.total += o.total;
    cur.count += 1;
    byCustomer.set(o.customer.email, cur);
  }
  const topCustomers = [...byCustomer.values()].sort((a, b) => b.total - a.total);

  const aov = paid.length ? Math.round(revenue / paid.length) : 0;

  // Orders by status
  const statusCounts = new Map<OrderStatus, number>();
  for (const o of orders)
    statusCounts.set(o.status, (statusCounts.get(o.status) ?? 0) + 1);

  const outOfStock = products.filter((p) => !p.inStock);
  const activeSubs = subscriptions.filter((s) => s.status === "active");

  return [
    {
      id: "top-product",
      question: "What's my best-selling product?",
      answer: topProducts.length
        ? `Your best-seller is ${topProducts[0][0]} — ${topProducts[0][1]} units sold so far.`
        : "No sales recorded yet.",
      details: topProducts
        .slice(0, 3)
        .map(([name, q]) => ({ label: name, value: `${q} units` })),
    },
    {
      id: "revenue",
      question: "How much revenue have we made?",
      answer: `Total revenue is ${formatCurrency(revenue)} across ${paid.length} order${
        paid.length === 1 ? "" : "s"
      } (cancelled excluded).`,
    },
    {
      id: "best-customer",
      question: "Who's my top customer?",
      answer: topCustomers.length
        ? `${topCustomers[0].name} is your top customer — ${formatCurrency(
            topCustomers[0].total,
          )} across ${topCustomers[0].count} order${topCustomers[0].count === 1 ? "" : "s"}.`
        : "No customers yet.",
      details: topCustomers
        .slice(0, 3)
        .map((c) => ({ label: c.name, value: formatCurrency(c.total) })),
    },
    {
      id: "aov",
      question: "What's my average order value?",
      answer: `Your average order value is ${formatCurrency(aov)}.`,
    },
    {
      id: "status",
      question: "How are orders split by status?",
      answer: `You have ${orders.length} order${orders.length === 1 ? "" : "s"} in total.`,
      details: [...statusCounts.entries()].map(([s, n]) => ({
        label: ORDER_STATUS_LABELS[s],
        value: String(n),
      })),
    },
    {
      id: "stock",
      question: "Which products are out of stock?",
      answer: outOfStock.length
        ? `${outOfStock.length} product${outOfStock.length === 1 ? " is" : "s are"} out of stock — restock soon.`
        : "All products are in stock. 🎉",
      details: outOfStock.map((p) => ({ label: p.name, value: "Out of stock" })),
    },
    {
      id: "subscriptions",
      question: "How many active subscriptions?",
      answer: `You have ${activeSubs.length} active subscription${
        activeSubs.length === 1 ? "" : "s"
      } driving recurring deliveries.`,
    },
  ];
}
