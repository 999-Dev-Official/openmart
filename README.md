# OpenMart TypeScript Client

A TypeScript client library for the OpenMart API, providing easy access to product search and marketplace functionality.

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

// Search for products
const results = await openmart.search.products({
  query: "laptop",
  num: 10,
  min_price: 500,
  max_price: 1500,
});

console.log(results.products);
```

## Features

- 🔍 **Product Search**: Comprehensive search with multiple filter options
- 🎯 **Type Safety**: Full TypeScript support with detailed type definitions
- ⚡ **Convenience Methods**: Simplified methods for common search patterns
- 🛡️ **Error Handling**: Robust error handling with detailed error messages
- 🔧 **Configurable**: Customizable timeouts, headers, and base URL

## API Reference

### Client Initialization

```typescript
const openmart = new OpenMart({
  apiKey: "your-api-key", // Required: Your OpenMart API key
  headers: {
    // Optional: Additional headers
    "X-Custom-Header": "value",
  },
});
```

### Search Methods

#### `search.products(request)`

Full product search with all available filters.

```typescript
const results = await openmart.search.products({
  query: "wireless headphones",
  exact_match: false,
  num: 20,
  min_quantity: 10,
  min_seller_rating: 4.0,
  min_product_rating: 3.5,
  max_shipping_days: 7,
  min_price: 50,
  max_price: 200,
});
```

#### `search.simple(query, options?)`

Simplified search that returns just the products array.

```typescript
const products = await openmart.search.simple("bluetooth speaker", {
  num: 5,
  min_product_rating: 4,
});
```

#### `search.exact(query, options?)`

Search for exact product matches.

```typescript
const products = await openmart.search.exact("Apple AirPods Pro");
```

#### `search.byPriceRange(query, minPrice?, maxPrice?, options?)`

Search within a specific price range.

```typescript
const products = await openmart.search.byPriceRange(
  "tablet",
  200, // min price
  800, // max price
  { num: 10 }
);
```

#### `search.highRated(query, minRating?, options?)`

Search for highly-rated products.

```typescript
const products = await openmart.search.highRated("coffee maker", 4.5);
```

#### `search.fastShipping(query, maxDays?, options?)`

Search for products with fast shipping.

```typescript
const products = await openmart.search.fastShipping("phone case", 3);
```

## Response Types

### Product

```typescript
interface Product {
  title: string;
  description?: string;
  url: string;
  images?: ProductImage[];
  price?: PriceInfo;
  moq?: number; // Minimum order quantity
  in_stock?: boolean;
  shipping?: ShippingInfo;
  seller?: SellerInfo;
  rating?: ProductRating;
  specifications?: Record<string, any>;
  category?: string[];
  sku?: string;
  brand?: string;
}
```

### SearchResponse

```typescript
interface SearchResponse {
  products: Product[];
  total_results?: number;
  query_id?: string;
  processing_time_ms?: number;
}
```

## Error Handling

The client provides detailed error information through the `OpenMartError` class:

```typescript
try {
  const results = await openmart.search.products({ query: "laptop" });
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
import { OpenMart } from "@openmart";

const openmart = new OpenMart({
  apiKey: process.env.OPENMART_API_KEY!,
});

async function searchProducts() {
  try {
    // Search for electronics with specific criteria
    const results = await openmart.search.products({
      query: "smartphone",
      num: 20,
      min_seller_rating: 4.0,
      min_product_rating: 3.5,
      max_shipping_days: 5,
      min_price: 200,
      max_price: 800,
    });

    console.log(`Found ${results.products.length} products`);
    console.log(`Total results: ${results.total_results}`);
    console.log(`Processing time: ${results.processing_time_ms}ms`);

    // Display products
    results.products.forEach((product) => {
      console.log(`- ${product.title}`);
      console.log(`  Price: $${product.price?.amount}`);
      console.log(
        `  Rating: ${product.rating?.rating} (${product.rating?.ratings_count} reviews)`
      );
      console.log(`  Seller: ${product.seller?.name}`);
      console.log(`  URL: ${product.url}`);
      console.log("---");
    });
  } catch (error) {
    console.error("Search failed:", error);
  }
}

searchProducts();
```

### Batch Search Operations

```typescript
async function batchSearch() {
  const searches = [
    openmart.search.highRated("laptop", 4.5),
    openmart.search.fastShipping("monitor", 3),
    openmart.search.byPriceRange("keyboard", 50, 150),
  ];

  const [laptops, monitors, keyboards] = await Promise.all(searches);

  console.log(`High-rated laptops: ${laptops.length}`);
  console.log(`Fast-shipping monitors: ${monitors.length}`);
  console.log(`Keyboards in price range: ${keyboards.length}`);
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

## Support

For issues, questions, or suggestions, please visit our [GitHub repository](https://github.com/999-Dev-Official/openmart).
