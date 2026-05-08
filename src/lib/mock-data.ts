export const eventInfo = {
  platform: "KKTIX",
  eventName: "OTOTIX 2026 春季演唱會",
  lastUpdated: new Date(),
};

export const snapshot = {
  totalQuota: 5000,
  totalSold: 3742,
};

export type TicketType = {
  id: number;
  category: "VIP" | "一般" | "學生" | "早鳥";
  name: string;
  price: number;
  sold: number;
  quota: number;
};

export const tickets: TicketType[] = [
  { id: 1, category: "VIP", name: "VIP 搖滾區", price: 6800, sold: 480, quota: 500 },
  { id: 2, category: "VIP", name: "VIP 包廂", price: 8800, sold: 92, quota: 100 },
  { id: 3, category: "一般", name: "A 區", price: 3800, sold: 850, quota: 1000 },
  { id: 4, category: "一般", name: "B 區", price: 2800, sold: 1120, quota: 1500 },
  { id: 5, category: "一般", name: "C 區", price: 1800, sold: 720, quota: 1200 },
  { id: 6, category: "學生", name: "學生票 A", price: 2200, sold: 230, quota: 400 },
  { id: 7, category: "學生", name: "學生票 B", price: 1400, sold: 180, quota: 300 },
  { id: 8, category: "早鳥", name: "早鳥優惠票", price: 1500, sold: 70, quota: 100 },
];

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
  { name: "林小美 @meimei", clicks: 4820, purchases: 312 },
  { name: "音樂日記 @musicdiary", clicks: 3210, purchases: 189 },
  { name: "Tony 說 @tonysays", clicks: 2890, purchases: 142 },
  { name: "週末派對 @weekendparty", clicks: 1980, purchases: 88 },
  { name: "現場直擊 @livescene", clicks: 1450, purchases: 51 },
  { name: "城市節奏 @cityrhythm", clicks: 980, purchases: 22 },
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
