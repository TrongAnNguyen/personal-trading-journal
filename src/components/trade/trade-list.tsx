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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted mb-4 rounded-full p-4">
          <TrendingUp className="text-muted-foreground h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold">No trades yet</h3>
        <p className="text-muted-foreground mt-1">
          Start logging your trades to track performance
        </p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/trades/new">Log Your First Trade</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Symbol</TableHead>
            <TableHead>Side</TableHead>
            <TableHead>Entry</TableHead>
            <TableHead>Exit</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>PnL</TableHead>
            <TableHead>R:R</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
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
