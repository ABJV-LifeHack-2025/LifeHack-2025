import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type ESGData = {
  id: string
  company_name: string
  ticker: string
  industry: string
  environmental_score: number
  social_score: number
  governance_score: number
  overall_esg_score: number
  market_cap: number
  last_updated: string
  carbon_emissions: number
  water_usage: number
  waste_reduction: number
  employee_satisfaction: number
  diversity_score: number
  community_investment: number
  board_independence: number
  executive_compensation: number
  transparency_score: number
}
