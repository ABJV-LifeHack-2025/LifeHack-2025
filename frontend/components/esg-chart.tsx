"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { ESGData } from "@/lib/supabase" // <-- Use the type from your Supabase types

interface ESGChartProps {
  data: ESGData[]
}

export function ESGChart({ data }: ESGChartProps) {
  const chartData = data.map((company) => ({
    company: company.ticker || company.company_name,
    fullName: company.company_name,
    Environmental: company.environmental_score ?? 0,
    Social: company.social_score ?? 0,
    Governance: company.governance_score ?? 0,
    Overall: company.overall_score ?? 0,
  }))

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>ESG Scores Comparison</CardTitle>
        <CardDescription>
          Top {data.length} companies by overall ESG performance - Environmental, Social, and Governance breakdown
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            Environmental: {
              label: "Environmental",
              color: "hsl(142, 76%, 36%)",
            },
            Social: {
              label: "Social",
              color: "hsl(221, 83%, 53%)",
            },
            Governance: {
              label: "Governance",
              color: "hsl(262, 83%, 58%)",
            },
            Overall: {
              label: "Overall",
              color: "hsl(25, 95%, 53%)",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="company" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" height={80} />
              <YAxis domain={[0, 100]} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(label) => {
                  const company = chartData.find((c) => c.company === label)
                  return company ? company.fullName : label
                }}
              />
              <Legend />
              <Bar dataKey="Environmental" fill="var(--color-Environmental)" name="Environmental" />
              <Bar dataKey="Social" fill="var(--color-Social)" name="Social" />
              <Bar dataKey="Governance" fill="var(--color-Governance)" name="Governance" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
