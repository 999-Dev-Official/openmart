const { OpenMart, OpenMartError } = require('../dist/index');

console.log('Testing OpenMart Client...\n');

// Test 1: Client instantiation
console.log('✓ Test 1: Client instantiation');
const client = new OpenMart({
  apiKey: 'test-api-key',
  timeout: 5000,
});
console.log('  Client created successfully');

// Test 2: Check namespaces exist
console.log('\n✓ Test 2: Namespace availability');
if (client.search) {
  console.log('  search namespace is available');
} else {
  console.error('  ❌ search namespace is missing');
  process.exit(1);
}

// Test 3: Check methods exist
console.log('\n✓ Test 3: Method availability');
const methods = [
  'products',
  'simple',
  'exact',
  'byPriceRange',
  'highRated',
  'fastShipping'
];

methods.forEach(method => {
  if (typeof client.search[method] === 'function') {
    console.log(`  ✓ search.${method} method exists`);
  } else {
    console.error(`  ❌ search.${method} method is missing`);
    process.exit(1);
  }
});

// Test 4: Configuration methods
console.log('\n✓ Test 4: Configuration methods');
client.updateApiKey('new-test-key');
console.log('  API key updated successfully');

const config = client.getConfig();
console.log('  Config retrieved:', {
  hasTimeout: config.timeout !== undefined,
  hasHeaders: config.headers !== undefined,
});

// Test 5: Error class
console.log('\n✓ Test 5: Error handling');
const error = new OpenMartError('Test error', 'TEST_CODE', 400, { detail: 'test' });
console.log('  OpenMartError created successfully');
console.log('  - Message:', error.message);
console.log('  - Code:', error.code);
console.log('  - Status:', error.statusCode);
console.log('  - Details:', error.details);

// Test 6: Type exports
console.log('\n✓ Test 6: Type exports verification');
const exports = require('../dist/index');
const expectedExports = [
  'OpenMart',
  'OpenMartError',
  'OpenMartConfig',
  'SearchRequest',
  'SearchResponse',
  'Product',
  'ProductImage',
  'PriceInfo',
  'ShippingInfo',
  'SellerInfo',
  'ProductRating',
  'ApiError'
];

let allExportsPresent = true;
expectedExports.forEach(exp => {
  if (exports[exp] !== undefined) {
    console.log(`  ✓ ${exp} is exported`);
  } else {
    console.error(`  ❌ ${exp} is not exported`);
    allExportsPresent = false;
  }
});

if (!allExportsPresent) {
  process.exit(1);
}

console.log('\n✅ All tests passed successfully!');