import { AxiosInstance } from "axios";
import {
  SearchRequest,
  SearchResponse,
  SearchResponseWithCount,
  SearchMatch,
  OnlyIDsResponse,
  OnlyIDsResponseWithCount,
  OpenMartError,
} from "../../types";

export class SearchNamespace {
  constructor(private client: AxiosInstance) {}

  /**
   * Query for business leads using the OpenMart API
   *
   * @param request SearchRequest object containing all search parameters including:
   *   - query: Search terms to find relevant business leads
   *   - location: Location parameters (coordinates, geo_radius, etc.)
   *   - has_contact_info: Filter for businesses with contact information
   *   - has_website: Filter for businesses with websites
   *   - has_valid_website: Filter for businesses with valid/accessible websites
   *   - min_total_reviews: Minimum number of reviews
   *   - min_overall_rating: Minimum rating (0-5)
   *   - ownership_type: Type of business ownership
   *   - min_price_tier / max_price_tier: Price tier range
   *   - include_keywords: Keywords to rank higher
   *   - exclude_keywords: Keywords to exclude
   *   - info_updated_after: Unix timestamp for recently updated businesses
   *   - store_name: Search by specific store name
   *   - open_date_after / open_date_before: Date range for business opening
   *   - estimate_total: If true, response includes total count
   *   - limit: Maximum number of records (default: 50, max: 500)
   *   - cursor: Pagination cursor
   *
   * @returns Promise<SearchResponse | SearchResponseWithCount> containing search results
   */
  async query(
    request: SearchRequest = {}
  ): Promise<SearchResponse | SearchResponseWithCount> {
    try {
      // Set default limit if not provided
      const requestBody = {
        limit: 50,
        ...request,
      };

      // If estimate_total is true, response will be wrapped with total_count
      if (request.estimate_total) {
        const response = await this.client.post<SearchResponseWithCount>(
          "/api/v1/search",
          requestBody
        );
        return response.data;
      } else {
        const response = await this.client.post<SearchResponse>(
          "/api/v1/search",
          requestBody
        );
        return response.data;
      }
    } catch (error) {
      if (error instanceof OpenMartError) {
        throw error;
      }
      throw new OpenMartError(
        "An unexpected error occurred during search",
        "SEARCH_ERROR"
      );
    }
  }

  /**
   * Query for business lead IDs only using the OpenMart API
   *
   * This method returns only the IDs, place_ids, match scores, and cursors for matching businesses,
   * which is more efficient when you only need identifiers rather than full business data.
   *
   * @param request SearchRequest object containing all search parameters including:
   *   - query: Search terms to find relevant business leads
   *   - location: Location parameters (coordinates, geo_radius, etc.)
   *   - has_contact_info: Filter for businesses with contact information
   *   - has_website: Filter for businesses with websites
   *   - has_valid_website: Filter for businesses with valid/accessible websites
   *   - min_total_reviews: Minimum number of reviews
   *   - min_overall_rating: Minimum rating (0-5)
   *   - ownership_type: Type of business ownership
   *   - min_price_tier / max_price_tier: Price tier range
   *   - include_keywords: Keywords to rank higher
   *   - exclude_keywords: Keywords to exclude
   *   - info_updated_after: Unix timestamp for recently updated businesses
   *   - store_name: Search by specific store name
   *   - open_date_after / open_date_before: Date range for business opening
   *   - estimate_total: If true, response includes total count
   *   - limit: Maximum number of records (default: 50, max: 1000)
   *   - cursor: Pagination cursor
   *
   * @returns Promise<OnlyIDsResponse | OnlyIDsResponseWithCount> containing search result IDs
   */
  async onlyIds(
    request: SearchRequest = {}
  ): Promise<OnlyIDsResponse | OnlyIDsResponseWithCount> {
    try {
      // Set default limit if not provided
      const requestBody = {
        limit: 50,
        ...request,
      };

      // If estimate_total is true, response will be wrapped with total_count
      if (request.estimate_total) {
        const response = await this.client.post<OnlyIDsResponseWithCount>(
          "/api/v1/search/only_ids",
          requestBody
        );
        return response.data;
      } else {
        const response = await this.client.post<OnlyIDsResponse>(
          "/api/v1/search/only_ids",
          requestBody
        );
        return response.data;
      }
    } catch (error) {
      if (error instanceof OpenMartError) {
        throw error;
      }
      throw new OpenMartError(
        "An unexpected error occurred during ID search",
        "SEARCH_IDS_ERROR"
      );
    }
  }
}
