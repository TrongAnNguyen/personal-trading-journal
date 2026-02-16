"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteTrade } from "@/lib/actions/trades";
import type { Trade } from "@/types/trade";
import { TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { TradeListRow } from "./trade-list-row";

interface TradeListTableProps {
  trades: Trade[];
}

export function TradeListTable({ trades }: TradeListTableProps) {
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
      <div className="glass-morphism flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-24 text-center">
        <div className="bg-primary/10 text-primary shadow-primary/10 mb-6 rounded-2xl p-5 shadow-lg">
          <TrendingUp className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold tracking-tight">No Trade History</h3>
        <p className="text-muted-foreground mt-2 max-w-xs text-sm">
          Your trade log is currently empty. Start by adding your first
          execution.
        </p>
        <Button asChild className="mt-8 rounded-xl px-8" size="lg">
          <Link href="/dashboard/trades/new">Add New Trade</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-morphism overflow-hidden rounded-3xl">
      <Table>
        <TableHeader className="bg-primary/5">
          <TableRow className="border-border/30 hover:bg-transparent">
            <TableHead className="text-muted-foreground w-30 py-5 pl-6 text-xs font-bold tracking-wider uppercase">
              Symbol
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Side
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Entry
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Exit
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Qty
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              PnL
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              R:R
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Status
            </TableHead>
            <TableHead className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              Date
            </TableHead>
            <TableHead className="w-20 pr-6"></TableHead>
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
