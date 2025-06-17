"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Leaf, Users, Shield, Droplets, Trash2, Heart } from "lucide-react"
import type { ESGData } from "@/lib/supabase"

interface ESGMetricsProps {
  data: ESGData[]
}

export function ESGMetrics({ data }: ESGMetricsProps) {
  if (data.length === 0) return null

  const avgMetrics = {
    environmental: data.reduce((sum, c) => sum + c.environmental_score, 0) / data.length,
    social: data.reduce((sum, c) => sum + c.social_score, 0) / data.length,
    governance: data.reduce((sum, c) => sum + c.governance_score, 0) / data.length,
    carbonEmissions: data.reduce((sum, c) => sum + c.carbon_emissions, 0) / data.length,
    waterUsage: data.reduce((sum, c) => sum + c.water_usage, 0) / data.length,
    wasteReduction: data.reduce((sum, c) => sum + c.waste_reduction, 0) / data.length,
    employeeSatisfaction: data.reduce((sum, c) => sum + c.employee_satisfaction, 0) / data.length,
    diversityScore: data.reduce((sum, c) => sum + c.diversity_score, 0) / data.length,
    communityInvestment: data.reduce((sum, c) => sum + c.community_investment, 0) / data.length,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Average ESG Metrics</CardTitle>
        <CardDescription>Aggregated metrics across {data.length} companies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main ESG Categories */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Leaf className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Environmental</span>
                <span className="font-medium">{avgMetrics.environmental.toFixed(1)}/100</span>
              </div>
              <Progress value={avgMetrics.environmental} className="h-2" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Social</span>
                <span className="font-medium">{avgMetrics.social.toFixed(1)}/100</span>
              </div>
              <Progress value={avgMetrics.social} className="h-2" />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-purple-600" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Governance</span>
                <span className="font-medium">{avgMetrics.governance.toFixed(1)}/100</span>
              </div>
              <Progress value={avgMetrics.governance} className="h-2" />
            </div>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground">Detailed Metrics</h4>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Droplets className="h-4 w-4 text-blue-500" />
              <span>Water Usage: {avgMetrics.waterUsage.toFixed(1)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trash2 className="h-4 w-4 text-green-500" />
              <span>Waste Reduction: {avgMetrics.wasteReduction.toFixed(1)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Employee Satisfaction: {avgMetrics.employeeSatisfaction.toFixed(1)}%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span>Diversity Score: {avgMetrics.diversityScore.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
