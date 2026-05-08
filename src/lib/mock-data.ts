export const eventInfo = {
  platform: "KKTIX",
  eventName: "OTOTIX 2026 春季演唱會",
  lastUpdated: new Date(),
};

export type TicketCategory = "早鳥票" | "套票 / 單人票" | "特殊 / 團體票";

export type TicketType = {
  id: number;
  category: TicketCategory;
  name: string;
  price: number;
  sold: number;
  quota: number;
};

export const tickets: TicketType[] = [
  { id: 1, category: "早鳥票", name: "早鳥票", price: 190, sold: 320, quota: 500 },
  { id: 2, category: "早鳥票", name: "早鳥雙人票", price: 360, sold: 145, quota: 250 },
  { id: 3, category: "套票 / 單人票", name: "單人票", price: 250, sold: 980, quota: 1500 },
  { id: 4, category: "套票 / 單人票", name: "雙人票", price: 450, sold: 410, quota: 700 },
  { id: 5, category: "套票 / 單人票", name: "四人票", price: 800, sold: 165, quota: 300 },
  { id: 6, category: "套票 / 單人票", name: "愛心敬老票", price: 150, sold: 88, quota: 200 },
  { id: 7, category: "套票 / 單人票", name: "商品套票（票＋商品）", price: 350, sold: 240, quota: 400 },
  { id: 8, category: "特殊 / 團體票", name: "企業團體票", price: 180, sold: 360, quota: 600 },
  { id: 9, category: "特殊 / 團體票", name: "幼兒園團體票", price: 140, sold: 220, quota: 400 },
];

const _totalQuota = tickets.reduce((s, t) => s + t.quota, 0);
const _totalSold = tickets.reduce((s, t) => s + t.sold, 0);
export const snapshot = {
  totalQuota: _totalQuota,
  totalSold: _totalSold,
};

// Last 30 days daily sales
function genDaily() {
  const days = 30;
  const today = new Date();
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (days - 1 - i));
    const tickets = Math.round(40 + Math.random() * 180 + (i > 20 ? 80 : 0));
    const revenue = tickets * (1800 + Math.round(Math.random() * 1500));
    return {
      date: d.toISOString().slice(0, 10),
      tickets,
      revenue,
    };
  });
}
export const dailySales = genDaily();

export const kols = [
  { name: "林小美 @meimei", url: "https://ototix.com/kol/meimei", clicks: 4820, purchases: 312 },
  { name: "音樂日記 @musicdiary", url: "https://ototix.com/kol/musicdiary", clicks: 3210, purchases: 189 },
  { name: "Tony 說 @tonysays", url: "https://ototix.com/kol/tonysays", clicks: 2890, purchases: 142 },
  { name: "週末派對 @weekendparty", url: "https://ototix.com/kol/weekendparty", clicks: 1980, purchases: 88 },
  { name: "現場直擊 @livescene", url: "https://ototix.com/kol/livescene", clicks: 1450, purchases: 51 },
  { name: "城市節奏 @cityrhythm", url: "https://ototix.com/kol/cityrhythm", clicks: 980, purchases: 22 },
];

export const funnel = [
  { name: "活動主頁", views: 28400, activeUsers: 21200 },
  { name: "票券資訊頁", views: 18900, activeUsers: 14800 },
  { name: "訂單確認頁", views: 9200, activeUsers: 7600 },
  { name: "結帳完成頁", views: 4100, activeUsers: 3742 },
];

export const trafficSources = [
  { source: "google / organic", users: 8920 },
  { source: "instagram / social", users: 6210 },
  { source: "facebook / social", users: 4180 },
  { source: "(direct) / (none)", users: 3420 },
  { source: "kol-link / referral", users: 2890 },
  { source: "newsletter / email", users: 1340 },
  { source: "youtube / social", users: 980 },
];
