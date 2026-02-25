import { Link2, MousePointerClick, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getMyStats } from "@/lib/actions";

export async function StatsCards() {
  const userStats = await getMyStats();
  console.log(`USER URLs`, userStats);

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
      value: userStats?.topLink?.shortUrl,
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
              <div className="rounded-md bg-primary/10 p-2.5">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="truncate text-xl font-bold">{stat.value}</p>
                {stat.description && (
                  <p className="text-xs text-muted-foreground">
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
