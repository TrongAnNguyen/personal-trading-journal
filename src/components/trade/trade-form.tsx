"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  ListChecks,
  Loader2,
  PlusCircle,
  Tags,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { createTrade } from "@/app/actions";
import { ChecklistManager } from "@/components/trade/checklist-manager";
import { TagSelector } from "@/components/trade/tag-selector";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  type Account,
  AssetClass,
  type CreateTradeInput,
  createTradeSchema,
  Emotion,
} from "@/types/trade";

interface TradeFormProps {
  accounts: Account[];
  onSuccess?: () => void;
}

export function TradeForm({ accounts, onSuccess }: TradeFormProps) {
  const [isPending, startTransition] = useTransition();

  const hasAccounts = accounts.length > 0;

  const form = useForm<z.input<typeof createTradeSchema>>({
    resolver: zodResolver(createTradeSchema),
    defaultValues: {
      accountId: accounts.length === 1 ? accounts[0].id : "",
      symbol: "",
      assetClass: "CRYPTO",
      side: "LONG",
      entryPrice: "" as unknown as number,
      quantity: "" as unknown as number,
      fees: 0,
      stopLoss: undefined,
      takeProfit: undefined,
      emotionEntry: undefined,
      notes: "",
      tags: [],
      checklist: [],
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await createTrade(data as CreateTradeInput);
        form.reset();
        onSuccess?.();
      } catch (error) {
        console.error("Failed to create trade:", error);
      }
    });
  });

  const selectedSide = form.watch("side");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Asset Details */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Asset Details
            </CardTitle>
            <CardDescription>
              Enter the trading pair and position details
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {!hasAccounts ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-center sm:col-span-2 dark:border-amber-900/50 dark:bg-amber-950/20">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                <div>
                  <p className="font-semibold text-amber-900 dark:text-amber-400">
                    No portfolio accounts found
                  </p>
                  <p className="text-sm text-amber-700 dark:text-amber-500/80">
                    You need to create a portfolio account before you can log
                    trades.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild className="mt-1">
                  <Link href="/dashboard/accounts">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Portfolio Account
                  </Link>
                </Button>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="accountId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.name} ({account.currency})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="symbol"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Symbol</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="BTC/USDT"
                      {...field}
                      className="uppercase"
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assetClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asset Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!hasAccounts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(AssetClass).map((ac) => (
                        <SelectItem key={ac} value={ac}>
                          {ac}
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
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Side</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!hasAccounts}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select side" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LONG">
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-emerald-500" />
                          Long
                        </span>
                      </SelectItem>
                      <SelectItem value="SHORT">
                        <span className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-rose-500" />
                          Short
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Execution Data */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Execution Data</CardTitle>
            <CardDescription>
              Entry price, quantity, and risk management levels
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="entryPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entry Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="stopLoss"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stop Loss</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Optional"
                      {...field}
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="takeProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Take Profit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="Optional"
                      {...field}
                      disabled={!hasAccounts}
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
                  <FormLabel>Fees</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      {...field}
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Psychology */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="h-5 w-5" />
              Psychology
            </CardTitle>
            <CardDescription>
              Track your emotional state at trade entry
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="emotionEntry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emotional State</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={!hasAccounts}
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
              name="notes"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Trade Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Why are you taking this trade? What's your thesis?"
                      className="min-h-25 resize-y"
                      {...field}
                      disabled={!hasAccounts}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Tags & Checklist */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Tags */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Tags className="h-5 w-5" />
                Tags
              </CardTitle>
              <CardDescription>
                Categorize your trade (Strategy, Setup, etc.)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <TagSelector
                        selectedTagIds={field.value || []}
                        onTagsChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ListChecks className="h-5 w-5" />
                Dicipline Checklist
              </CardTitle>
              <CardDescription>
                Confirm your trading plan before entry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="checklist"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <ChecklistManager
                        items={field.value || []}
                        onItemsChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </div>

        <Separator />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending || !hasAccounts}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isPending || !hasAccounts}
            className={
              selectedSide === "LONG"
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>Open {selectedSide === "LONG" ? "Long" : "Short"} Trade</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
