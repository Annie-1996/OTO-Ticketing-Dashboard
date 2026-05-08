import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type Preset = "today" | "week" | "month" | "all";
export type DateRange = { from: string; to: string; preset: Preset };

const tabs: { key: Preset; label: string }[] = [
  { key: "today", label: "今日" },
  { key: "week", label: "本週" },
  { key: "month", label: "本月" },
  { key: "all", label: "全期" },
];

function fmt(d: Date) {
  return d.toISOString().slice(0, 10);
}

export function rangeFromPreset(preset: Preset): { from: string; to: string } {
  const today = new Date();
  const to = fmt(today);
  if (preset === "today") return { from: to, to };
  if (preset === "week") {
    const d = new Date(today);
    d.setDate(d.getDate() - 6);
    return { from: fmt(d), to };
  }
  if (preset === "month") {
    const d = new Date(today);
    d.setDate(d.getDate() - 29);
    return { from: fmt(d), to };
  }
  return { from: "2020-01-01", to };
}

export function DateRangeFilter({
  value,
  onChange,
}: {
  value: DateRange;
  onChange: (v: DateRange) => void;
}) {
  const [from, setFrom] = useState(value.from);
  const [to, setTo] = useState(value.to);

  useEffect(() => {
    setFrom(value.from);
    setTo(value.to);
  }, [value.from, value.to]);

  const setPreset = (p: Preset) => {
    const r = rangeFromPreset(p);
    onChange({ ...r, preset: p });
  };

  const commit = (nf: string, nt: string) => {
    if (nf && nt) onChange({ from: nf, to: nt, preset: "all" });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex rounded-md border border-border bg-card p-0.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setPreset(t.key)}
            className={cn(
              "px-3 py-1.5 text-xs rounded transition-colors",
              value.preset === t.key
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
            commit(e.target.value, to);
          }}
          className="rounded-md border border-border bg-card px-2 py-1.5 text-foreground"
        />
        <span className="text-muted-foreground">→</span>
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
            commit(from, e.target.value);
          }}
          className="rounded-md border border-border bg-card px-2 py-1.5 text-foreground"
        />
      </div>
    </div>
  );
}
