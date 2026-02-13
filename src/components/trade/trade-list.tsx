"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import type { Tag as TagType, Trade } from "@/types/trade";
import { deleteTrade } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  Eye,
  Trash2,
  Edit,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";

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

  const formatPrice = (price: number | null | undefined) => {
    if (!price) return "-";
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price);
  };

  const formatPnL = (pnl: number | null | undefined) => {
    if (pnl === null || pnl === undefined) return "-";
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      signDisplay: "always",
    }).format(pnl);
    return formatted;
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
            <TableRow key={trade.id}>
              <TableCell className="font-medium">
                <div className="flex flex-col">
                  <span>{trade.symbol}</span>
                  <span className="text-muted-foreground text-xs">
                    {trade.assetClass}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    trade.side === "LONG"
                      ? "border-emerald-500/50 text-emerald-500"
                      : "border-rose-500/50 text-rose-500"
                  }
                >
                  {trade.side === "LONG" ? (
                    <TrendingUp className="mr-1 h-3 w-3" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3" />
                  )}
                  {trade.side}
                </Badge>
              </TableCell>
              <TableCell className="font-mono text-sm">
                {formatPrice(Number(trade.entryPrice))}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {trade.exitPrice ? formatPrice(Number(trade.exitPrice)) : "-"}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {formatPrice(Number(trade.quantity))}
              </TableCell>
              <TableCell>
                {trade.pnl !== null && trade.pnl !== undefined ? (
                  <span
                    className={`font-mono font-medium ${
                      Number(trade.pnl) >= 0
                        ? "text-emerald-500"
                        : "text-rose-500"
                    }`}
                  >
                    {formatPnL(Number(trade.pnl))}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell className="font-mono">
                {trade.riskReward ? `${trade.riskReward}R` : "-"}
              </TableCell>
              <TableCell>
                <Badge
                  variant={trade.status === "OPEN" ? "default" : "secondary"}
                >
                  {trade.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(trade.entryTime), "MMM d, yyyy")}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {isPending && deletingId === trade.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreHorizontal className="h-4 w-4" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/trades/${trade.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    {trade.status === "OPEN" && (
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/trades/${trade.id}/close`}>
                          <X className="mr-2 h-4 w-4" />
                          Close Trade
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/trades/${trade.id}/edit`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(trade.id)}
                      className="text-destructive"
                      disabled={isPending}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
