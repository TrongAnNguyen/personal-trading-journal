import { Button } from "@/components/ui/button";
import { getTrades } from "@/lib/actions/trades";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export async function RecentActivity() {
  const trades = await getTrades();
  const recentTrades = trades.slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">Recent Activity</h2>
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
                    className={`rounded-lg p-2 ${
                      trade.side === "LONG"
                        ? "bg-profit/10 text-profit"
                        : "bg-loss/10 text-loss"
                    }`}
                  >
                    {trade.side === "LONG" ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{trade.symbol}</p>
                    <p className="text-muted-foreground text-2.5 font-medium">
                      {new Date(trade.entryTime).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {trade.pnl !== null && (
                  <span
                    className={`text-lg font-bold tracking-tight ${
                      Number(trade.pnl) >= 0 ? "text-profit" : "text-loss"
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
  );
}
