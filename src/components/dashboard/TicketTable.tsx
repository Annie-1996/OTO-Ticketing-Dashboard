import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { tickets as allTickets, type TicketType } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const categories = ["早鳥票", "一般票", "特殊 / 團體票"] as const;
type Cat = (typeof categories)[number];

type SortKey = "price" | "sold" | "revenue" | "progress";
type SortDir = "desc" | "asc" | null;

export function TicketTable() {
  const [selected, setSelected] = useState<Set<Cat>>(new Set(categories));
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const toggleCat = (c: Cat) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(c)) {
        if (next.size === 1) return prev; // at least one
        next.delete(c);
      } else next.add(c);
      return next;
    });
  };

  const filtered = useMemo(
    () => allTickets.filter((t) => selected.has(t.category as Cat)),
    [selected],
  );

  const sorted = useMemo(() => {
    if (!sortKey || !sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = valueOf(a, sortKey);
      const vb = valueOf(b, sortKey);
      return sortDir === "desc" ? vb - va : va - vb;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    if (sortDir === "desc") setSortDir("asc");
    else if (sortDir === "asc") {
      setSortKey(null);
      setSortDir(null);
    } else setSortDir("desc");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {categories.map((c) => {
          const active = selected.has(c);
          return (
            <button
              key={c}
              onClick={() => toggleCat(c)}
              className={cn(
                "px-3 py-1 rounded-full text-xs border transition-colors",
                active
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card text-muted-foreground border-border hover:text-foreground",
              )}
            >
              {c}
            </button>
          );
        })}
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground border-b border-border">
                <th className="text-left font-medium px-4 py-2.5 w-10">#</th>
                <th className="text-left font-medium px-4 py-2.5">票種</th>
                <SortHeader label="票價" k="price" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="right" />
                <SortHeader label="已售" k="sold" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="right" />
                <SortHeader label="營收" k="revenue" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="right" />
                <SortHeader label="售出進度" k="progress" sortKey={sortKey} sortDir={sortDir} onClick={handleSort} align="left" />
              </tr>
            </thead>
            <tbody>
              {sorted.map((t, i) => {
                const revenue = t.price * t.sold;
                const pct = (t.sold / t.quota) * 100;
                return (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.category}</div>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">NT$ {t.price.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{t.sold.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right tabular-nums">NT$ {revenue.toLocaleString()}</td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground tabular-nums w-20 text-right">
                          {t.sold}/{t.quota}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function valueOf(t: TicketType, k: SortKey): number {
  if (k === "price") return t.price;
  if (k === "sold") return t.sold;
  if (k === "revenue") return t.price * t.sold;
  return t.sold / t.quota;
}

function SortHeader({
  label, k, sortKey, sortDir, onClick, align,
}: {
  label: string; k: SortKey;
  sortKey: SortKey | null; sortDir: SortDir;
  onClick: (k: SortKey) => void;
  align: "left" | "right";
}) {
  const active = sortKey === k && sortDir;
  const Icon = !active ? ArrowUpDown : sortDir === "desc" ? ArrowDown : ArrowUp;
  return (
    <th className={cn("px-4 py-2.5 font-medium", align === "right" ? "text-right" : "text-left")}>
      <button
        onClick={() => onClick(k)}
        className={cn(
          "inline-flex items-center gap-1 hover:text-foreground transition-colors",
          active && "text-foreground",
        )}
      >
        {label}
        <Icon className="h-3 w-3" />
      </button>
    </th>
  );
}
