import { AxiosInstance } from "axios";
import {
  SearchRequest,
  SearchResponse,
  SearchResponseWithCount,
  SearchMatch,
  OpenMartError,
  GmapLeadSearchLocParams,
  BizOwnershipType,
  Staff,
  LegacyBrandStoreLocationView,
} from "../../types";

export class SearchNamespace {
  constructor(private client: AxiosInstance) {}

  /**
   * Search for business leads using the OpenMart API
   * @param request SearchRequest object containing search parameters
   * @returns Promise<SearchResponse | SearchResponseWithCount> containing search results
   */
  async search(
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
   * Simple search with just a query string
   * @param query Search terms to find relevant business leads
   * @param limit Maximum number of records to return (default: 50, max: 500)
   * @returns Promise<SearchMatch[]> Array of business leads
   */
  async simple(query: string, limit: number = 50): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      limit,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses by location
   * @param query Search query (business type, industry, etc.)
   * @param location Location parameters
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of business leads
   */
  async byLocation(
    query: string,
    location: GmapLeadSearchLocParams,
    options?: Omit<SearchRequest, "query" | "location">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      location,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses near coordinates
   * @param query Search query
   * @param latitude Latitude coordinate
   * @param longitude Longitude coordinate
   * @param radiusMeters Search radius in meters
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of business leads
   */
  async nearCoordinates(
    query: string,
    latitude: number,
    longitude: number,
    radiusMeters: number = 5000,
    options?: Omit<SearchRequest, "query" | "location">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      location: {
        coordinates: { latitude, longitude },
        geo_radius: radiusMeters,
      },
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses with contact information
   * @param query Search query
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of leads with contact info
   */
  async withContactInfo(
    query: string,
    options?: Omit<SearchRequest, "query" | "has_contact_info">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      has_contact_info: true,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses with websites
   * @param query Search query
   * @param validOnly Only return businesses with valid/accessible websites
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of leads with websites
   */
  async withWebsite(
    query: string,
    validOnly: boolean = false,
    options?: Omit<SearchRequest, "query" | "has_website" | "has_valid_website">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      has_website: true,
      has_valid_website: validOnly ? true : undefined,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses by review criteria
   * @param query Search query
   * @param minReviews Minimum number of reviews
   * @param minRating Minimum rating (0-5)
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of highly-reviewed businesses
   */
  async byReviews(
    query: string,
    minReviews?: number,
    minRating?: number,
    options?: Omit<
      SearchRequest,
      "query" | "min_total_reviews" | "min_overall_rating"
    >
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      min_total_reviews: minReviews,
      min_overall_rating: minRating,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses by ownership type
   * @param query Search query
   * @param ownershipType Type of business ownership
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of businesses
   */
  async byOwnershipType(
    query: string,
    ownershipType: BizOwnershipType,
    options?: Omit<SearchRequest, "query" | "ownership_type">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      ownership_type: ownershipType,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for businesses by price tier
   * @param query Search query
   * @param minTier Minimum price tier
   * @param maxTier Maximum price tier
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of businesses
   */
  async byPriceTier(
    query: string,
    minTier?: number,
    maxTier?: number,
    options?: Omit<SearchRequest, "query" | "min_price_tier" | "max_price_tier">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      min_price_tier: minTier,
      max_price_tier: maxTier,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search with keyword filters
   * @param query Search query
   * @param includeKeywords Keywords to rank higher
   * @param excludeKeywords Keywords to exclude
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of filtered businesses
   */
  async withKeywordFilters(
    query: string,
    includeKeywords?: string[],
    excludeKeywords?: string[],
    options?: Omit<
      SearchRequest,
      "query" | "include_keywords" | "exclude_keywords"
    >
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      include_keywords: includeKeywords,
      exclude_keywords: excludeKeywords,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search for recently updated businesses
   * @param query Search query
   * @param updatedAfter Unix timestamp or date string
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of recently updated businesses
   */
  async recentlyUpdated(
    query: string,
    updatedAfter: string | number,
    options?: Omit<SearchRequest, "query" | "info_updated_after">
  ): Promise<SearchMatch[]> {
    const timestamp =
      typeof updatedAfter === "number" ? updatedAfter.toString() : updatedAfter;

    const response = (await this.search({
      query,
      info_updated_after: timestamp,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Search with total count estimation
   * @param request Search request parameters
   * @returns Promise<SearchResponseWithCount> Response with total count
   */
  async searchWithCount(
    request: SearchRequest = {}
  ): Promise<SearchResponseWithCount> {
    const response = (await this.search({
      ...request,
      estimate_total: true,
    })) as SearchResponseWithCount;
    return response;
  }

  /**
   * Paginated search using cursor
   * @param request Initial search request
   * @param pageSize Number of results per page (max 500)
   * @returns AsyncGenerator yielding pages of results
   */
  async *paginate(
    request: SearchRequest = {},
    pageSize: number = 50
  ): AsyncGenerator<SearchMatch[], void, unknown> {
    let cursor: any | undefined;
    let hasMore = true;

    while (hasMore) {
      const response = (await this.search({
        ...request,
        limit: Math.min(pageSize, 500),
        cursor,
      })) as SearchResponse;

      yield response;

      // Get cursor from last item
      const lastItem = response[response.length - 1];
      if (response.length < pageSize || !lastItem?.cursor) {
        hasMore = false;
      } else {
        cursor = lastItem.cursor;
      }
    }
  }

  /**
   * Get all results for a search (be careful with large result sets)
   * @param request Search request
   * @param maxResults Maximum number of results to retrieve
   * @returns Promise<SearchMatch[]> All matching leads
   */
  async all(
    request: SearchRequest = {},
    maxResults: number = 1000
  ): Promise<SearchMatch[]> {
    const results: SearchMatch[] = [];
    let cursor: any | undefined;

    while (results.length < maxResults) {
      const batchSize = Math.min(500, maxResults - results.length);
      const response = (await this.search({
        ...request,
        limit: batchSize,
        cursor,
      })) as SearchResponse;

      results.push(...response);

      // Get cursor from last item
      const lastItem = response[response.length - 1];
      if (response.length < batchSize || !lastItem?.cursor) {
        break;
      }
      cursor = lastItem.cursor;
    }

    return results;
  }

  /**
   * Extract all staff members from search results
   * @param request Search request
   * @returns Promise<Staff[]> Array of all staff members found
   */
  async getStaffMembers(
    request: SearchRequest = {}
  ): Promise<{ business: string; staff: Staff }[]> {
    const response = (await this.search({
      ...request,
      has_contact_info: true,
    })) as SearchResponse;

    const staffMembers: { business: string; staff: Staff }[] = [];
    for (const match of response) {
      const business = match.content;
      if (business.staffs) {
        for (const staff of business.staffs) {
          staffMembers.push({
            business: business.business_name || business.store_name,
            staff,
          });
        }
      }
    }

    return staffMembers;
  }

  /**
   * Get businesses with specific features
   * @param query Search query
   * @param features Features to look for
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of businesses with specified features
   */
  async withFeatures(
    query: string,
    features: string[],
    options?: Omit<SearchRequest, "query">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      query,
      include_keywords: features,
      ...options,
    })) as SearchResponse;

    // Filter to only businesses that have the features
    return response.filter((match) => {
      if (!match.content.features) return false;
      const businessFeatures = Object.keys(match.content.features);
      return features.some((f) => businessFeatures.includes(f));
    });
  }

  /**
   * Get businesses by store name
   * @param storeName Store name to search for
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of matching businesses
   */
  async byStoreName(
    storeName: string,
    options?: Omit<SearchRequest, "store_name">
  ): Promise<SearchMatch[]> {
    const response = (await this.search({
      store_name: storeName,
      ...options,
    })) as SearchResponse;
    return response;
  }

  /**
   * Extract business data only (without match metadata)
   * @param matches Array of search matches
   * @returns Array of business data
   */
  extractBusinessData(matches: SearchMatch[]): LegacyBrandStoreLocationView[] {
    return matches.map((match) => match.content);
  }

  /**
   * Get businesses opened in a specific date range
   * @param after Unix timestamp or date string
   * @param before Unix timestamp or date string
   * @param query Optional search query
   * @param options Additional search parameters
   * @returns Promise<SearchMatch[]> Array of businesses opened in date range
   */
  async byOpenDate(
    after?: string | number,
    before?: string | number,
    query?: string,
    options?: Omit<
      SearchRequest,
      "query" | "open_date_after" | "open_date_before"
    >
  ): Promise<SearchMatch[]> {
    const afterTimestamp = after
      ? typeof after === "number"
        ? after.toString()
        : after
      : undefined;
    const beforeTimestamp = before
      ? typeof before === "number"
        ? before.toString()
        : before
      : undefined;

    const response = (await this.search({
      query,
      open_date_after: afterTimestamp,
      open_date_before: beforeTimestamp,
      ...options,
    })) as SearchResponse;
    return response;
  }
}
