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
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-4">
        <CardTitle className="text-sm font-bold tracking-tight flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Win/Loss Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-[var(--profit)]/10 p-4 text-center border border-[var(--profit)]/20 shadow-sm">
            <p className="text-2xl font-bold text-[var(--profit)] tracking-tight">{wins}</p>
            <p className="text-[10px] font-bold text-[var(--profit)]/60 uppercase tracking-widest mt-1">
              Wins
            </p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">Avg: ${averageWin.toFixed(2)}</p>
          </div>
          <div className="rounded-2xl bg-[var(--loss)]/10 p-4 text-center border border-[var(--loss)]/20 shadow-sm">
            <p className="text-2xl font-bold text-[var(--loss)] tracking-tight">{losses}</p>
            <p className="text-[10px] font-bold text-[var(--loss)]/60 uppercase tracking-widest mt-1">
              Losses
            </p>
            <p className="text-[10px] font-medium text-muted-foreground mt-1">Avg: ${averageLoss.toFixed(2)}</p>
          </div>
        </div>
        <div className="h-[150px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={10} fontWeight={500} axisLine={false} tickLine={false} />
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
                  boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.1)"
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
                    fill={entry.name === "Wins" ? "var(--profit)" : "var(--loss)"} 
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
