"use client";

import { useState, useTransition } from "react";
import type { Trade } from "@/types/trade";
import { deleteTrade } from "@/lib/actions/trades";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { TradeListRow } from "./trade-list-row";

interface TradeListProps {
  trades: Trade[];
}

export function TradeList({ trades }: TradeListProps) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (tradeId: string) => {
    setDeletingId(tradeId);
    startTransition(async () => {
      try {
        await deleteTrade(tradeId);
      } catch (error) {
        console.error("Failed to delete trade:", error);
      } finally {
        setDeletingId(null);
      }
    });
  };

  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center glass-morphism rounded-3xl border-dashed border-2">
        <div className="mb-6 rounded-2xl bg-primary/10 p-5 text-primary shadow-lg shadow-primary/10">
          <TrendingUp className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">No Trade History</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-xs">
          Your trade log is currently empty. Start by adding your first execution.
        </p>
        <Button asChild className="mt-8 rounded-xl px-8" size="lg">
          <Link href="/dashboard/trades/new">Add New Trade</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-morphism rounded-3xl overflow-hidden">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow className="hover:bg-transparent border-border/30">
            <TableHead className="w-[120px] font-bold text-xs uppercase tracking-wider text-muted-foreground py-5 pl-6">Symbol</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Side</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Entry</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Exit</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Qty</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">PnL</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">R:R</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Status</TableHead>
            <TableHead className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Date</TableHead>
            <TableHead className="w-[80px] pr-6"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trades.map((trade) => (
            <TradeListRow
              key={trade.id}
              trade={trade}
              isPending={isPending}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
