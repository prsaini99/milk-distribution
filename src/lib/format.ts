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
