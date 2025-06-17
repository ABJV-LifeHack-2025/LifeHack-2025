"use client";

import {
  ArrowLeft,
  Leaf,
  Users,
  Shield,
  Building2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { NewsSection } from "@/components/news-section";
import type { ESGData } from "@/lib/supabase"; // Use the type from supabase

interface CompanyDetailProps {
  company: ESGData;
  onBack: () => void;
}

export function CompanyDetail({ company, onBack }: CompanyDetailProps) {
  const getScoreColor = (score: number | null) => {
    if (score === null) return "text-gray-400";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number | null) => {
    if (score === null) return "secondary";
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  const getScoreLabel = (score: number | null) => {
    if (score === null) return "N/A";
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  const getScoreDescription = (category: string, score: number | null) => {
    const level =
      score === null
        ? "low"
        : score >= 80
        ? "high"
        : score >= 60
        ? "moderate"
        : "low";

    const descriptions = {
      environmental: {
        high: "Strong commitment to environmental sustainability, renewable energy, and reducing carbon footprint.",
        moderate:
          "Some environmental initiatives in place, but room for improvement in sustainability practices.",
        low: "Limited environmental initiatives. Consider supporting brands with stronger environmental commitments.",
      },
      social: {
        high: "Excellent employee treatment, diversity initiatives, and positive community impact.",
        moderate:
          "Good social practices with some areas for improvement in worker rights or community engagement.",
        low: "Concerns about labor practices, diversity, or community impact. Consider alternatives.",
      },
      governance: {
        high: "Transparent business practices, ethical leadership, and strong corporate accountability.",
        moderate:
          "Generally good corporate governance with some areas for improvement.",
        low: "Concerns about business transparency, ethics, or corporate accountability.",
      },
    };

    return descriptions[category as keyof typeof descriptions][level];
  };

  const esgCategories = [
    {
      title: "Environmental Impact",
      score: company.environmental_score,
      icon: Leaf,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: getScoreDescription(
        "environmental",
        company.environmental_score
      ),
    },
    {
      title: "Social Responsibility",
      score: company.social_score,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: getScoreDescription("social", company.social_score),
    },
    {
      title: "Corporate Ethics",
      score: company.governance_score,
      icon: Shield,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: getScoreDescription("governance", company.governance_score),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand Guide
          </Button>

          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                {company.brand_name || company.company_name}
              </h1>
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="outline" className="text-base px-3 py-1">
                  {company.industry || "Unknown Industry"}
                </Badge>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  {company.country || "Unknown Country"}
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-1" />
                  Founded {company.founded || "N/A"}
                </div>
              </div>
              <p className="text-gray-700 max-w-3xl mb-4 leading-relaxed">
                {company.description || "No description available."}
              </p>
              {company.website && (
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  Visit {company.website} →
                </a>
              )}
            </div>
            <div className="text-center ml-6">
              <Badge
                variant={getScoreBadgeVariant(company.overall_score)}
                className="text-2xl px-4 py-2 mb-2"
              >
                {company.overall_score !== null ? company.overall_score : "N/A"}
              </Badge>
              <div className="text-sm text-gray-600 font-medium">
                {getScoreLabel(company.overall_score)}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Products & Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {company.products && company.products.length > 0 ? (
                    company.products.map((product, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-sm"
                      >
                        {product}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400">
                      No products listed.
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Overall Ethics Rating</CardTitle>
                <CardDescription>
                  Based on Environmental, Social, and Governance practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold mb-2">
                    {company.overall_score !== null
                      ? company.overall_score
                      : "N/A"}
                    /100
                  </div>
                  <div className="text-gray-600 mb-3">
                    {getScoreLabel(company.overall_score)}
                  </div>
                  <Progress
                    value={company.overall_score || 0}
                    className="h-3"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  This score reflects the brand's commitment to ethical business
                  practices, environmental sustainability, and social
                  responsibility.
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - ESG Details and News */}
          <div className="lg:col-span-2 space-y-6">
            {/* Individual ESG Categories */}
            {esgCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`p-2 rounded-full ${category.bgColor} mr-3`}
                        >
                          <Icon className={`h-5 w-5 ${category.color}`} />
                        </div>
                        {category.title}
                      </div>
                      <div className="text-center">
                        <Badge
                          variant={getScoreBadgeVariant(category.score)}
                          className="text-lg px-3 py-1 mb-1"
                        >
                          {category.score !== null ? category.score : "N/A"}
                        </Badge>
                        <div className="text-xs text-gray-500">
                          {getScoreLabel(category.score)}
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={category.score || 0}
                      className="h-3 mb-3"
                    />
                    <p className="text-sm text-gray-700">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}

            {/* News Section */}
            <NewsSection company={company} />

            {/* Shopping Recommendation */}
            <Card
              className={`border-2 ${
                company.overall_score !== null && company.overall_score >= 80
                  ? "border-green-200 bg-green-50"
                  : company.overall_score !== null &&
                    company.overall_score >= 60
                  ? "border-yellow-200 bg-yellow-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <CardHeader>
                <CardTitle>Shopping Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                {company.overall_score !== null &&
                company.overall_score >= 80 ? (
                  <div className="text-green-800">
                    <p className="font-medium mb-2">✅ Recommended Choice</p>
                    <p className="text-sm">
                      This brand demonstrates strong ethical practices across
                      environmental, social, and governance areas. A great
                      choice for conscious consumers.
                    </p>
                  </div>
                ) : company.overall_score !== null &&
                  company.overall_score >= 60 ? (
                  <div className="text-yellow-800">
                    <p className="font-medium mb-2">⚠️ Consider Alternatives</p>
                    <p className="text-sm">
                      This brand has some good practices but could improve in
                      certain areas. Consider comparing with other options or
                      look for their sustainability commitments.
                    </p>
                  </div>
                ) : (
                  <div className="text-red-800">
                    <p className="font-medium mb-2">
                      ❌ Look for Better Options
                    </p>
                    <p className="text-sm">
                      This brand has significant room for improvement in ethical
                      practices. Consider supporting brands with stronger
                      commitments to sustainability and social responsibility.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
