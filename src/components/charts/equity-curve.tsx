"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import type { EquityPoint } from "@/types/trade";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface EquityCurveChartProps {
  data: EquityPoint[];
}

export function EquityCurveChart({ data }: EquityCurveChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Equity Curve
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[300px] items-center justify-center">
            No closed trades yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const initialEquity = data[0]?.equity ?? 0;
  const currentEquity = data[data.length - 1]?.equity ?? 0;
  const percentChange = ((currentEquity - initialEquity) / initialEquity) * 100;
  const isPositive = currentEquity >= initialEquity;

  const formattedData = data.map((point) => ({
    ...point,
    date: format(new Date(point.date), "MMM d"),
    fullDate: format(new Date(point.date), "PPp"),
  }));

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Equity Curve
            </CardTitle>
            <p className="text-xs text-muted-foreground font-medium">Performance analytics and trend tracking</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold tracking-tight">
              ${currentEquity.toLocaleString()}
            </p>
            <p
              className={`text-sm font-bold ${
                isPositive ? "text-[var(--profit)]" : "text-[var(--loss)]"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 5, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--border)" strokeOpacity={0.2} vertical={false} />
              <XAxis
                dataKey="date"
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontWeight={500}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                dx={-10}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(var(--background), 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)"
                }}
                itemStyle={{ padding: "0px" }}
                labelFormatter={(label) => `Date: ${label}`}
                formatter={(value) => [
                  `$${(value as number).toLocaleString()}`,
                  "Equity",
                ]}
              />
              <ReferenceLine
                y={initialEquity}
                stroke="var(--muted-foreground)"
                strokeOpacity={0.2}
                strokeDasharray="4 4"
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
