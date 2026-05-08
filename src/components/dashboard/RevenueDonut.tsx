import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { tickets } from "@/lib/mock-data";

const NEUTRAL = "var(--muted-foreground)";
const ACCENT = "var(--accent)";

export function RevenueDonut() {
  const data = [...tickets]
    .map((t) => ({ name: t.name, value: t.price * t.sold }))
    .sort((a, b) => b.value - a.value);
  const total = data.reduce((s, d) => s + d.value, 0);
  const [hover, setHover] = useState<number | null>(null);

  const focused = hover !== null ? data[hover] : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div
        className="relative h-[260px]"
        onMouseLeave={() => setHover(null)}
      >
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={70}
              outerRadius={105}
              strokeWidth={2}
              stroke="var(--card)"
              isAnimationActive={false}
              onMouseLeave={() => setHover(null)}
            >
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={
                    hover === null
                      ? `oklch(${0.85 - (i * 0.06)} 0 0)`
                      : i === hover
                        ? ACCENT
                        : "oklch(0.94 0 0)"
                  }
                  onMouseEnter={() => setHover(i)}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {focused ? (
            <>
              <div className="text-xs text-muted-foreground max-w-[140px] truncate">{focused.name}</div>
              <div className="text-2xl font-semibold tabular-nums mt-1">
                {((focused.value / total) * 100).toFixed(1)}%
              </div>
            </>
          ) : (
            <>
              <div className="text-xs text-muted-foreground">總營收</div>
              <div className="text-2xl font-semibold tabular-nums mt-1">
                NT$ {(total / 1000).toFixed(0)}k
              </div>
            </>
          )}
        </div>
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((d, i) => {
          const isHover = hover === i;
          return (
            <li
              key={d.name}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="flex items-center gap-2 text-xs cursor-default"
            >
              <span
                className="h-2.5 w-2.5 rounded-sm shrink-0"
                style={{
                  background:
                    hover === null
                      ? `oklch(${0.85 - (i * 0.06)} 0 0)`
                      : isHover
                        ? "var(--accent)"
                        : "oklch(0.94 0 0)",
                }}
              />
              <span className="truncate flex-1">{d.name}</span>
              <span className="text-muted-foreground tabular-nums">
                {((d.value / total) * 100).toFixed(0)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
