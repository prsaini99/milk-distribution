/**
 * Barrel for the domain layer — the single source of truth for entity
 * shapes. Every other layer (services, repositories, UI) imports from here.
 */
export type { Category } from "./category";
export type { Product, Unit, PriceTier } from "./product";
export type { Cart, CartItem } from "./cart";
export type { Order, OrderItem, OrderStatus } from "./order";
export type { User, Address } from "./user";
export type {
  Subscription,
  SubscriptionFrequency,
  SubscriptionStatus,
} from "./subscription";
