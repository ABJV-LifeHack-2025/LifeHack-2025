export type ESGData = {
  id: string
  company_name: string
  brand_name: string
  ticker: string
  industry: string
  environmental_score: number
  social_score: number
  governance_score: number
  overall_score: number
  last_updated: string
  country: string
  description: string
  website: string
  founded: string
  products: string[]
}

export type NewsItem = {
  id: string
  title: string
  summary: string
  category: "environmental" | "social" | "governance"
  date: string
  source: string
  url: string
}

export type User = {
  id: string
  email: string
  name: string
  favorites: string[] // Array of brand IDs
}

// Mock news data for each company
export const mockNewsData: Record<string, NewsItem[]> = {
  "1": [
    // Microsoft
    {
      id: "ms1",
      title: "Microsoft Commits to Carbon Negative by 2030",
      summary:
        "Microsoft announces ambitious plan to be carbon negative by 2030 and remove all historical emissions by 2050.",
      category: "environmental",
      date: "2024-01-10",
      source: "Tech News Daily",
      url: "#",
    },
    {
      id: "ms2",
      title: "Microsoft Expands Accessibility Features Across Products",
      summary: "New accessibility tools launched to support users with disabilities across Microsoft's product suite.",
      category: "social",
      date: "2024-01-08",
      source: "Accessibility Today",
      url: "#",
    },
    {
      id: "ms3",
      title: "Microsoft Board Enhances Diversity and Inclusion Oversight",
      summary: "Board of Directors strengthens governance around diversity, equity, and inclusion initiatives.",
      category: "governance",
      date: "2024-01-05",
      source: "Corporate Governance Weekly",
      url: "#",
    },
  ],
  "2": [
    // Tesla
    {
      id: "ts1",
      title: "Tesla Opens New Gigafactory Powered by 100% Renewable Energy",
      summary:
        "Latest manufacturing facility operates entirely on solar and wind power, setting new industry standards.",
      category: "environmental",
      date: "2024-01-12",
      source: "Green Energy Report",
      url: "#",
    },
    {
      id: "ts2",
      title: "Tesla Faces Workplace Safety Scrutiny",
      summary: "Regulatory review of workplace safety practices at Tesla manufacturing facilities ongoing.",
      category: "social",
      date: "2024-01-09",
      source: "Labor Watch",
      url: "#",
    },
  ],
  "6": [
    // Patagonia
    {
      id: "pt1",
      title: "Patagonia Donates $100M to Fight Climate Crisis",
      summary: "Company founder transfers ownership to environmental causes, dedicating all profits to climate action.",
      category: "environmental",
      date: "2024-01-14",
      source: "Environmental Action News",
      url: "#",
    },
    {
      id: "pt2",
      title: "Patagonia's Fair Trade Program Expands Globally",
      summary: "Fair Trade certification extended to more suppliers, ensuring better working conditions worldwide.",
      category: "social",
      date: "2024-01-11",
      source: "Fair Trade Times",
      url: "#",
    },
  ],
}

export const mockESGData: ESGData[] = [
  {
    id: "1",
    company_name: "Microsoft Corporation",
    brand_name: "Microsoft",
    ticker: "MSFT",
    industry: "Technology",
    environmental_score: 85,
    social_score: 88,
    governance_score: 92,
    overall_score: 88,
    last_updated: "2024-01-15",
    country: "United States",
    description:
      "Technology company creating software, cloud services, and devices that empower people and organizations.",
    website: "microsoft.com",
    founded: "1975",
    products: ["Windows", "Office", "Xbox", "Azure", "Surface"],
  },
  {
    id: "2",
    company_name: "Tesla Inc",
    brand_name: "Tesla",
    ticker: "TSLA",
    industry: "Automotive",
    environmental_score: 95,
    social_score: 72,
    governance_score: 68,
    overall_score: 78,
    last_updated: "2024-01-15",
    country: "United States",
    description: "Electric vehicle and clean energy company accelerating the world's transition to sustainable energy.",
    website: "tesla.com",
    founded: "2003",
    products: ["Model S", "Model 3", "Model X", "Model Y", "Solar Panels", "Powerwall"],
  },
  {
    id: "3",
    company_name: "Unilever PLC",
    brand_name: "Unilever",
    ticker: "UL",
    industry: "Consumer Goods",
    environmental_score: 82,
    social_score: 89,
    governance_score: 85,
    overall_score: 85,
    last_updated: "2024-01-15",
    country: "United Kingdom",
    description:
      "Consumer goods company with sustainable living brands that make everyday products better for you and the planet.",
    website: "unilever.com",
    founded: "1929",
    products: ["Dove", "Ben & Jerry's", "Hellmann's", "Knorr", "Lipton", "Axe"],
  },
  {
    id: "4",
    company_name: "Johnson & Johnson",
    brand_name: "Johnson & Johnson",
    ticker: "JNJ",
    industry: "Healthcare & Personal Care",
    environmental_score: 78,
    social_score: 91,
    governance_score: 87,
    overall_score: 85,
    last_updated: "2024-01-15",
    country: "United States",
    description:
      "Healthcare company focused on pharmaceuticals, medical devices, and consumer products for families worldwide.",
    website: "jnj.com",
    founded: "1886",
    products: ["Band-Aid", "Tylenol", "Johnson's Baby", "Neutrogena", "Listerine"],
  },
  {
    id: "5",
    company_name: "Apple Inc",
    brand_name: "Apple",
    ticker: "AAPL",
    industry: "Technology",
    environmental_score: 88,
    social_score: 83,
    governance_score: 89,
    overall_score: 87,
    last_updated: "2024-01-15",
    country: "United States",
    description: "Technology company designing and manufacturing consumer electronics, software, and online services.",
    website: "apple.com",
    founded: "1976",
    products: ["iPhone", "iPad", "Mac", "Apple Watch", "AirPods", "Apple TV"],
  },
  {
    id: "6",
    company_name: "Patagonia Inc",
    brand_name: "Patagonia",
    ticker: "PTGN",
    industry: "Apparel & Outdoor",
    environmental_score: 98,
    social_score: 85,
    governance_score: 82,
    overall_score: 88,
    last_updated: "2024-01-15",
    country: "United States",
    description:
      "Outdoor clothing company committed to environmental activism and building the best product while causing no unnecessary harm.",
    website: "patagonia.com",
    founded: "1973",
    products: ["Jackets", "Fleece", "Outdoor Gear", "Backpacks", "Footwear"],
  },
  {
    id: "7",
    company_name: "Nestlé S.A.",
    brand_name: "Nestlé",
    ticker: "NSRGY",
    industry: "Food & Beverages",
    environmental_score: 75,
    social_score: 82,
    governance_score: 88,
    overall_score: 82,
    last_updated: "2024-01-15",
    country: "Switzerland",
    description:
      "Food and beverage company focused on nutrition, health and wellness with brands trusted by families worldwide.",
    website: "nestle.com",
    founded: "1866",
    products: ["KitKat", "Nescafé", "Maggi", "Purina", "Häagen-Dazs", "Gerber"],
  },
  {
    id: "8",
    company_name: "Nike Inc",
    brand_name: "Nike",
    ticker: "NKE",
    industry: "Apparel & Footwear",
    environmental_score: 79,
    social_score: 76,
    governance_score: 83,
    overall_score: 79,
    last_updated: "2024-01-15",
    country: "United States",
    description:
      "Athletic footwear and apparel company inspiring athletes and promoting sport as a universal language of hope.",
    website: "nike.com",
    founded: "1964",
    products: ["Air Jordan", "Air Max", "React", "Dri-FIT", "Nike Pro"],
  },
  {
    id: "9",
    company_name: "The Coca-Cola Company",
    brand_name: "Coca-Cola",
    ticker: "KO",
    industry: "Food & Beverages",
    environmental_score: 68,
    social_score: 74,
    governance_score: 81,
    overall_score: 74,
    last_updated: "2024-01-15",
    country: "United States",
    description: "Beverage company refreshing the world and making a difference through our brands and actions.",
    website: "coca-cola.com",
    founded: "1886",
    products: ["Coca-Cola", "Sprite", "Fanta", "Dasani", "Powerade", "Minute Maid"],
  },
  {
    id: "10",
    company_name: "Starbucks Corporation",
    brand_name: "Starbucks",
    ticker: "SBUX",
    industry: "Food & Beverages",
    environmental_score: 84,
    social_score: 87,
    governance_score: 85,
    overall_score: 85,
    last_updated: "2024-01-15",
    country: "United States",
    description:
      "Coffee company and coffeehouse chain committed to ethically sourcing coffee and creating positive impact in communities.",
    website: "starbucks.com",
    founded: "1971",
    products: ["Coffee", "Frappuccino", "Tea", "Food", "Merchandise"],
  },
  {
    id: "11",
    company_name: "IKEA",
    brand_name: "IKEA",
    ticker: "IKEA",
    industry: "Home & Furniture",
    environmental_score: 86,
    social_score: 88,
    governance_score: 82,
    overall_score: 85,
    last_updated: "2024-01-15",
    country: "Sweden",
    description:
      "Furniture retailer offering well-designed, functional home furnishing products at affordable prices for the many people.",
    website: "ikea.com",
    founded: "1943",
    products: ["Furniture", "Home Accessories", "Kitchen", "Bedroom", "Storage"],
  },
  {
    id: "12",
    company_name: "H&M Hennes & Mauritz AB",
    brand_name: "H&M",
    ticker: "HM",
    industry: "Fashion & Retail",
    environmental_score: 71,
    social_score: 69,
    governance_score: 76,
    overall_score: 72,
    last_updated: "2024-01-15",
    country: "Sweden",
    description:
      "Fashion retailer offering fashion and quality at the best price in a sustainable way for fashion-conscious customers.",
    website: "hm.com",
    founded: "1947",
    products: ["Clothing", "Accessories", "Home Textiles", "Cosmetics"],
  },
]
