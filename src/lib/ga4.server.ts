import { createServerFn } from "@tanstack/react-start";

type GA4Row = {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
};
type GA4ReportResponse = { rows?: GA4Row[] };

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GA_CLIENT_ID ?? "",
      client_secret: process.env.GA_CLIENT_SECRET ?? "",
      refresh_token: process.env.GA_REFRESH_TOKEN ?? "",
      grant_type: "refresh_token",
    }),
  });
  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

async function runReport(accessToken: string, body: object): Promise<GA4ReportResponse> {
  const propertyId = process.env.GA_PROPERTY_ID;
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  return res.json() as Promise<GA4ReportResponse>;
}

export type TrafficSource = { source: string; users: number };
export type DailyUsers = { date: string; activeUsers: number };

export const fetchGA4TrafficSources = createServerFn({ method: "POST" }).handler(
  async (ctx) => {
    const { startDate, endDate } = ctx.data as { startDate: string; endDate: string };
    const token = await getAccessToken();
    const report = await runReport(token, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "sessionSourceMedium" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
      limit: 10,
    });
    return (report.rows ?? []).map<TrafficSource>((row) => ({
      source: row.dimensionValues[0].value,
      users: parseInt(row.metricValues[0].value, 10),
    }));
  }
);

export const fetchGA4DailyUsers = createServerFn({ method: "POST" }).handler(
  async (ctx) => {
    const { startDate, endDate } = ctx.data as { startDate: string; endDate: string };
    const token = await getAccessToken();
    const report = await runReport(token, {
      dateRanges: [{ startDate, endDate }],
      dimensions: [{ name: "date" }],
      metrics: [{ name: "activeUsers" }],
      orderBys: [{ dimension: { dimensionName: "date" } }],
    });
    return (report.rows ?? []).map<DailyUsers>((row) => {
      const raw = row.dimensionValues[0].value; // "20250101"
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return { date, activeUsers: parseInt(row.metricValues[0].value, 10) };
    });
  }
);
