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
          <div className="text-muted-foreground flex h-50 items-center justify-center">
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
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-tight">
          <BarChart3 className="text-primary h-4 w-4" />
          Win/Loss Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-profit/10 border-profit/20 rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-profit text-2xl font-bold tracking-tight">
              {wins}
            </p>
            <p className="text-2.5 text-profit/60 mt-1 font-bold tracking-widest uppercase">
              Wins
            </p>
            <p className="text-2.5 text-muted-foreground mt-1 font-medium">
              Avg: ${averageWin.toFixed(2)}
            </p>
          </div>
          <div className="bg-loss/10 border-loss/20 rounded-2xl border p-4 text-center shadow-sm">
            <p className="text-loss text-2xl font-bold tracking-tight">
              {losses}
            </p>
            <p className="text-2.5 text-loss/60 mt-1 font-bold tracking-widest uppercase">
              Losses
            </p>
            <p className="text-2.5 text-muted-foreground mt-1 font-medium">
              Avg: ${averageLoss.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="mt-4 h-37.5 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontWeight={500}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                dataKey="name"
                type="category"
                stroke="var(--muted-foreground)"
                fontSize={10}
                fontWeight={600}
                width={60}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(var(--background), 0.8)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "600",
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.02)", radius: 10 }}
                formatter={(value, name) => [
                  value as number,
                  name === "count" ? "Count" : name,
                ]}
              />
              <Bar dataKey="count" radius={[0, 10, 10, 0]} barSize={24}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.name === "Wins" ? "var(--profit)" : "var(--loss)"
                    }
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
