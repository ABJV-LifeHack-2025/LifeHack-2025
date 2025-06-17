"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Newspaper, ExternalLink, Calendar, Leaf, Users, Shield } from "lucide-react"
import { mockNewsData, type NewsItem, type ESGData } from "@/lib/types"

interface NewsSectionProps {
  company: ESGData
}

export function NewsSection({ company }: NewsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<"all" | "environmental" | "social" | "governance">("all")

  const companyNews = mockNewsData[company.id] || []

  const filteredNews =
    selectedCategory === "all" ? companyNews : companyNews.filter((news) => news.category === selectedCategory)

  const getCategoryIcon = (category: NewsItem["category"]) => {
    switch (category) {
      case "environmental":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "social":
        return <Users className="h-4 w-4 text-blue-600" />
      case "governance":
        return <Shield className="h-4 w-4 text-purple-600" />
    }
  }

  const getCategoryColor = (category: NewsItem["category"]) => {
    switch (category) {
      case "environmental":
        return "bg-green-100 text-green-800"
      case "social":
        return "bg-blue-100 text-blue-800"
      case "governance":
        return "bg-purple-100 text-purple-800"
    }
  }

  const getCategoryLabel = (category: NewsItem["category"]) => {
    switch (category) {
      case "environmental":
        return "Environmental"
      case "social":
        return "Social"
      case "governance":
        return "Governance"
    }
  }

  if (companyNews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="h-5 w-5 mr-2" />
            In the News
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Newspaper className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent news available for {company.brand_name}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Newspaper className="h-5 w-5 mr-2" />
          In the News
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="environmental" className="flex items-center gap-1">
              <Leaf className="h-3 w-3" />
              Environmental
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Social
            </TabsTrigger>
            <TabsTrigger value="governance" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              Governance
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCategory} className="mt-6">
            <div className="space-y-4">
              {filteredNews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No {selectedCategory} news available</p>
                </div>
              ) : (
                filteredNews.map((news) => (
                  <Card key={news.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(news.category)}
                          <Badge className={getCategoryColor(news.category)}>{getCategoryLabel(news.category)}</Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(news.date).toLocaleDateString()}
                        </div>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-2 leading-tight">{news.title}</h4>

                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{news.summary}</p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Source: {news.source}</span>
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
