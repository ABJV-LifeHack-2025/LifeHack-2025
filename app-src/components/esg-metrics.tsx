"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Leaf, Users, Shield } from "lucide-react";
import type { ESGData } from "@/lib/supabase";

interface ESGMetricsProps {
  data: ESGData[];
}

export function ESGMetrics({ data }: ESGMetricsProps) {
  if (data.length === 0) return null;

  const avg = (key: keyof ESGData) =>
    data.reduce((sum, c) => sum + Number(c[key] ?? 0), 0) / data.length;

  const avgEnvironmental = avg("environmental_score");
  const avgSocial = avg("social_score");
  const avgGovernance = avg("governance_score");
  const avgOverall = avg("overall_score");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average ESG Metrics</CardTitle>
        <CardDescription>
          Aggregated metrics across {data.length} companies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Leaf className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Environmental</span>
                <span className="font-medium">
                  {avgEnvironmental.toFixed(1)}/100
                </span>
              </div>
              <Progress value={avgEnvironmental} className="h-2" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Social</span>
                <span className="font-medium">{avgSocial.toFixed(1)}/100</span>
              </div>
              <Progress value={avgSocial} className="h-2" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Governance</span>
                <span className="font-medium">
                  {avgGovernance.toFixed(1)}/100
                </span>
              </div>
              <Progress value={avgGovernance} className="h-2" />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-semibold text-gray-700">
              Overall ESG Score
            </span>
            <span className="font-medium">{avgOverall.toFixed(1)}/100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
