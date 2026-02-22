import { Link2, MousePointerClick, Trophy, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mockStats } from "@/lib/mock-data";

const stats = [
  {
    label: "Total Links",
    value: mockStats.totalLinks,
    icon: Link2,
  },
  {
    label: "Total Clicks",
    value: mockStats.totalClicks.toLocaleString(),
    icon: MousePointerClick,
  },
  {
    label: "Top Link",
    value: mockStats.topLink,
    icon: Trophy,
  },
  {
    label: "Clicks This Week",
    value: mockStats.clicksThisWeek.toLocaleString(),
    description: `${mockStats.clicksToday} today`,
    icon: TrendingUp,
  },
];

export function StatsCards() {
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
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
