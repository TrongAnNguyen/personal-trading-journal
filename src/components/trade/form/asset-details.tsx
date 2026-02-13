"use client";

import { useFormContext } from "react-hook-form";
import { AlertCircle, PlusCircle, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
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
import { AssetClass, type Account } from "@/types/trade";

interface AssetDetailsProps {
  accounts: Account[];
  hasAccounts: boolean;
}

export function AssetDetails({ accounts, hasAccounts }: AssetDetailsProps) {
  const { control } = useFormContext();

  return (
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
            control={control}
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
          control={control}
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
          control={control}
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
          control={control}
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
  );
}
