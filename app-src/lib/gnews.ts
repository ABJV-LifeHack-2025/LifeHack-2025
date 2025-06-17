import { supabase, type News } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const GNEWS_API_KEY =
  process.env.NEXT_PUBLIC_GNEWS_API_KEY || process.env.GNEWS_API_KEY;

const ESG_KEYWORDS = [
  "ESG",
  "sustainability",
  "environment",
  "social responsibility",
  "governance",
  "climate",
  "carbon",
  "diversity",
  "ethics",
  "green",
  "renewable",
  "sustainable",
];

function buildESGQuery(company: string) {
  // Combine company name with ESG keywords for a more relevant search
  return `${company} (${ESG_KEYWORDS.join(" OR ")})`;
}

export async function fetchCompanyESGNews(company: string, max = 5) {
  const query = buildESGQuery(company);
  const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(
    query
  )}&lang=en&max=${max}&token=${GNEWS_API_KEY}`;
  console.log("GNews API URL:", url);
  const res = await fetch(url);
  const data = await res.json();
  console.log("GNews API response:", data);

  // Handle GNews API quota error
  if (
    Array.isArray(data.errors) &&
    data.errors.includes("You have exceeded your daily request quota.")
  ) {
    console.error("GNews API quota exceeded. Please try again later.");
    throw new Error("GNews API quota exceeded. Please try again later.");
  }

  if (
    (Array.isArray(data.errors) && data.errors.length > 0) ||
    (typeof data.errors === "object" &&
      data.errors !== null &&
      Object.keys(data.errors).length > 0)
  ) {
    console.error("GNews API error:", data.errors, "Full response:", data);
    throw new Error("GNews API error: " + JSON.stringify(data.errors));
  }

  if (!res.ok) throw new Error("Failed to fetch news");
  return data.articles;
}

const NEWS_CACHE_HOURS = 12; // Only fetch new news if cache is older than this

function categorizeArticle(
  article: any
): "environmental" | "social" | "governance" {
  const text = `${article.title} ${article.description}`.toLowerCase();
  if (
    text.includes("environment") ||
    text.includes("climate") ||
    text.includes("carbon") ||
    text.includes("green") ||
    text.includes("renewable") ||
    text.includes("sustainable")
  )
    return "environmental";
  if (
    text.includes("social") ||
    text.includes("diversity") ||
    text.includes("ethics") ||
    text.includes("responsibility") ||
    text.includes("community") ||
    text.includes("human rights") ||
    text.includes("labor rights") ||
    text.includes("inclusion")
  )
    return "social";
  if (
    text.includes("governance") ||
    text.includes("board") ||
    text.includes("audit") ||
    text.includes("compliance") ||
    text.includes("transparency") ||
    text.includes("shareholder")
  )
    return "governance";
  return "environmental"; // default/fallback
}

export async function getOrFetchCompanyESGNews(
  companyId: string,
  companyName: string,
  max = 6
) {
  const since = new Date(
    Date.now() - NEWS_CACHE_HOURS * 60 * 60 * 1000
  ).toISOString();
  const { data: cached } = await supabase
    .from("news")
    .select("*")
    .eq("esg_id", companyId)
    .gte("date", since)
    .order("date", { ascending: false });

  if (cached && cached.length >= 6) {
    return cached as News[];
  }

  // Fetch existing URLs for this company
  const { data: existingNews } = await supabase
    .from("news")
    .select("url")
    .eq("esg_id", companyId);

  const existingUrls = new Set((existingNews ?? []).map((n) => n.url));

  // Only insert articles with URLs not already in the DB
  const articles = await fetchCompanyESGNews(companyName, max);
  const newsRows: News[] = articles
    .filter((article: any) => !existingUrls.has(article.url))
    .map((article: any) => ({
      id: uuidv4(), // <-- Add this line
      esg_id: companyId,
      title: article.title,
      summary: article.description,
      category: categorizeArticle(article),
      date: article.publishedAt,
      source: article.source?.name || null,
      url: article.url,
    }));

  if (newsRows.length > 0) {
    console.log("Inserting newsRows:", newsRows);
    const { error: insertError } = await supabase.from("news").insert(newsRows);
    if (insertError) {
      console.error(
        "Failed to insert news into Supabase:",
        insertError.message
      );
    }
  }

  // Return all recent news (including newly inserted)
  const { data: allNews } = await supabase
    .from("news")
    .select("*")
    .eq("esg_id", companyId)
    .gte("date", since)
    .order("date", { ascending: false });

  return allNews as News[];
}

// Alter table news add constraint unique_url unique (url);
