import Link from "next/link";
import { Repeat } from "lucide-react";
import { getCurrentUser } from "@/server/services/auth.service";
import { listUserSubscriptions } from "@/server/services/subscription.service";
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard";
import { buttonVariants } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AccountSubscriptionsPage() {
  const user = await getCurrentUser();
  const subscriptions = await listUserSubscriptions(user.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <p className="text-sm text-muted-foreground">
          Recurring deliveries — pause, adjust or cancel anytime.
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="surface-card p-10 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Repeat className="size-6" />
          </div>
          <p className="mt-4 font-medium">No subscriptions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Subscribe to your daily essentials and never run out.
          </p>
          <Link href="/" className={buttonVariants({ className: "mt-5" })}>
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <SubscriptionCard key={sub.id} sub={sub} />
          ))}
        </div>
      )}
    </div>
  );
}
