import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type ESGData = {
  id: string;
  company_name: string;
  brand_name: string | null;
  ticker: string | null;
  industry: string | null;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  overall_score: number;
  last_updated: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
  founded: string | null;
  products: string[] | null;
};

export type News = {
  id: string;
  esg_id: string;
  title: string;
  summary: string;
  category: "environmental" | "social" | "governance";
  date: string | null;
  source: string | null;
  url: string | null;
};

export type Favorite = {
  id: string;
  user_id: string;
  esg_id: string;
};

export type Profile = {
  id: string;
  name: string;
  email: string;
};
