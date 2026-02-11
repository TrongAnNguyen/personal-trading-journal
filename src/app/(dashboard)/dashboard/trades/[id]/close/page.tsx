import Link from "next/link";
import { notFound } from "next/navigation";
import { getTrade } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { CloseTradeForm } from "@/components/trade/close-trade-form";
import { ArrowLeft } from "lucide-react";

interface CloseTradePageProps {
  params: Promise<{ id: string }>;
}

export default async function CloseTradePage({ params }: CloseTradePageProps) {
  const { id } = await params;
  const trade = await getTrade(id);

  if (!trade) {
    notFound();
  }

  if (trade.status === "CLOSED") {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/dashboard/trades/${id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Close Trade</h1>
          <p className="text-muted-foreground">
            Close your {trade.symbol} {trade.side.toLowerCase()} position
          </p>
        </div>
      </div>

      {/* Close Trade Form */}
      <CloseTradeForm
        tradeId={id}
        symbol={trade.symbol}
        side={trade.side}
        entryPrice={Number(trade.entryPrice)}
      />
    </div>
  );
}
