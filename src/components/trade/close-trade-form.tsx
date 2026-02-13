"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { closeTradeSchema, type CloseTradeInput, Emotion } from "@/types/trade";
import { closeTrade } from "@/lib/actions/trades";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Loader2, BookOpen } from "lucide-react";

interface CloseTradeFormProps {
  tradeId: string;
  symbol: string;
  side: string;
  entryPrice: number;
}

export function CloseTradeForm({
  tradeId,
  symbol,
  side,
  entryPrice,
}: CloseTradeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.input<typeof closeTradeSchema>>({
    resolver: zodResolver(closeTradeSchema),
    defaultValues: {
      exitPrice: "" as unknown as number,
      fees: 0,
      emotionExit: undefined,
      lessonsLearned: "",
    },
  });

  const exitPrice = form.watch("exitPrice");
  const estimatedPnL =
    exitPrice && side === "LONG"
      ? exitPrice - entryPrice
      : exitPrice && side === "SHORT"
        ? entryPrice - exitPrice
        : 0;

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await closeTrade(tradeId, data as CloseTradeInput);
        router.push("/dashboard/trades");
      } catch (error) {
        console.error("Failed to close trade:", error);
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Trade Summary */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Closing Position</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Symbol:</span>{" "}
              <span className="font-medium">{symbol}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Side:</span>{" "}
              <span
                className={
                  side === "LONG" ? "text-emerald-500" : "text-rose-500"
                }
              >
                {side}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Entry:</span>{" "}
              <span className="font-mono">${entryPrice}</span>
            </div>
            {exitPrice && (
              <div>
                <span className="text-muted-foreground">Est. PnL:</span>{" "}
                <span
                  className={`font-mono font-medium ${
                    estimatedPnL >= 0 ? "text-emerald-500" : "text-rose-500"
                  }`}
                >
                  {estimatedPnL >= 0 ? "+" : ""}
                  {estimatedPnL.toFixed(2)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exit Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <X className="h-5 w-5" />
              Exit Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="exitPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exit Fees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Post-Trade Review */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Post-Trade Review
            </CardTitle>
            <CardDescription>
              Reflect on your trade and capture lessons learned
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="emotionExit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional State at Exit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How are you feeling?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Emotion).map((emotion) => (
                        <SelectItem key={emotion} value={emotion}>
                          {emotion.charAt(0) + emotion.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lessonsLearned"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lessons Learned</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you learn from this trade? What would you do differently?"
                      className="min-h-[120px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Closing...
              </>
            ) : (
              "Close Trade"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
