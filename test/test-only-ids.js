const { OpenMart } = require('../dist/index');

// Test the onlyIds method
async function testOnlyIds() {
  // Create OpenMart client
  const openmart = new OpenMart({
    apiKey: process.env.OPENMART_API_KEY || 'your-api-key-here'
  });

  console.log('Testing onlyIds method...\n');

  try {
    // Test 1: Basic search without estimate_total
    console.log('Test 1: Basic search for coffee shops (no total count)');
    const basicResults = await openmart.search.onlyIds({
      query: 'coffee shops',
      location: {
        city: 'San Francisco',
        state: 'CA',
        country: 'US'
      },
      limit: 10
    });
    
    console.log(`Found ${basicResults.length} results`);
    if (basicResults.length > 0) {
      console.log('First result:', basicResults[0]);
    }
    console.log('');

    // Test 2: Search with estimate_total
    console.log('Test 2: Search with total count estimation');
    const resultsWithCount = await openmart.search.onlyIds({
      query: 'restaurants',
      location: {
        city: 'New York',
        state: 'NY',
        country: 'US'
      },
      has_contact_info: true,
      limit: 5,
      estimate_total: true
    });
    
    if ('data' in resultsWithCount) {
      console.log(`Total matching results: ${resultsWithCount.total_count}`);
      console.log(`Retrieved ${resultsWithCount.data.length} results in this page`);
      if (resultsWithCount.data.length > 0) {
        console.log('First result:', resultsWithCount.data[0]);
      }
    }
    console.log('');

    // Test 3: Search with filters
    console.log('Test 3: Search with multiple filters');
    const filteredResults = await openmart.search.onlyIds({
      query: 'pizza',
      location: {
        coordinates: {
          latitude: 40.7128,
          longitude: -74.0060
        },
        geo_radius: 3000 // 3km radius
      },
      has_website: true,
      min_overall_rating: 4.0,
      limit: 15
    });
    
    console.log(`Found ${filteredResults.length} pizza places with websites and high ratings`);
    console.log('');

    // Test 4: Pagination test
    console.log('Test 4: Testing pagination with cursor');
    const firstPage = await openmart.search.onlyIds({
      query: 'hotels',
      limit: 3
    });
    
    if (firstPage.length > 0 && firstPage[firstPage.length - 1].cursor) {
      const secondPage = await openmart.search.onlyIds({
        query: 'hotels',
        limit: 3,
        cursor: firstPage[firstPage.length - 1].cursor
      });
      console.log(`First page: ${firstPage.length} results`);
      console.log(`Second page: ${secondPage.length} results`);
      console.log('Pagination successful!');
    } else {
      console.log('Not enough results for pagination test');
    }

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.statusCode) {
      console.error('Status code:', error.statusCode);
    }
  }
}

// Run the test
testOnlyIds();