// Business Entity Types and Enums

// Enums
export type BizOwnershipType = "INDEPENDENT" | "FAMILY" | "FRANCHISE" | "CHAIN";

export type BizCategory =
  | "RESTAURANTS_DINING"
  | "BARS_NIGHTLIFE"
  | "GROCERY_CONVENIENCE_STORES"
  | "PHARMACIES_DRUGSTORES"
  | "BEAUTY_PERSONAL_CARE"
  | "FITNESS_RECREATION"
  | "AUTO_SERVICES"
  | "HOTELS_ACCOMMODATIONS"
  | "EVENT_PLANNING_SERVICES"
  | "FINANCIAL_SERVICES"
  | "REAL_ESTATE_PROPERTY_MANAGEMENT"
  | "LEGAL_PROFESSIONAL_SERVICES"
  | "HEALTH_WELLNESS"
  | "HOME_SERVICES_CONTRACTORS"
  | "CHILD_CARE_EDUCATION"
  | "ARTS_ENTERTAINMENT"
  | "SHOPPING_RETAIL"
  | "TECHNOLOGY_ELECTRONICS"
  | "TRANSPORTATION_TRAVEL"
  | "PUBLIC_SERVICES_GOVERNMENT"
  | "PET_SERVICES_SUPPLIES"
  | "OTHER";

// Staff Types
export interface Staff {
  name: string;
  role: string;
}

// Price Range
export interface StorePriceRange {
  min_?: number;
  max_?: number | null;
  currency?: string | null;
}

// Source Meta
export interface SourceMeta {
  [key: string]: any;
}

// Main Business/Lead Type
export interface LegacyBrandStoreLocationView {
  brand_id?: string | null;
  business_name?: string | null;
  business_type?: string | null;
  business_categories?: BizCategory[] | null;
  business_specialty?: string | null;
  business_keywords?: string[] | null;
  product_services_offered?: string[] | null;
  brand_description?: string | null;
  website_url?: string | null;
  business_emails?: string[] | null;
  business_phones?: string[] | null;
  social_media_links?: Record<string, string[]> | null;
  ownership_type?: BizOwnershipType | null;
  staffs?: Staff[] | null;
  source_urls?: string[] | null;
  root_domain?: string | null;
  num_stores?: number | null;
  store_id: string; // uuid
  source_id?: string | null;
  store_name: string;
  store_emails: string[];
  store_phones: string[];
  store_description?: string | null;
  features?: Record<string, string[]> | null;
  price_range?: StorePriceRange | null;
  price_tier?: number | null;
  google_reviews_count?: number | null;
  google_rating?: number | null;
  yelp_reviews_count?: number | null;
  yelp_rating?: number | null;
  from_sources: Record<string, SourceMeta>;
  tags: string[];
  place_key: string;
  latitude: number;
  longitude: number;
  street_address?: string | null;
  city: string;
  state: string;
  zipcode?: string | null;
  country: string;
  open_date?: string | null; // date-time
  info_refreshed_at?: string | null; // date-time
  [key: string]: any; // For additional fields
}
