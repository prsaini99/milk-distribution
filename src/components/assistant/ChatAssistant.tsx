"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, X, Send, Bot } from "lucide-react";
import type { Product } from "@/domain";
import { useCart } from "@/components/cart/CartProvider";
import { formatCurrency, formatPack } from "@/lib/format";

/**
 * MilkMate — the storefront shopping assistant.
 *
 * The conversational "brain" here is a deterministic, scripted engine (see
 * `respond`), not an LLM — but it drives REAL actions (adds to the live cart,
 * routes to checkout) and presents an AI-style chat UX. The engine is isolated
 * behind `respond(value)` so a real LLM call (OpenAI or Gemini) could replace
 * it later without changing the UI.
 */

type Msg = { from: "bot" | "user"; text: string };
type Option = { label: string; value: string };

const MAIN_MENU: Option[] = [
  { label: "🛒 Place an order", value: "order" },
  { label: "🥛 What's fresh today?", value: "fresh" },
  { label: "📦 Weekly dairy pack", value: "pack" },
  { label: "💬 Talk to support", value: "support" },
];

// A curated "smart" weekly pack — resolved against the live catalogue.
const WEEKLY_PACK: { id: string; qty: number }[] = [
  { id: "prod_milk_fc_500", qty: 7 },
  { id: "prod_curd_400", qty: 2 },
  { id: "prod_ghee_cow_500", qty: 1 },
];

const QTY_OPTIONS = [1, 2, 3, 5, 10];

export function ChatAssistant() {
  const router = useRouter();
  const { addItem } = useCart();

  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [pendingProductId, setPendingProductId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // Load catalogue + greet on first open.
  useEffect(() => {
    if (!open || started.current) return;
    started.current = true;
    fetch("/api/products")
      .then((r) => r.json())
      .then((p: Product[]) => setProducts(p))
      .catch(() => {});
    botSay(
      "Hi! I'm MilkMate 🐮 — your dairy assistant. How can I help you today?",
      MAIN_MENU,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, options]);

  // Bot "thinks" briefly then speaks — the delay sells the assistant feel.
  function botSay(text: string, opts: Option[] = []) {
    setOptions([]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { from: "bot", text }]);
      setOptions(opts);
    }, 550);
  }

  const inStock = () => products.filter((p) => p.inStock);
  const find = (id: string) => products.find((p) => p.id === id);
  const productOptions = (): Option[] =>
    inStock().map((p) => ({ label: p.name, value: `pick:${p.id}` }));

  // The scripted engine. Maps an action value -> a reply (+ next options).
  function respond(value: string) {
    if (value === "order") {
      botSay("Great — what would you like to add?", productOptions());
      return;
    }

    if (value.startsWith("pick:")) {
      const product = find(value.slice(5));
      if (!product) {
        botSay("That item isn't available. Try another:", productOptions());
        return;
      }
      setPendingProductId(product.id);
      botSay(
        `How many "${product.name}" (${formatPack(product.size, product.unit)} · ${formatCurrency(product.price)})?`,
        QTY_OPTIONS.map((n) => ({ label: String(n), value: `qty:${n}` })),
      );
      return;
    }

    if (value.startsWith("qty:")) {
      const n = parseInt(value.slice(4), 10);
      const product = pendingProductId ? find(pendingProductId) : null;
      if (!product) {
        botSay("Let's start over — what would you like?", MAIN_MENU);
        return;
      }
      addItem(product, n);
      setPendingProductId(null);
      botSay(`✅ Added ${n} × ${product.name} to your cart. Anything else?`, [
        { label: "➕ Add more", value: "order" },
        { label: "🛒 View cart", value: "go:/cart" },
        { label: "✅ Checkout", value: "go:/checkout" },
      ]);
      return;
    }

    if (value === "fresh") {
      const picks = inStock().slice(0, 3);
      botSay(
        `Everything's farm-fresh today! Popular right now: ${picks
          .map((p) => p.name)
          .join(", ")}. Want to add one?`,
        [
          ...picks.map((p) => ({ label: `Add ${p.name}`, value: `pick:${p.id}` })),
          { label: "⬅ Back", value: "menu" },
        ],
      );
      return;
    }

    if (value === "pack") {
      const items = WEEKLY_PACK.map((w) => ({ w, p: find(w.id) })).filter(
        (x) => x.p && x.p.inStock,
      );
      const summary = items.map((x) => `${x.w.qty}× ${x.p!.name}`).join(", ");
      const total = items.reduce((s, x) => s + x.p!.price * x.w.qty, 0);
      botSay(
        `A balanced weekly pack: ${summary} — ${formatCurrency(total)}. Add it all?`,
        [
          { label: "➕ Add weekly pack", value: "addpack" },
          { label: "⬅ Back", value: "menu" },
        ],
      );
      return;
    }

    if (value === "addpack") {
      let added = 0;
      for (const w of WEEKLY_PACK) {
        const p = find(w.id);
        if (p && p.inStock) {
          addItem(p, w.qty);
          added++;
        }
      }
      botSay(
        added
          ? "✅ Added your weekly pack to the cart!"
          : "Sorry, those items aren't available right now.",
        [
          { label: "🛒 View cart", value: "go:/cart" },
          { label: "✅ Checkout", value: "go:/checkout" },
          { label: "⬅ Menu", value: "menu" },
        ],
      );
      return;
    }

    if (value === "support") {
      botSay(
        "You can reach us at 📞 +91 98765 43210 or ✉️ hello@milkmart.in. Anything else?",
        MAIN_MENU,
      );
      return;
    }

    if (value.startsWith("go:")) {
      setOpen(false);
      router.push(value.slice(3));
      return;
    }

    if (value === "menu") {
      botSay("What would you like to do?", MAIN_MENU);
      return;
    }

    botSay(
      "I can help you order, show today's fresh picks, or suggest a weekly pack:",
      MAIN_MENU,
    );
  }

  function onOption(opt: Option) {
    setMessages((m) => [...m, { from: "user", text: opt.label }]);
    respond(opt.value);
  }

  // Free-text → light keyword routing, so typing *feels* understood.
  function onSend() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text }]);

    const t = text.toLowerCase();
    const product = products.find(
      (p) => p.inStock && t.includes(p.name.toLowerCase()),
    );
    if (product) {
      setPendingProductId(product.id);
      botSay(
        `How many "${product.name}"?`,
        QTY_OPTIONS.map((n) => ({ label: String(n), value: `qty:${n}` })),
      );
      return;
    }
    if (/order|buy|add|cart/.test(t)) return respond("order");
    if (/fresh|today|new/.test(t)) return respond("fresh");
    if (/pack|week|bundle|suggest|recommend/.test(t)) return respond("pack");
    if (/support|help|contact|call|phone/.test(t)) return respond("support");
    botSay("Got it! Here's what I can help with:", MAIN_MENU);
  }

  return (
    <>
      {/* Launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open shopping assistant"
          className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
        >
          <Sparkles className="size-5" />
          <span className="hidden sm:inline">Ask MilkMate</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="surface-card fixed bottom-5 right-5 z-40 flex h-[32rem] max-h-[80vh] w-[92vw] max-w-sm flex-col overflow-hidden p-0">
          {/* Header */}
          <div className="flex items-center justify-between gap-2 border-b border-border/60 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-full bg-white/15">
                <Bot className="size-4" />
              </span>
              <div className="leading-none">
                <p className="text-sm font-bold">MilkMate</p>
                <p className="mt-0.5 inline-flex items-center gap-1 text-[0.7rem] text-primary-foreground/80">
                  <Sparkles className="size-3" /> AI dairy assistant
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="rounded-lg p-1.5 transition hover:bg-white/15"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.from === "user" ? "flex justify-end" : "flex"}
              >
                <div
                  className={
                    "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm " +
                    (m.from === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex">
                <div className="flex gap-1 rounded-2xl bg-secondary px-3.5 py-3">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.2s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.1s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}

            {/* Quick replies */}
            {!typing && options.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => onOption(opt)}
                    className="rounded-full border border-primary/30 bg-card px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border/60 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              placeholder="Type a message…"
              className="field-control py-2 pl-3 pr-3 text-sm"
            />
            <button
              onClick={onSend}
              aria-label="Send"
              className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:bg-primary/90"
            >
              <Send className="size-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
