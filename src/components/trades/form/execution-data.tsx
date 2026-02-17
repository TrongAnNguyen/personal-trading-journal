"use client";

import { useFormContext } from "react-hook-form";
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

interface ExecutionDataProps {
  disabled?: boolean;
}

export function ExecutionData({ disabled }: ExecutionDataProps) {
  const { control } = useFormContext();

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Execution Data</CardTitle>
        <CardDescription>
          Entry price, volume, and risk management levels
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField
          control={control}
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
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="volume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volume</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  {...field}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
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
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
