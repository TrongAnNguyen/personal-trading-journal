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
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Equity Curve
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold">
              ${currentEquity.toLocaleString()}
            </p>
            <p
              className={`text-sm ${
                isPositive ? "text-emerald-500" : "text-rose-500"
              }`}
            >
              {isPositive ? "+" : ""}
              {percentChange.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="date"
                stroke="#888"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="#888"
                fontSize={12}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                labelFormatter={(_, payload) =>
                  payload[0]?.payload?.fullDate ?? ""
                }
                formatter={(value) => [
                  `$${(value as number).toLocaleString()}`,
                  "Equity",
                ]}
              />
              <ReferenceLine
                y={initialEquity}
                stroke="#666"
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="equity"
                stroke={isPositive ? "#10b981" : "#ef4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: isPositive ? "#10b981" : "#ef4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
