-- Insert sample ESG data
INSERT INTO esg_data (
  company_name, ticker, industry, environmental_score, social_score, governance_score, 
  overall_esg_score, market_cap, carbon_emissions, water_usage, waste_reduction,
  employee_satisfaction, diversity_score, community_investment, board_independence,
  executive_compensation, transparency_score
) VALUES 
  ('Apple Inc.', 'AAPL', 'Technology', 85, 82, 88, 85, 3000000000000, 25.2, 1.8, 78.5, 89.2, 85.3, 150.5, 92.1, 98.7, 91.4),
  ('Microsoft Corporation', 'MSFT', 'Technology', 88, 85, 90, 88, 2800000000000, 22.1, 1.5, 82.3, 91.5, 87.8, 175.2, 94.3, 96.2, 93.7),
  ('Tesla Inc.', 'TSLA', 'Automotive', 92, 75, 70, 79, 800000000000, 15.8, 2.1, 85.7, 82.3, 78.9, 95.3, 78.5, 85.1, 82.6),
  ('Johnson & Johnson', 'JNJ', 'Healthcare', 78, 88, 85, 84, 450000000000, 28.5, 3.2, 72.1, 87.6, 82.4, 220.8, 89.7, 91.3, 88.9),
  ('Procter & Gamble', 'PG', 'Consumer Goods', 82, 80, 87, 83, 380000000000, 31.2, 2.8, 75.9, 85.1, 79.6, 185.4, 91.2, 89.8, 87.3),
  ('Unilever PLC', 'UL', 'Consumer Goods', 89, 86, 82, 86, 140000000000, 26.7, 2.4, 81.3, 88.9, 84.7, 198.6, 87.4, 88.2, 89.1),
  ('Patagonia Inc.', 'PTGN', 'Retail', 95, 92, 78, 88, 3000000000, 8.2, 0.9, 92.5, 94.7, 91.3, 45.2, 82.1, 79.8, 86.4),
  ('Salesforce Inc.', 'CRM', 'Technology', 86, 89, 85, 87, 220000000000, 18.9, 1.2, 79.8, 92.4, 88.6, 165.7, 88.9, 92.1, 90.3),
  ('Walmart Inc.', 'WMT', 'Retail', 72, 78, 80, 77, 420000000000, 45.6, 4.1, 68.2, 79.8, 74.5, 312.9, 83.7, 76.4, 78.9),
  ('ExxonMobil Corporation', 'XOM', 'Energy', 45, 52, 65, 54, 280000000000, 142.3, 8.7, 35.8, 68.2, 58.9, 89.4, 72.1, 68.7, 62.5);
