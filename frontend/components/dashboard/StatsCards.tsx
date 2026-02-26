import Link from "next/link";

import { Link2, MousePointerClick, TrendingUp, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { getMyStats } from "@/lib/actions";

export async function StatsCards() {
  const userStats = await getMyStats();

  const stats = [
    {
      label: "Total Links",
      value: userStats?.totalLinks,
      icon: Link2,
    },
    {
      label: "Total Clicks",
      value: userStats?.totalClicks.toLocaleString(),
      icon: MousePointerClick,
    },
    {
      label: "Top Link",
      value: userStats?.topLink?.shortUrl
        ? `/${userStats.topLink.shortUrl.split("/").pop()}`
        : "—",
      href: userStats?.topLink?.shortUrl,
      icon: Trophy,
    },
    {
      label: "Clicks This Week",
      value: userStats?.clicksThisWeek.toLocaleString(),
      description: `${userStats?.clicksToday} today`,
      icon: TrendingUp,
    },
  ];

  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Stats Snapshot</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-start gap-4 py-5">
              <div className="bg-primary/10 rounded-md p-2.5">
                <stat.icon className="text-primary h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                {stat.href ? (
                  <Link
                    href={stat.href}
                    target="_blank"
                    className="hover:text-primary truncate text-xl font-bold hover:underline"
                  >
                    {stat.value}
                  </Link>
                ) : (
                  <p className="truncate text-xl font-bold">{stat.value}</p>
                )}
                {stat.description && (
                  <p className="text-muted-foreground text-xs">
                    {stat.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
