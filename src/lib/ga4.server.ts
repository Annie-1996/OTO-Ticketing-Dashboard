import { createServerFn } from "@tanstack/react-start";

type GA4Row = {
  dimensionValues: { value: string }[];
  metricValues: { value: string }[];
};
type GA4ReportResponse = { rows?: GA4Row[]; error?: { message: string; status: string } };

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GA_CLIENT_ID;
  const clientSecret = process.env.GA_CLIENT_SECRET;
  const refreshToken = process.env.GA_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      `GA 環境變數未設定：GA_CLIENT_ID=${!!clientId}, GA_CLIENT_SECRET=${!!clientSecret}, GA_REFRESH_TOKEN=${!!refreshToken}`
    );
  }

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const json = (await res.json()) as { access_token?: string; error?: string; error_description?: string };

  if (!json.access_token) {
    throw new Error(`OAuth token 失敗：${json.error} - ${json.error_description}`);
  }

  return json.access_token;
}

async function runReport(accessToken: string, body: object): Promise<GA4ReportResponse> {
  const propertyId = process.env.GA_PROPERTY_ID;
  if (!propertyId) throw new Error("GA_PROPERTY_ID 未設定");

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
  const data = (await res.json()) as GA4ReportResponse;

  if (data.error) {
    throw new Error(`GA4 API 錯誤：${data.error.status} - ${data.error.message}`);
  }

  return data;
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
      const raw = row.dimensionValues[0].value;
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
      return { date, activeUsers: parseInt(row.metricValues[0].value, 10) };
    });
  }
);
