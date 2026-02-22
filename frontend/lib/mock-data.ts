export type SniprLink = {
  id: string;
  shortUrl: string;
  originalUrl: string;
  clicks: number;
  createdAt: string;
  status: "active" | "expired" | "disabled";
};

export type DashboardStats = {
  totalLinks: number;
  totalClicks: number;
  topLink: string;
  clicksToday: number;
  clicksThisWeek: number;
};

export const mockLinks: SniprLink[] = [
  {
    id: "1",
    shortUrl: "snipr.io/react-docs",
    originalUrl: "https://react.dev/reference/react/hooks",
    clicks: 1243,
    createdAt: "2026-02-20",
    status: "active",
  },
  {
    id: "2",
    shortUrl: "snipr.io/gh-profile",
    originalUrl: "https://github.com/ruturaj-snipr/awesome-project",
    clicks: 872,
    createdAt: "2026-02-18",
    status: "active",
  },
  {
    id: "3",
    shortUrl: "snipr.io/blog-post",
    originalUrl: "https://blog.example.com/how-to-build-url-shortener-with-nextjs-and-go",
    clicks: 541,
    createdAt: "2026-02-15",
    status: "active",
  },
  {
    id: "4",
    shortUrl: "snipr.io/yt-demo",
    originalUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    clicks: 329,
    createdAt: "2026-02-10",
    status: "expired",
  },
  {
    id: "5",
    shortUrl: "snipr.io/tw-thread",
    originalUrl: "https://twitter.com/someone/status/1234567890",
    clicks: 198,
    createdAt: "2026-02-08",
    status: "active",
  },
  {
    id: "6",
    shortUrl: "snipr.io/docs-api",
    originalUrl: "https://docs.example.com/api/v2/endpoints",
    clicks: 87,
    createdAt: "2026-01-30",
    status: "disabled",
  },
  {
    id: "7",
    shortUrl: "snipr.io/figma",
    originalUrl: "https://www.figma.com/file/abc123/design-system",
    clicks: 456,
    createdAt: "2026-01-25",
    status: "active",
  },
  {
    id: "8",
    shortUrl: "snipr.io/conf-talk",
    originalUrl: "https://conference.dev/talks/building-scalable-url-shorteners",
    clicks: 63,
    createdAt: "2026-01-20",
    status: "expired",
  },
];

export const mockStats: DashboardStats = {
  totalLinks: 48,
  totalClicks: 12_847,
  topLink: "snipr.io/react-docs",
  clicksToday: 142,
  clicksThisWeek: 1_038,
};
