import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Shield, TrendingUp } from "lucide-react";
import type { ESGData } from "@/lib/supabase"; // Use the type from your Supabase types

interface ESGOverviewProps {
  data: ESGData[];
}

export function ESGOverview({ data }: ESGOverviewProps) {
  if (data.length === 0) return null;

  const safeAvg = (key: keyof ESGData) => {
    const valid = data.map((c) => Number(c[key]) ?? 0);
    return valid.reduce((sum, v) => sum + v, 0) / data.length;
  };

  const avgEnvironmental = safeAvg("environmental_score");
  const avgSocial = safeAvg("social_score");
  const avgGovernance = safeAvg("governance_score");
  const avgOverall = safeAvg("overall_score");

  const topPerformer = data.reduce((prev, current) =>
    (prev.overall_score ?? 0) > (current.overall_score ?? 0) ? prev : current
  );

  const overviewCards = [
    {
      title: "Environmental",
      score: avgEnvironmental,
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Average environmental score",
    },
    {
      title: "Social",
      score: avgSocial,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Average social score",
    },
    {
      title: "Governance",
      score: avgGovernance,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Average governance score",
    },
    {
      title: "Overall Average",
      score: avgOverall,
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: `Top: ${topPerformer.ticker || topPerformer.company_name} (${
        topPerformer.overall_score ?? "N/A"
      })`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {overviewCards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${card.bgColor}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.score.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
