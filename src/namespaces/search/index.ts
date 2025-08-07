import { AxiosInstance } from "axios";
import {
  SearchRequest,
  SearchResponse,
  SearchResponseWithCount,
  SearchMatch,
  OpenMartError,
} from "../../types";

export class SearchNamespace {
  constructor(private client: AxiosInstance) {}

  /**
   * Execute a search for business leads using the OpenMart API
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
  async execute(
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
}
