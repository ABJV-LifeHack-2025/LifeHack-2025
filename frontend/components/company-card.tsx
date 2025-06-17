"use client";

import type React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Leaf,
  Users,
  Shield,
  MapPin,
  ExternalLink,
  Calendar,
  Heart,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { ESGData } from "@/lib/supabase"; // Use the type from supabase.ts

interface CompanyCardProps {
  company: ESGData;
  onClick?: () => void;
}

export function CompanyCard({ company, onClick }: CompanyCardProps) {
  const { user, toggleFavorite, isFavorite } = useAuth();

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

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(company.id);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const isCompanyFavorite = isFavorite(company.id);

  return (
    <div className="h-full">
      <Card
        className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02] h-full"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-4">
          {/* Header with brand name, location, and score */}
          <div className="space-y-3">
            {/* Brand name and favorite button */}
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-semibold text-gray-900 leading-tight flex-1 pr-2">
                {company.brand_name || company.company_name}
              </h3>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-8 w-8 shrink-0 hover:bg-gray-100"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isCompanyFavorite
                        ? "fill-red-500 text-red-500"
                        : "text-gray-400 hover:text-red-500"
                    }`}
                  />
                </Button>
              )}
            </div>

            {/* Industry and location */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs font-medium">
                {company.industry || "Unknown Industry"}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span>{company.country || "Unknown Country"}</span>
              </div>
            </div>

            {/* Overall score */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">Overall ESG Score</div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getScoreBadgeVariant(company.overall_score)}
                  className="text-base px-3 py-1"
                >
                  {company.overall_score !== null
                    ? company.overall_score
                    : "N/A"}
                </Badge>
                <span className="text-xs text-gray-500">
                  {getScoreLabel(company.overall_score)}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <p
              className="text-sm text-gray-600 leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.5rem",
              }}
            >
              {company.description || "No description available."}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Popular Products */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Popular Products
            </h4>
            <div className="flex flex-wrap gap-1" style={{ minHeight: "2rem" }}>
              {company.products && company.products.length > 0 ? (
                <>
                  {company.products.slice(0, 4).map((product, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {product}
                    </Badge>
                  ))}
                  {company.products.length > 4 && (
                    <Badge variant="secondary" className="text-xs">
                      +{company.products.length - 4} more
                    </Badge>
                  )}
                </>
              ) : (
                <span className="text-xs text-gray-400">
                  No products listed.
                </span>
              )}
            </div>
          </div>

          {/* ESG Scores */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Leaf className="h-3 w-3 text-green-600 mr-2" />
                  <span className="text-sm">Environmental Impact</span>
                </div>
                <span
                  className={`text-sm font-medium ${getScoreColor(
                    company.environmental_score
                  )}`}
                >
                  {company.environmental_score !== null
                    ? company.environmental_score
                    : "N/A"}
                  /100
                </span>
              </div>
              <Progress
                value={company.environmental_score || 0}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Users className="h-3 w-3 text-blue-600 mr-2" />
                  <span className="text-sm">Social Responsibility</span>
                </div>
                <span
                  className={`text-sm font-medium ${getScoreColor(
                    company.social_score
                  )}`}
                >
                  {company.social_score !== null ? company.social_score : "N/A"}
                  /100
                </span>
              </div>
              <Progress value={company.social_score || 0} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Shield className="h-3 w-3 text-purple-600 mr-2" />
                  <span className="text-sm">Corporate Ethics</span>
                </div>
                <span
                  className={`text-sm font-medium ${getScoreColor(
                    company.governance_score
                  )}`}
                >
                  {company.governance_score !== null
                    ? company.governance_score
                    : "N/A"}
                  /100
                </span>
              </div>
              <Progress value={company.governance_score || 0} className="h-2" />
            </div>
          </div>

          {/* Footer Info */}
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center">
                <ExternalLink className="h-3 w-3 mr-1" />
                <span>{company.website || "No website"}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Since {company.founded || "N/A"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
