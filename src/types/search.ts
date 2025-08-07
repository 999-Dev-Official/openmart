import { Location } from "./location";
import { BizOwnershipType, LegacyBrandStoreLocationView } from "./business";

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

// Only IDs Response Types
export interface SearchIDResult {
  id: string; // uuid
  place_id: string | null;
  match_score: number;
  cursor: any;
}

export type OnlyIDsResponse = SearchIDResult[];

export interface OnlyIDsResponseWithCount {
  data: SearchIDResult[];
  total_count?: number | null;
}

// Simplified Lead type for easier use
export type Lead = SearchMatch;
