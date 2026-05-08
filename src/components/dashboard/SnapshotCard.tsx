import { snapshot } from "@/lib/mock-data";
import { Card } from "./Section";

export function SnapshotCard() {
  const pct = (snapshot.totalSold / snapshot.totalQuota) * 100;
  const remaining = snapshot.totalQuota - snapshot.totalSold;
  return (
    <Card>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div>
          <div className="text-xs text-muted-foreground">售票進度</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-5xl font-semibold tracking-tight tabular-nums">
              {pct.toFixed(1)}
            </span>
            <span className="text-xl text-muted-foreground">%</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {snapshot.totalSold.toLocaleString()} / {snapshot.totalQuota.toLocaleString()} 張
          </div>
        </div>
        <div className="md:col-span-2 space-y-3">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-accent transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground">已售出</div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5">
                {snapshot.totalSold.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">剩餘</div>
              <div className="text-2xl font-semibold tabular-nums mt-0.5 text-muted-foreground">
                {remaining.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
