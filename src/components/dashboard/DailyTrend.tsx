import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { dailySales } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Mode = "tickets" | "revenue";

export function DailyTrend({ from, to }: { from: string; to: string }) {
  const [mode, setMode] = useState<Mode>("tickets");

  const data = useMemo(
    () => dailySales.filter((d) => d.date >= from && d.date <= to),
    [from, to],
  );

  const max = Math.max(...data.map((d) => (mode === "tickets" ? d.tickets : d.revenue)), 0);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <div className="inline-flex rounded-md border border-border bg-card p-0.5 text-xs">
          {(["tickets", "revenue"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1 rounded transition-colors",
                mode === m ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "tickets" ? "票數" : "營收"}
            </button>
          ))}
        </div>
      </div>
      <div className="h-[260px]">
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tickFormatter={(v: string) => v.slice(5)}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              interval={Math.max(0, Math.floor(data.length / 8) - 1)}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              width={50}
              tickFormatter={(v: number) =>
                mode === "revenue" ? `${(v / 1000).toFixed(0)}k` : `${v}`
              }
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
              formatter={(v: number) =>
                mode === "revenue" ? [`NT$ ${v.toLocaleString()}`, "營收"] : [v, "票數"]
              }
            />
            <Bar dataKey={mode} radius={[3, 3, 0, 0]}>
              {data.map((d) => {
                const v = mode === "tickets" ? d.tickets : d.revenue;
                return (
                  <Cell key={d.date} fill={v === max ? "var(--accent)" : "oklch(0.88 0 0)"} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
