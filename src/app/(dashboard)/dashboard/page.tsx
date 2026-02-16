import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrades } from "@/lib/actions/trades";
import { calculateMetrics } from "@/lib/calculations";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  DollarSign,
  Activity,
} from "lucide-react";

export default async function DashboardPage() {
  const trades = await getTrades();

  const metrics = calculateMetrics(trades);
  const openTrades = trades.filter((t) => t.status === "OPEN");
  const recentTrades = trades.slice(0, 5);

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
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Net P&L
            </CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold tracking-tight ${
                metrics.totalPnL >= 0
                  ? "text-[var(--profit)]"
                  : "text-[var(--loss)]"
              }`}
            >
              {metrics.totalPnL >= 0 ? "+" : ""}$
              {metrics.totalPnL.toLocaleString()}
            </div>
            <div className="bg-secondary mt-4 h-1.5 w-full overflow-hidden rounded-full">
              <div
                className="bg-primary h-full transition-all duration-1000"
                style={{
                  width: `${Math.min(100, (metrics.winningTrades / metrics.totalTrades) * 100)}%`,
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Win Rate
            </CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight">
              {metrics.winRate}%
            </div>
            <p className="text-muted-foreground mt-2 text-[10px] font-bold tracking-wide">
              {metrics.winningTrades} WIN / {metrics.losingTrades} LOSS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Profit Factor
            </CardTitle>
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <Activity className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-primary text-4xl font-bold tracking-tight">
              {metrics.profitFactor}
            </div>
            <p className="text-muted-foreground mt-2 text-[10px] font-bold tracking-wide">
              PROFIT / LOSS RATIO
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-muted-foreground text-xs font-bold tracking-widest uppercase">
              Max Drawdown
            </CardTitle>
            <div className="bg-destructive/10 text-destructive rounded-lg p-2">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold tracking-tight text-[var(--loss)]">
              -${metrics.maxDrawdown.toLocaleString()}
            </div>
            <p className="text-muted-foreground mt-2 text-[10px] font-bold tracking-wide uppercase">
              Risk exposure
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Trades & Recent Activity */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Open Positions */}
        <div className="space-y-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center text-xl font-bold tracking-tight">
              <span className="bg-primary mr-3 flex h-2 w-2 animate-ping rounded-full" />
              Live Trades
            </h2>
            {openTrades.length > 0 && (
              <Badge variant="secondary" className="rounded-full px-3 py-0.5">
                {openTrades.length} Active
              </Badge>
            )}
          </div>

          {openTrades.length === 0 ? (
            <div className="border-border bg-muted/20 flex h-64 flex-col items-center justify-center rounded-3xl border border-dashed backdrop-blur-sm">
              <p className="text-muted-foreground text-sm font-medium">
                No active trades detected
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-xl"
                asChild
              >
                <Link href="/dashboard/trades/new">Start Trading</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {openTrades.slice(0, 5).map((trade) => (
                <Card
                  key={trade.id}
                  className="group hover:bg-primary/5 hover:border-primary/20 border-transparent transition-all duration-300"
                >
                  <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all ${
                          trade.side === "LONG"
                            ? "bg-[var(--profit)]/20 text-[var(--profit)] shadow-green-500/10"
                            : "bg-[var(--loss)]/20 text-[var(--loss)] shadow-red-500/10"
                        }`}
                      >
                        {trade.side === "LONG" ? (
                          <TrendingUp className="h-6 w-6" />
                        ) : (
                          <TrendingDown className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <p className="text-xl font-bold tracking-tight">
                          {trade.symbol}
                        </p>
                        <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                          {trade.assetClass} • {trade.side}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold tracking-tight">
                        ${Number(trade.entryPrice).toLocaleString()}
                      </p>
                      <p className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                        Vol: {Number(trade.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Trades */}
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight">
              Recent Activity
            </h2>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl text-xs"
              asChild
            >
              <Link href="/dashboard/trades">View All</Link>
            </Button>
          </div>

          <div className="border-border/50 glass-morphism overflow-hidden rounded-3xl border">
            {recentTrades.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-muted-foreground text-sm font-medium">
                  No recent trades
                </p>
              </div>
            ) : (
              <div className="divide-border/30 divide-y">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="hover:bg-primary/5 flex items-center justify-between p-5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`rounded-lg p-2 ${trade.side === "LONG" ? "bg-[var(--profit)]/10 text-[var(--profit)]" : "bg-[var(--loss)]/10 text-[var(--loss)]"}`}
                      >
                        {trade.side === "LONG" ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{trade.symbol}</p>
                        <p className="text-muted-foreground text-[10px] font-medium">
                          {new Date(trade.entryTime).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {trade.pnl !== null && (
                      <span
                        className={`text-lg font-bold tracking-tight ${
                          Number(trade.pnl) >= 0
                            ? "text-[var(--profit)]"
                            : "text-[var(--loss)]"
                        }`}
                      >
                        {Number(trade.pnl) >= 0 ? "+" : ""}$
                        {Number(trade.pnl).toFixed(2)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
