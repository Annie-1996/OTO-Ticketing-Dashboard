import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Section, Card } from "@/components/dashboard/Section";
import { SnapshotCard } from "@/components/dashboard/SnapshotCard";
import { DateRangeFilter, rangeFromPreset, type DateRange } from "@/components/dashboard/DateRangeFilter";
import { TicketTable } from "@/components/dashboard/TicketTable";
import { RevenueDonut } from "@/components/dashboard/RevenueDonut";
import { DailyTrend } from "@/components/dashboard/DailyTrend";
import { dailySales } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "售票總覽 — OTOTIX Dashboard" },
      { name: "description", content: "OTOTIX 售票即時數據總覽：售票進度、票種表現、營收分析。" },
    ],
  }),
  component: SalesPage,
});

function SalesPage() {
  const [range, setRange] = useState<DateRange>(() => ({
    ...rangeFromPreset("month"),
    preset: "month",
  }));

  const periodStats = useMemo(() => {
    const slice = dailySales.filter((d) => d.date >= range.from && d.date <= range.to);
    return {
      revenue: slice.reduce((s, d) => s + d.revenue, 0),
      tickets: slice.reduce((s, d) => s + d.tickets, 0),
    };
  }, [range]);

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">售票總覽</h1>
          <p className="text-sm text-muted-foreground mt-1">即時掌握活動售票進度與營收表現</p>
        </div>

        <Section title="售票進度" description="累計數據，不受日期區間影響">
          <SnapshotCard />
        </Section>

        <Section
          title="時間區間表現"
          description="以下區段依日期篩選器顯示"
          action={<DateRangeFilter value={range} onChange={setRange} />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <div className="text-xs text-muted-foreground">區間總營收</div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">
                NT$ {periodStats.revenue.toLocaleString()}
              </div>
            </Card>
            <Card>
              <div className="text-xs text-muted-foreground">區間售票數</div>
              <div className="mt-2 text-3xl font-semibold tabular-nums">
                {periodStats.tickets.toLocaleString()} 張
              </div>
            </Card>
          </div>
        </Section>

        <Section title="販售票種">
          <TicketTable />
        </Section>

        <Section title="銷售分析" description="票種收入佔比">
          <Card>
            <RevenueDonut />
          </Card>
        </Section>

        <Section title="每日銷售趨勢">
          <Card>
            <DailyTrend from={range.from} to={range.to} />
          </Card>
        </Section>
      </div>
    </AppShell>
  );
}
