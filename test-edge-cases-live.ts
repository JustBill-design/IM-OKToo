import fetch from 'node-fetch';
console.log('edge case tests starting');

async function testEdgeCases() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\nedge test 1 invalid post data');
    const invalidPost = {
      title: '',
      content: null,
      username: '',
      category_id: 'not_a_number'
    };

    const invalidResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(invalidPost)
    });

    console.log(`invalid post status ${invalidResponse.status}`);
    const invalidResult = await invalidResponse.json().catch(() => ({}));
    console.log(`error handling ${invalidResult.error ? 'working' : 'missing'}`);

    console.log('\nedge test 2 sql injection attempt');
    const sqlInjection = {
      title: "'; DROP TABLE posts; --",
      content: 'trying to hack the database lol',
      username: "admin'; --",
      category_id: 1
    };

    const sqlResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sqlInjection)
    });

    console.log(`sql injection test status ${sqlResponse.status}`);
    
    console.log('\nedge test 3 extremely long content');
    const longContent = 'a'.repeat(10000);
    const longPost = {
      title: 'really really long post',
      content: longContent,
      username: 'spam_user',
      category_id: 1
    };

    const longResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(longPost)
    });

    console.log(`long content status ${longResponse.status}`);

    console.log('\nedge test 4 missing required fields');
    const missingFields = {
      title: 'incomplete post'
    };

    const missingResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(missingFields)
    });

    console.log(`missing fields status ${missingResponse.status}`);

    console.log('\nedge test 5 malformed json');
    const malformedResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not valid json at all'
    });

    console.log(`malformed json status ${malformedResponse.status}`);

    console.log('\nedge test 6 nonexistent endpoints');
    const notFoundResponse = await fetch(`${baseUrl}/posts/nonexistent`);
    console.log(`404 test status ${notFoundResponse.status}`);

    console.log('\nedge test 7 wrong http methods');
    const wrongMethodResponse = await fetch(`${baseUrl}/posts`, {
      method: 'DELETE'
    });
    console.log(`wrong method status ${wrongMethodResponse.status}`);

    console.log('\nedge test 8 unicode and special chars');
    const unicodePost = {
      title: '💩💩💩💩🚀💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩💩 testing unicode chars 中文 emoji -1 null NULL',
      content: 'special chars: <>?:"{}|\\`~!@#$%^&*()_+-=[]',
      username: 'unicode_tester',
      category_id: 1
    };

    const unicodeResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unicodePost)
    });

    console.log(`unicode test status ${unicodeResponse.status}`);

    console.log('\nedge test 9 concurrent requests');
    const promises = [];
    for (let i = 0; i < 5; i++) {
      const post = {
        title: `concurrent post ${i}`,
        content: 'testing concurrent requests',
        username: `user_${i}`,
        category_id: 1
      };
      
      promises.push(fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      }));
    }

    const results = await Promise.all(promises);
    console.log(`concurrent requests ${results.filter(r => r.ok).length}/${results.length} successful`);

    console.log('\nedge test 10 database connection failure simulation');
    console.log('note this test requires manual db disconnection');

    console.log('\nedge case tests complete');
    console.log('error handling validation done');

  } catch (error) {
    console.error('edge case test failed', error);
  }
}

testEdgeCases();
