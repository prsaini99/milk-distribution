import { getInsights } from "@/server/services/analytics.service";
import { InsightsPanel } from "@/components/admin/InsightsPanel";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const insights = await getInsights();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          AI Analytics
        </p>
        <h1 className="mt-1 text-2xl font-bold">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Ask plain-English questions about your store — answered from live
          data.
        </p>
      </header>

      <div className="max-w-2xl">
        <InsightsPanel insights={insights} />
      </div>
    </div>
  );
}
