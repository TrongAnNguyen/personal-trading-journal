import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";
import { MetricsGrid } from "@/components/dashboard/metrics-grid";
import { LiveTrades } from "@/components/dashboard/live-trades";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import {
  MetricsSkeleton,
  LiveTradesSkeleton,
  RecentActivitySkeleton,
} from "@/components/dashboard/dashboard-skeleton";

export default function DashboardPage() {
  return (
    <div className="animate-in fade-in space-y-10 duration-700">
      {/* Header */}
      <div className="flex flex-col gap-4 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
            Dashboard<span className="text-primary text-6xl">.</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Real-time performance analytics and trade metrics.
          </p>
        </div>
        <div className="flex gap-4">
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/5 text-primary rounded-full px-4 py-1.5 font-medium"
          >
            System Stable
          </Badge>
          <Badge
            variant="outline"
            className="border-border/50 rounded-full px-4 py-1.5 font-medium"
          >
            v2.1.0-GLASS
          </Badge>
        </div>
      </div>

      {/* Metrics Grid */}
      <Suspense fallback={<MetricsSkeleton />}>
        <MetricsGrid />
      </Suspense>

      {/* Open Trades & Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Suspense fallback={<LiveTradesSkeleton />}>
            <LiveTrades />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<RecentActivitySkeleton />}>
            <RecentActivity />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
