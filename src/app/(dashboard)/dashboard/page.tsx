import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTrades } from "@/app/actions";
import { calculateMetrics } from "@/lib/calculations";
import type { Trade } from "@/types/trade";
import {
  TrendingUp,
  TrendingDown,
  Target,
  AlertTriangle,
  DollarSign,
  Activity,
  Plus,
} from "lucide-react";

export default async function DashboardPage() {
  const rawTrades = await getTrades();

  // Convert Prisma Decimal to number for calculations
  const trades: Trade[] = rawTrades.map((t: (typeof rawTrades)[number]) => ({
    ...t,
    entryPrice: Number(t.entryPrice),
    exitPrice: t.exitPrice ? Number(t.exitPrice) : null,
    quantity: Number(t.quantity),
    fees: t.fees ? Number(t.fees) : null,
    stopLoss: t.stopLoss ? Number(t.stopLoss) : null,
    takeProfit: t.takeProfit ? Number(t.takeProfit) : null,
    pnl: t.pnl ? Number(t.pnl) : null,
    riskReward: t.riskReward ? Number(t.riskReward) : null,
    tags: t.tags?.map((tt: (typeof t.tags)[number]) => tt.tag) ?? [],
    attachments: t.attachments ?? [],
    checklist: t.checklist ?? [],
  }));

  const metrics = calculateMetrics(trades);
  const openTrades = trades.filter((t) => t.status === "OPEN");
  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your trading performance and psychology
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/trades/new">
            <Plus className="mr-2 h-4 w-4" />
            New Trade
          </Link>
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                metrics.totalPnL >= 0 ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {metrics.totalPnL >= 0 ? "+" : ""}$
              {metrics.totalPnL.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.totalTrades} closed trades
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.winRate}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.winningTrades}W / {metrics.losingTrades}L
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.profitFactor}</div>
            <p className="text-xs text-muted-foreground">
              Gross profit / Gross loss
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Max Drawdown</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-500">
              -${metrics.maxDrawdown.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Peak to trough</p>
          </CardContent>
        </Card>
      </div>

      {/* Open Trades & Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Open Positions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Open Positions
              {openTrades.length > 0 && (
                <Badge variant="secondary">{openTrades.length}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {openTrades.length === 0 ? (
              <p className="text-muted-foreground text-sm">No open positions</p>
            ) : (
              <div className="space-y-3">
                {openTrades.slice(0, 5).map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {trade.side === "LONG" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                      )}
                      <div>
                        <p className="font-medium">{trade.symbol}</p>
                        <p className="text-xs text-muted-foreground">
                          {trade.assetClass}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-sm">
                        ${Number(trade.entryPrice).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {Number(trade.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Trades */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Trades</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/trades">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentTrades.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No trades yet. Start logging your trades!
              </p>
            ) : (
              <div className="space-y-3">
                {recentTrades.map((trade) => (
                  <div
                    key={trade.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {trade.side === "LONG" ? (
                        <TrendingUp className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-rose-500" />
                      )}
                      <div>
                        <p className="font-medium">{trade.symbol}</p>
                        <Badge variant="outline" className="text-[10px]">
                          {trade.status}
                        </Badge>
                      </div>
                    </div>
                    {trade.pnl !== null && (
                      <span
                        className={`font-mono font-medium ${
                          Number(trade.pnl) >= 0
                            ? "text-emerald-500"
                            : "text-rose-500"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
