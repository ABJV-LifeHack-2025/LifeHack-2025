-- Create the ESG data table
CREATE TABLE IF NOT EXISTS esg_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  ticker TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  environmental_score INTEGER CHECK (environmental_score >= 0 AND environmental_score <= 100),
  social_score INTEGER CHECK (social_score >= 0 AND social_score <= 100),
  governance_score INTEGER CHECK (governance_score >= 0 AND governance_score <= 100),
  overall_esg_score INTEGER CHECK (overall_esg_score >= 0 AND overall_esg_score <= 100),
  market_cap BIGINT,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  carbon_emissions DECIMAL(10,2),
  water_usage DECIMAL(10,2),
  waste_reduction DECIMAL(5,2),
  employee_satisfaction DECIMAL(5,2),
  diversity_score DECIMAL(5,2),
  community_investment DECIMAL(10,2),
  board_independence DECIMAL(5,2),
  executive_compensation DECIMAL(10,2),
  transparency_score DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_esg_data_ticker ON esg_data(ticker);
CREATE INDEX IF NOT EXISTS idx_esg_data_industry ON esg_data(industry);
CREATE INDEX IF NOT EXISTS idx_esg_data_overall_score ON esg_data(overall_esg_score DESC);

-- Enable Row Level Security
ALTER TABLE esg_data ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON esg_data
  FOR SELECT USING (true);
