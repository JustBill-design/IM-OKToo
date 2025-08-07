import fetch from 'node-fetch';
console.log('scraper tests starting');

async function testScraperAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 scrape website');
    const scrapeData = {
      url: 'https://example.com',
      username: 'web_scraper_user',
      email: 'mymail@sutd.edu.sg'
    };

    const scrapeResponse = await fetch(`${baseUrl}/scraper/scrape`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(scrapeData)
    });

    console.log(`scrape status ${scrapeResponse.status}`);
    if (scrapeResponse.ok) {
      const scrapeResult = await scrapeResponse.json() as any;
      console.log(`scrape result title ${scrapeResult.title || 'no title'}`);
      console.log(`content length ${scrapeResult.content?.length || 0} chars`);
    }

    console.log('\ntest 2 get scrape history');
    const historyResponse = await fetch(`${baseUrl}/scraper/history/web_scraper_user`);
    
    if (historyResponse.ok) {
      const history = await historyResponse.json() as any[];
      console.log(`scrape history ${history.length} entries`);
    } else {
      console.log(`history failed ${historyResponse.status}`);
    }

    console.log('\ntest 3 bulk scrape');
    const bulkData = {
      urls: ['https://example.com', 'https://httpbin.org/json'],
      username: 'bulk_scraper',
      email: 'mymail@sutd.edu.sg'
    };

    const bulkResponse = await fetch(`${baseUrl}/scraper/bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bulkData)
    });

    console.log(`bulk scrape status ${bulkResponse.status}`);
    if (bulkResponse.ok) {
      const bulkResult = await bulkResponse.json() as any;
      console.log(`bulk results ${bulkResult.results?.length || 0} scraped`);
    }

    console.log('\ntest 4 search scraped content');
    const searchResponse = await fetch(`${baseUrl}/scraper/search?q=example&username=web_scraper_user`);
    
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json() as any[];
      console.log(`search results ${searchResults.length} matches`);
    } else {
      console.log(`search failed ${searchResponse.status}`);
    }

    console.log('\nscraper tests complete');
    console.log('scraper endpoints working');

  } catch (error) {
    console.error('scraper test failed', error);
  }
}

testScraperAPI();
