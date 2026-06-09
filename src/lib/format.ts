import type { Unit } from "@/domain";

/**
 * Format an integer paise amount as an Indian Rupee string.
 * e.g. formatCurrency(3050) -> "₹30.50"
 */
export function formatCurrency(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Human label for a product pack size. e.g. formatPack(500, "ml") -> "500 ml"
 */
export function formatPack(size: number, unit: Unit): string {
  return `${size} ${unit}`;
}

/**
 * Format an ISO timestamp as a short, readable date-time.
 * e.g. "9 Jun 2026, 2:30 pm"
 */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
