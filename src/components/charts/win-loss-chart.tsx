"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

interface WinLossChartProps {
  wins: number;
  losses: number;
  averageWin: number;
  averageLoss: number;
}

export function WinLossChart({
  wins,
  losses,
  averageWin,
  averageLoss,
}: WinLossChartProps) {
  const total = wins + losses;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Win/Loss Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground flex h-[200px] items-center justify-center">
            No closed trades yet
          </div>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Wins", count: wins, average: averageWin, color: "#10b981" },
    { name: "Losses", count: losses, average: averageLoss, color: "#ef4444" },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Win/Loss Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-emerald-500">{wins}</p>
            <p className="text-muted-foreground text-xs">
              Wins (Avg: ${averageWin.toFixed(2)})
            </p>
          </div>
          <div className="rounded-lg bg-rose-500/10 p-3 text-center">
            <p className="text-2xl font-bold text-rose-500">{losses}</p>
            <p className="text-muted-foreground text-xs">
              Losses (Avg: ${averageLoss.toFixed(2)})
            </p>
          </div>
        </div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis type="number" stroke="#888" fontSize={12} />
              <YAxis
                dataKey="name"
                type="category"
                stroke="#888"
                fontSize={12}
                width={60}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  borderRadius: "8px",
                }}
                formatter={(value, name) => [
                  value as number,
                  name === "count" ? "Trades" : (name as string),
                ]}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
