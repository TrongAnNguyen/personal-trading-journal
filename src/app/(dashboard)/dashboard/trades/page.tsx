import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getTrades } from "@/app/actions";
import { TradeList } from "@/components/trade/trade-list";
import { Plus, Filter } from "lucide-react";

export default async function TradesPage() {
  const trades = await getTrades();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trades</h1>
          <p className="text-muted-foreground">
            View and manage all your trades
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button asChild>
            <Link href="/dashboard/trades/new">
              <Plus className="mr-2 h-4 w-4" />
              New Trade
            </Link>
          </Button>
        </div>
      </div>

      {/* Trade List */}
      <TradeList trades={trades} />
    </div>
  );
}
