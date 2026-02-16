"use client";

import { format } from "date-fns";
import { Eye, Trash2, Edit, X, Loader2, MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Trade } from "@/types/trade";

interface TradeListRowProps {
  trade: Trade;
  isPending: boolean;
  deletingId: string | null;
  onDelete: (id: string) => void;
}

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

export function TradeListRow({ trade, isPending, deletingId, onDelete }: TradeListRowProps) {
  return (
    <TableRow className="border-border/30 transition-colors hover:bg-primary/[0.02]">
      <TableCell className="py-4 pl-6">
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-base">{trade.symbol}</span>
          <span className="text-muted-foreground text-2.5 font-bold uppercase tracking-wider">
            {trade.assetClass}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "rounded-full px-2.5 py-0.5 text-2.5 font-bold uppercase tracking-wider border-none shadow-sm",
            trade.side === "LONG"
              ? "text-profit bg-profit/10"
              : "text-loss bg-loss/10"
          )}
        >
          {trade.side === "LONG" ? (
            <TrendingUp className="mr-1.5 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1.5 h-3 w-3" />
          )}
          {trade.side}
        </Badge>
      </TableCell>
      <TableCell className="font-medium tabular-nums text-sm">
        {formatPrice(Number(trade.entryPrice))}
      </TableCell>
      <TableCell className="font-medium tabular-nums text-sm text-muted-foreground">
        {trade.exitPrice ? formatPrice(Number(trade.exitPrice)) : "—"}
      </TableCell>
      <TableCell className="font-medium tabular-nums text-sm">
        {formatPrice(Number(trade.quantity))}
      </TableCell>
      <TableCell>
        {trade.pnl !== null && trade.pnl !== undefined ? (
          <span
            className={`font-bold tabular-nums text-sm ${
              Number(trade.pnl) >= 0
                ? "text-profit"
                : "text-loss"
            }`}
          >
            {formatPnL(Number(trade.pnl))}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="font-bold text-sm text-primary/80">
        {trade.riskReward ? `${trade.riskReward}R` : "—"}
      </TableCell>
      <TableCell>
        <Badge
          variant={trade.status === "OPEN" ? "default" : "secondary"}
          className="rounded-full text-2.5 font-bold uppercase tracking-wider"
        >
          {trade.status}
        </Badge>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs font-medium">
        {format(new Date(trade.entryTime), "MMM d, yyyy")}
      </TableCell>
      <TableCell className="pr-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-colors">
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
              onClick={() => onDelete(trade.id)}
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
  );
}
