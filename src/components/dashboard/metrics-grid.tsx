import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTrades } from "@/lib/actions/trades";
import { calculateMetrics } from "@/lib/calculations";
import { DollarSign, Target, Activity, AlertTriangle } from "lucide-react";

export async function MetricsGrid() {
  const trades = await getTrades(undefined, "CLOSED");
  const metrics = calculateMetrics(trades);

  return (
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
              metrics.totalPnL >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {metrics.totalPnL >= 0 ? "+" : ""}$
            {metrics.totalPnL.toLocaleString()}
          </div>
          <div className="bg-secondary mt-4 h-1.5 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full transition-all duration-1000"
              style={{
                width: `${metrics.totalTrades > 0 ? Math.min(100, (metrics.winningTrades / metrics.totalTrades) * 100) : 0}%`,
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
          <p className="text-muted-foreground text-2.5 mt-2 font-bold tracking-wide">
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
          <p className="text-muted-foreground text-2.5 mt-2 font-bold tracking-wide">
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
          <div className="text-loss text-4xl font-bold tracking-tight">
            -${metrics.maxDrawdown.toLocaleString()}
          </div>
          <p className="text-muted-foreground text-2.5 mt-2 font-bold tracking-wide uppercase">
            Risk exposure
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
