import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTrades } from "@/lib/actions/trades";
import { TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export async function LiveTrades() {
  const openTrades = await getTrades(undefined, "OPEN");

  return (
    <div className="space-y-6">
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
            <Link key={trade.id} href={`/dashboard/trades/${trade.id}`}>
              <Card className="group border-transparent transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-6">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg transition-all ${
                        trade.side === "LONG"
                          ? "bg-profit/20 text-profit shadow-green-500/10"
                          : "bg-loss/20 text-loss shadow-red-500/10"
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
                      <p className="text-muted-foreground text-2.5 font-bold tracking-wider uppercase">
                        {trade.assetClass} • {trade.side}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold tracking-tight">
                      ${Number(trade.entryPrice).toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-2.5 font-bold tracking-wider uppercase">
                      Vol: {Number(trade.volume).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
