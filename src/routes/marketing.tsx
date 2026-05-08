import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Section, Card } from "@/components/dashboard/Section";
import { DateRangeFilter, rangeFromPreset, type DateRange } from "@/components/dashboard/DateRangeFilter";
import { kols, funnel, trafficSources } from "@/lib/mock-data";

export const Route = createFileRoute("/marketing")({
  head: () => ({
    meta: [
      { title: "行銷總覽 — OTOTIX Dashboard" },
      { name: "description", content: "OTOTIX 行銷數據：KOL 連結表現、售票漏斗與流量來源分析。" },
    ],
  }),
  component: MarketingPage,
});

function MarketingPage() {
  const [range, setRange] = useState<DateRange>(() => ({
    ...rangeFromPreset("month"),
    preset: "month",
  }));

  const totalClicks = kols.reduce((s, k) => s + k.clicks, 0);
  const totalPurchases = kols.reduce((s, k) => s + k.purchases, 0);
  const overallRate = totalClicks ? (totalPurchases / totalClicks) * 100 : 0;

  const totalUsers = trafficSources.reduce((s, t) => s + t.users, 0);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">行銷總覽</h1>
            <p className="text-sm text-muted-foreground mt-1">KOL 表現、轉換漏斗與流量來源</p>
          </div>
          <DateRangeFilter value={range} onChange={setRange} />
        </div>

        <div className="rounded-md border border-border bg-muted/40 px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
          <Info className="h-3.5 w-3.5 shrink-0 text-accent" />
          目前為示範數據，GA4 Data API 串接開發中。
        </div>

        <Section title="KOL 連結表現">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Metric label="總點擊數" value={totalClicks.toLocaleString()} />
            <Metric label="總購買數" value={totalPurchases.toLocaleString()} />
            <Metric label="整體購買率" value={`${overallRate.toFixed(2)}%`} accent />
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left font-medium px-4 py-2.5">KOL</th>
                  <th className="text-right font-medium px-4 py-2.5">點擊數</th>
                  <th className="text-right font-medium px-4 py-2.5">購買數</th>
                  <th className="text-right font-medium px-4 py-2.5">購買率</th>
                </tr>
              </thead>
              <tbody>
                {kols.map((k) => {
                  const rate = (k.purchases / k.clicks) * 100;
                  return (
                    <tr key={k.name} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{k.name}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{k.clicks.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{k.purchases.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{rate.toFixed(2)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>

        <Section title="售票漏斗">
          <Card>
            <div className="space-y-4">
              {/* header */}
              <div className="grid grid-cols-12 gap-3 text-xs text-muted-foreground px-1">
                <div className="col-span-4">步驟</div>
                <div className="col-span-3 text-right">瀏覽人次</div>
                <div className="col-span-3 text-right">活躍使用者</div>
                <div className="col-span-2 text-right inline-flex items-center justify-end gap-1 group relative">
                  流失率
                  <span className="relative">
                    <Info className="h-3 w-3 cursor-help" />
                    <span
                      className="pointer-events-none fixed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-150 z-50 bg-foreground text-background text-[11px] leading-relaxed rounded px-2.5 py-1.5 max-w-[220px] shadow-lg"
                      style={{
                        right: "2rem",
                      }}
                    >
                      流失率 = (前一步活躍 − 當前活躍) / 前一步活躍
                    </span>
                  </span>
                </div>
              </div>
              {funnel.map((f, i) => {
                const max = funnel[0].activeUsers;
                const widthPct = (f.activeUsers / max) * 100;
                const drop =
                  i === 0
                    ? null
                    : ((funnel[i - 1].activeUsers - f.activeUsers) / funnel[i - 1].activeUsers) * 100;
                return (
                  <div key={f.name} className="grid grid-cols-12 gap-3 items-center">
                    <div className="col-span-4">
                      <div className="text-sm font-medium">{f.name}</div>
                      <div className="mt-1.5 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-accent/80"
                          style={{ width: `${widthPct}%` }}
                        />
                      </div>
                    </div>
                    <div className="col-span-3 text-right text-sm tabular-nums">
                      {f.views.toLocaleString()}
                    </div>
                    <div className="col-span-3 text-right text-sm tabular-nums">
                      {f.activeUsers.toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right text-sm tabular-nums text-muted-foreground">
                      {drop === null ? "—" : `${drop.toFixed(1)}%`}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Section>

        <Section title="流量來源">
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border">
                  <th className="text-left font-medium px-4 py-2.5">來源 / 媒介</th>
                  <th className="text-right font-medium px-4 py-2.5">活躍使用者</th>
                  <th className="text-left font-medium px-4 py-2.5 w-[40%]">佔比</th>
                </tr>
              </thead>
              <tbody>
                {trafficSources.map((t) => {
                  const pct = (t.users / totalUsers) * 100;
                  return (
                    <tr key={t.source} className="border-b border-border last:border-0 hover:bg-muted/40">
                      <td className="px-4 py-3 font-medium">{t.source}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{t.users.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden max-w-[260px]">
                            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground tabular-nums w-12 text-right">
                            {pct.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </AppShell>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Card>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div
        className="mt-2 text-3xl font-semibold tabular-nums"
        style={accent ? { color: "var(--accent)" } : undefined}
      >
        {value}
      </div>
    </Card>
  );
}
