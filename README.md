# OpenMart TypeScript Client

A TypeScript client library for the OpenMart API, providing easy access to business lead search and marketplace functionality.

## Installation

```bash
npm install openmart
# or
yarn add openmart
# or
pnpm add openmart
```

## Quick Start

```typescript
import { OpenMart } from "openmart";

// Initialize the client
const openmart = new OpenMart({
  apiKey: "your-api-key-here",
});

// Search for business leads
const results = await openmart.search.query({
  query: "coffee shops",
  location: {
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    geo_radius: 5000,
  },
  limit: 50,
});

console.log(results);
```

## Features

- 🔍 **Business Lead Search**: Comprehensive search with multiple filter options
- 🎯 **Type Safety**: Full TypeScript support with detailed type definitions
- 📍 **Location-Based Search**: Search by coordinates, radius, and geographic areas
- 🛡️ **Error Handling**: Robust error handling with detailed error messages
- 🔧 **Configurable**: Customizable timeouts, headers, and base URL

## API Reference

### Client Initialization

```typescript
const openmart = new OpenMart({
  apiKey: "your-api-key", // Required: Your OpenMart API key
});
```

### Search Methods

#### `search.query(request)`

The main search method that accepts all available parameters for finding business leads.

```typescript
const results = await openmart.search.query({
  // Basic search
  query: "restaurants",
  limit: 50, // Max 500 per request
  cursor: undefined, // For pagination - use the cursor from the last item of previous results

  // Location filters
  location: {
    coordinates: { latitude: 37.7749, longitude: -122.4194 },
    geo_radius: 5000, // In meters
  },

  // Business filters
  has_contact_info: true,
  has_website: true,
  has_valid_website: true,
  store_name: "Starbucks",

  // Review and rating filters
  min_total_reviews: 10,
  min_overall_rating: 4.0,

  // Business characteristics
  ownership_type: "FRANCHISE",
  min_price_tier: 2,
  max_price_tier: 4,

  // Keyword filters
  include_keywords: ["organic", "vegan"],
  exclude_keywords: ["fast food"],

  // Date filters (Unix timestamps)
  info_updated_after: "1672531200",
  open_date_after: "1640995200",
  open_date_before: "1672531200",

  // Count estimation
  estimate_total: false, // Set to true to get total count
});
```

#### `search.onlyIds(request)`

A more efficient method that returns only the IDs and metadata of matching businesses, without the full business data. This is useful when you need to quickly get identifiers for further processing or when you want to check the number of matching results.

```typescript
const idResults = await openmart.search.onlyIds({
  // Same parameters as search.query()
  query: "coffee shops",
  location: {
    city: "San Francisco",
    state: "CA",
  },
  has_contact_info: true,
  limit: 100, // Max 1000 per request for onlyIds
  estimate_total: true, // Get total count of matching results
});

// Response with estimate_total: true
if ("data" in idResults) {
  console.log(`Found ${idResults.total_count} total matches`);
  idResults.data.forEach((result) => {
    console.log(
      `ID: ${result.id}, Place ID: ${result.place_id}, Score: ${result.match_score}`
    );
  });
} else {
  // Response with estimate_total: false (default)
  idResults.forEach((result) => {
    console.log(
      `ID: ${result.id}, Place ID: ${result.place_id}, Score: ${result.match_score}`
    );
  });
}
```

### Manual Pagination

To paginate through results, use the cursor from the last item of each response:

```typescript
let cursor = undefined;
let allResults = [];

// Get first page
let response = await openmart.search.query({
  query: "restaurants",
  limit: 100,
  cursor: cursor,
});
allResults.push(...response);

// Continue fetching while there are more results
while (response.length === 100 && response[response.length - 1]?.cursor) {
  cursor = response[response.length - 1].cursor;
  response = await openmart.search.query({
    query: "restaurants",
    limit: 100,
    cursor: cursor,
  });
  allResults.push(...response);
}

console.log(`Total results fetched: ${allResults.length}`);
```

## Response Types

### SearchMatch

```typescript
interface SearchMatch {
  cursor?: any;
  content: LegacyBrandStoreLocationView;
}
```

### LegacyBrandStoreLocationView

```typescript
interface LegacyBrandStoreLocationView {
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
  store_name: string;
  store_emails: string[];
  store_phones: string[];
  store_address?: string | null;
  store_city?: string | null;
  store_state?: string | null;
  store_zipcode?: string | null;
  store_country?: string | null;
  coordinates?: Coordinates | null;
  overall_rating?: number | null;
  total_reviews?: number | null;
  price_range?: StorePriceRange | null;
  store_hours?: Record<string, any> | null;
  features?: Record<string, any> | null;
  // ... and more fields
}
```

### SearchResponseWithCount

When `estimate_total` is set to true:

```typescript
interface SearchResponseWithCount {
  results: SearchMatch[];
  total_count: number;
}
```

## Error Handling

The client provides detailed error information through the `OpenMartError` class:

```typescript
try {
  const results = await openmart.search.query({ query: "restaurants" });
} catch (error) {
  if (error instanceof OpenMartError) {
    console.error("Error code:", error.code);
    console.error("Status code:", error.statusCode);
    console.error("Message:", error.message);
    console.error("Details:", error.details);
  }
}
```

## Advanced Usage

### Updating API Key

```typescript
openmart.updateApiKey("new-api-key");
```

## Examples

### Search with Multiple Filters

```typescript
import { OpenMart } from "openmart";

const openmart = new OpenMart({
  apiKey: process.env.OPENMART_API_KEY!,
});

async function searchBusinesses() {
  try {
    // Search for high-rated restaurants with contact info
    const results = await openmart.search.query({
      query: "italian restaurants",
      location: {
        coordinates: { latitude: 40.7128, longitude: -74.006 },
        geo_radius: 10000, // 10km radius
      },
      has_contact_info: true,
      has_website: true,
      min_overall_rating: 4.0,
      min_total_reviews: 50,
      limit: 100,
    });

    // Process results
    if (Array.isArray(results)) {
      console.log(`Found ${results.length} businesses`);

      results.forEach((match) => {
        const business = match.content;
        console.log(`- ${business.business_name || business.store_name}`);
        console.log(
          `  Rating: ${business.overall_rating} (${business.total_reviews} reviews)`
        );
        console.log(
          `  Address: ${business.store_address}, ${business.store_city}, ${business.store_state}`
        );
        console.log(`  Website: ${business.website_url}`);
        console.log(`  Phone: ${business.store_phones.join(", ")}`);
        console.log("---");
      });
    }
  } catch (error) {
    console.error("Search failed:", error);
  }
}

searchBusinesses();
```

### Location-Based Search

```typescript
async function searchNearby() {
  // Search for businesses near a specific location
  const results = await openmart.search.query({
    query: "auto repair shops",
    location: {
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437,
      },
      geo_radius: 5000, // 5km radius
    },
    has_contact_info: true,
    limit: 50,
  });

  // Extract just the business data using map
  const businesses = (results as SearchMatch[]).map((match) => match.content);

  businesses.forEach((business) => {
    const distance = calculateDistance(
      34.0522,
      -118.2437,
      business.coordinates?.latitude || 0,
      business.coordinates?.longitude || 0
    );
    console.log(`${business.store_name} - ${distance.toFixed(1)}km away`);
  });
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Cleaning

```bash
npm run clean
```

## License

MIT
