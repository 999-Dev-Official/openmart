// Configuration
export interface OpenMartConfig {
  apiKey: string;
}

// Location Types
export interface GmapLeadSearchLocParams {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  geo_radius?: number; // in meters
}

export type Location = GmapLeadSearchLocParams | GmapLeadSearchLocParams[];

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

// Search Request Types
export interface SearchRequest {
  query?: string | null;
  location?: Location | null;
  min_locations?: number | null;
  max_locations?: number | null;
  has_contact_info?: boolean | null;
  min_total_reviews?: number | null;
  max_total_reviews?: number | null;
  ownership_type?: BizOwnershipType | null;
  min_price_tier?: number | null;
  max_price_tier?: number | null;
  min_overall_rating?: number | null;
  max_overall_rating?: number | null;
  limit?: number; // 0 < limit <= 500, default: 50
  cursor?: any | null;
  pagination?: {
    cursor?: any;
    limit?: number;
  } | null; // deprecated
  has_website?: boolean | null;
  estimate_total?: boolean; // default: false
  exclude_root_domains?: string[]; // max 10000 items
  exclude_keywords?: string[]; // max 64 items
  include_keywords?: string[]; // max 64 items
  has_valid_website?: boolean | null;
  open_date_before?: string | null; // unix timestamp
  open_date_after?: string | null; // unix timestamp
  store_name?: string | null;
  info_updated_before?: string | null; // unix timestamp
  info_updated_after?: string | null; // unix timestamp
}

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

// Search Match wrapper
export interface SearchMatch {
  id: string;
  content: LegacyBrandStoreLocationView;
  match_score?: number | null;
  match_highlights: string[];
  cursor?: any | null;
}

// Response Types
export type SearchResponse = SearchMatch[];

export interface SearchResponseWithCount {
  data: SearchMatch[];
  total_count: number;
}

// Simplified Lead type for easier use
export type Lead = SearchMatch;

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class OpenMartError extends Error {
  code?: string;
  statusCode?: number;
  details?: any;

  constructor(
    message: string,
    code?: string,
    statusCode?: number,
    details?: any
  ) {
    super(message);
    this.name = "OpenMartError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
