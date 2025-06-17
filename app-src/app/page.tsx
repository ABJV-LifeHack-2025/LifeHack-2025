"use client";

import { useState, useEffect } from "react";
import { supabase, type ESGData } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  ShoppingBag,
  LogIn,
  LogOut,
  User,
  Heart,
  UserPlus,
} from "lucide-react";
import { CompanyCard } from "@/components/company-card";
import { CompanyDetail } from "@/components/company-detail";
import { LoginModal } from "@/components/login-modal";
import { SignupModal } from "@/components/signup-modal";
import { useAuth } from "@/lib/auth-context";

export default function EthicalBrandGuide() {
  const [brandData, setBrandData] = useState<ESGData[]>([]);
  const [filteredData, setFilteredData] = useState<ESGData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("overall_score");
  const [selectedBrand, setSelectedBrand] = useState<ESGData | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, logout, isFavorite } = useAuth();

  // Fetch ESG data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("esg_data").select("*");
      if (error) {
        setError("Failed to load ESG data.");
        setBrandData([]);
      } else {
        setBrandData(data as ESGData[]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterAndSortData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brandData, searchTerm, industryFilter, sortBy, showFavoritesOnly]);

  const filterAndSortData = () => {
    const filtered = brandData.filter((brand) => {
      const matchesSearch =
        (brand.brand_name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (brand.company_name?.toLowerCase() || "").includes(
          searchTerm.toLowerCase()
        ) ||
        (brand.products || []).some((product) =>
          (product?.toLowerCase() || "").includes(searchTerm.toLowerCase())
        );
      const matchesIndustry =
        industryFilter === "all" || brand.industry === industryFilter;
      const matchesFavorites = !showFavoritesOnly || isFavorite(brand.id);
      return matchesSearch && matchesIndustry && matchesFavorites;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "environmental_score":
          return (b.environmental_score || 0) - (a.environmental_score || 0);
        case "social_score":
          return (b.social_score || 0) - (a.social_score || 0);
        case "governance_score":
          return (b.governance_score || 0) - (a.governance_score || 0);
        case "brand_name":
          return (a.brand_name || "").localeCompare(b.brand_name || "");
        default:
          return (b.overall_score || 0) - (a.overall_score || 0);
      }
    });

    setFilteredData(filtered);
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const industries = [
    ...new Set(
      brandData.map((brand) => brand.industry).filter((i) => i && i !== "")
    ),
  ] as string[];
  const favoriteCount = brandData.filter((brand) =>
    isFavorite(brand.id)
  ).length;

  const favoriteBrands = brandData.filter((brand) => isFavorite(brand.id));

  const averageScore = (key: keyof ESGData): string => {
    if (favoriteBrands.length === 0) return "N/A";
    const total = favoriteBrands.reduce((sum, b) => {
      const value = Number(b[key]);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return (total / favoriteBrands.length).toFixed(2);
  };

  const topCategory = (): string => {
    if (favoriteBrands.length === 0) return "N/A";
    const counts: Record<string, number> = {};
    favoriteBrands.forEach((b) => {
      if (b.industry) {
        counts[b.industry] = (counts[b.industry] || 0) + 1;
      }
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "N/A";
  };

  if (selectedBrand) {
    // Ensure brand_name is always a string for CompanyDetail
    return (
      <CompanyDetail
        company={{
          ...selectedBrand,
          brand_name: selectedBrand.brand_name ?? "",
        }}
        onBack={() => setSelectedBrand(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-4xl font-bold text-gray-900">
                Ethical Brand Guide
              </h1>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Welcome, {user.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    <Heart
                      className={`h-4 w-4 mr-2 ${
                        showFavoritesOnly ? "fill-red-500 text-red-500" : ""
                      }`}
                    />
                    Favorites ({favoriteCount})
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowSignupModal(true)}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </Button>
                  <Button onClick={() => setShowLoginModal(true)}>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto text-center">
            Discover the environmental, social, and governance practices of your
            favorite brands. Make informed choices that align with your values.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Find Brands
              {showFavoritesOnly && (
                <span className="text-sm font-normal text-gray-500">
                  (Showing favorites only)
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search brands or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overall_score">
                    Overall Ethics Score
                  </SelectItem>
                  <SelectItem value="environmental_score">
                    Environmental Impact
                  </SelectItem>
                  <SelectItem value="social_score">
                    Social Responsibility
                  </SelectItem>
                  <SelectItem value="governance_score">
                    Corporate Governance
                  </SelectItem>
                  <SelectItem value="brand_name">Brand Name</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Showing {filteredData.length} of {brandData.length} brands
            </div>
          </CardContent>
        </Card>

        {showFavoritesOnly && favoriteBrands.length > 0 && (
          <Card className="mb-8 bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-green-800">
                Favorite Brand Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-900">
              <div>
                <p className="text-sm text-green-700">Total Favorites</p>
                <p className="text-2xl font-bold">{favoriteBrands.length}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Top Industry</p>
                <p className="text-2xl font-bold">{topCategory()}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Avg. Ethics Score</p>
                <p className="text-2xl font-bold">
                  {averageScore("overall_score")}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Brand Cards */}
        {loading ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Loading brands...
              </h3>
              <p className="text-gray-600">
                Please wait while we fetch the latest ESG data.
              </p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Error loading brands
              </h3>
              <p className="text-gray-600">{error}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map((brand) => (
                <CompanyCard
                  key={brand.id}
                  company={brand}
                  onClick={() => setSelectedBrand(brand)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredData.length === 0 && !loading && !error && (
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {showFavoritesOnly
                  ? "No favorite brands found"
                  : "No brands found"}
              </h3>
              <p className="text-gray-600">
                {showFavoritesOnly
                  ? "Start adding brands to your favorites to see them here"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            ESG scores are based on Environmental, Social, and Governance
            practices.
          </p>
          <p className="mt-1">
            Higher scores indicate more ethical and sustainable business
            practices.
          </p>
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
