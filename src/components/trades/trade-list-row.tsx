"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Trade } from "@/types/trade";
import { format } from "date-fns";
import {
  Edit,
  Eye,
  Loader2,
  MoreHorizontal,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export function TradeListRow({
  trade,
  isPending,
  deletingId,
  onDelete,
}: TradeListRowProps) {
  const router = useRouter();

  return (
    <TableRow
      className="border-border/30 hover:bg-primary/2 cursor-pointer transition-colors"
      onClick={() => router.push(`/dashboard/trades/${trade.id}`)}
    >
      <TableCell className="py-4 pl-6">
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight">
            {trade.symbol}
          </span>
          <span className="text-muted-foreground text-2.5 font-bold tracking-wider uppercase">
            {trade.assetClass}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            "text-2.5 rounded-full border-none px-2.5 py-0.5 font-bold tracking-wider uppercase shadow-sm",
            trade.side === "LONG"
              ? "text-profit bg-profit/10"
              : "text-loss bg-loss/10",
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
      <TableCell className="text-sm font-medium tabular-nums">
        {formatPrice(Number(trade.entryPrice))}
      </TableCell>
      <TableCell className="text-muted-foreground text-sm font-medium tabular-nums">
        {trade.exitPrice ? formatPrice(Number(trade.exitPrice)) : "—"}
      </TableCell>
      <TableCell className="text-sm font-medium tabular-nums">
        {formatPrice(Number(trade.volume))}
      </TableCell>
      <TableCell>
        {trade.pnl !== null && trade.pnl !== undefined ? (
          <span
            className={`text-sm font-bold tabular-nums ${
              Number(trade.pnl) >= 0 ? "text-profit" : "text-loss"
            }`}
          >
            {formatPnL(Number(trade.pnl))}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        )}
      </TableCell>
      <TableCell className="text-primary/80 text-sm font-bold">
        {trade.riskReward ? `${trade.riskReward}R` : "—"}
      </TableCell>
      <TableCell>
        <Badge
          variant={trade.status === "OPEN" ? "default" : "secondary"}
          className="text-2.5 rounded-full font-bold tracking-wider uppercase"
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
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 h-9 w-9 rounded-xl transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
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
