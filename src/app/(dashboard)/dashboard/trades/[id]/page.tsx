import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getTrade } from "@/lib/actions/trades";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Edit,
  X,
  Calendar,
  DollarSign,
  Target,
  AlertCircle,
} from "lucide-react";

interface TradeDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TradeDetailPage({
  params,
}: TradeDetailPageProps) {
  const { id } = await params;
  const trade = await getTrade(id);

  if (!trade) {
    notFound();
  }

  const entryPrice = Number(trade.entryPrice);
  const exitPrice = trade.exitPrice ? Number(trade.exitPrice) : null;
  const volume = Number(trade.volume);
  const pnl = trade.pnl ? Number(trade.pnl) : null;
  const riskReward = trade.riskReward ? Number(trade.riskReward) : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/trades">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {trade.symbol}
              </h1>
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
              <Badge
                variant={trade.status === "OPEN" ? "default" : "secondary"}
              >
                {trade.status}
              </Badge>
            </div>
            <p className="text-muted-foreground">{trade.assetClass}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {trade.status === "OPEN" && (
            <Button variant="outline" asChild>
              <Link href={`/dashboard/trades/${id}/close`}>
                <X className="mr-2 h-4 w-4" />
                Close Trade
              </Link>
            </Button>
          )}
          <Button variant="outline" asChild>
            <Link href={`/dashboard/trades/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      {/* PnL Card */}
      {pnl !== null && (
        <Card
          className={
            pnl >= 0
              ? "border-emerald-500/20 bg-emerald-500/5"
              : "border-rose-500/20 bg-rose-500/5"
          }
        >
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Net Profit/Loss</p>
                <p
                  className={`text-4xl font-bold ${
                    pnl >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                </p>
              </div>
              {riskReward !== null && (
                <div className="text-right">
                  <p className="text-muted-foreground text-sm">Risk/Reward</p>
                  <p className="text-2xl font-bold">{riskReward}R</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Execution Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Execution Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Entry Price</p>
                <p className="font-mono text-lg">
                  ${entryPrice.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Exit Price</p>
                <p className="font-mono text-lg">
                  {exitPrice ? `$${exitPrice.toLocaleString()}` : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Volume</p>
                <p className="font-mono text-lg">{volume.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Fees</p>
                <p className="font-mono text-lg">
                  ${trade.fees ? Number(trade.fees).toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Stop Loss</p>
                <p className="font-mono">
                  {trade.stopLoss
                    ? `$${Number(trade.stopLoss).toLocaleString()}`
                    : "-"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Take Profit</p>
                <p className="font-mono">
                  {trade.takeProfit
                    ? `$${Number(trade.takeProfit).toLocaleString()}`
                    : "-"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Timing
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-muted-foreground text-sm">Entry Time</p>
              <p className="font-medium">
                {format(new Date(trade.entryTime), "PPpp")}
              </p>
            </div>
            {trade.exitTime && (
              <div>
                <p className="text-muted-foreground text-sm">Exit Time</p>
                <p className="font-medium">
                  {format(new Date(trade.exitTime), "PPpp")}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Psychology */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Psychology
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-muted-foreground text-sm">Entry Emotion</p>
                <Badge variant="outline">
                  {trade.emotionEntry ?? "Not recorded"}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Exit Emotion</p>
                <Badge variant="outline">
                  {trade.emotionExit ?? "Not recorded"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {trade.tags && trade.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {trade.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    style={{ backgroundColor: tag.color ?? undefined }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No tags</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      {(trade.notes || trade.lessonsLearned) && (
        <Card>
          <CardHeader>
            <CardTitle>Notes & Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {trade.notes && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">
                  Trade Notes
                </p>
                <p className="whitespace-pre-wrap">{trade.notes}</p>
              </div>
            )}
            {trade.lessonsLearned && (
              <div>
                <p className="text-muted-foreground mb-2 text-sm font-medium">
                  Lessons Learned
                </p>
                <p className="whitespace-pre-wrap">{trade.lessonsLearned}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
