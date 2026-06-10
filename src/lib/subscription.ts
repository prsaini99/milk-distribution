import type {
  SubscriptionFrequency,
  SubscriptionStatus,
} from "@/domain";

export const FREQUENCY_OPTIONS: SubscriptionFrequency[] = ["daily", "weekly"];

export const FREQUENCY_LABELS: Record<SubscriptionFrequency, string> = {
  daily: "Daily",
  weekly: "Weekly",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  active: "Active",
  paused: "Paused",
  cancelled: "Cancelled",
};

export const SUBSCRIPTION_STATUS_STYLES: Record<SubscriptionStatus, string> = {
  active: "bg-green-100 text-green-700",
  paused: "bg-amber-100 text-amber-700",
  cancelled: "bg-slate-200 text-slate-600",
};
