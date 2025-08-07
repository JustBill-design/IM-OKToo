import fetch from 'node-fetch';
console.log('performance security tests starting');

async function testPerformanceAndSecurity() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\nperf test 1 response time check');
    const startTime = Date.now();
    const perfResponse = await fetch(`${baseUrl}/posts`);
    const endTime = Date.now();
    
    console.log(`get posts response time ${endTime - startTime}ms`);
    console.log(`performance ${endTime - startTime < 1000 ? 'good' : 'slow'}`);

    console.log('\nperf test 2 large dataset handling');
    const largeResponse = await fetch(`${baseUrl}/posts?limit=1000`);
    const largeStartTime = Date.now();
    const largeData = await largeResponse.json();
    const largeEndTime = Date.now();
    
    console.log(`large dataset time ${largeEndTime - largeStartTime}ms`);
    console.log(`large data count ${Array.isArray(largeData) ? largeData.length : 'invalid'}`);

    console.log('\nsecurity test 1 xss attempt');
    const xssPost = {
      title: '<script>alert("xss")</script>',
      content: '<img src="x" onerror="alert(1)">',
      username: 'hacker123',
      category_id: 1
    };

    const xssResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(xssPost)
    });

    console.log(`xss test status ${xssResponse.status}`);
    if (xssResponse.ok) {
      const xssResult = await xssResponse.json();
      console.log(`xss filtering ${xssResult.title?.includes('<script>') ? 'failed' : 'working'}`);
    }

    console.log('\nsecurity test 2 rate limiting check');
    const rateLimitPromises = [];
    for (let i = 0; i < 20; i++) {
      rateLimitPromises.push(fetch(`${baseUrl}/posts`));
    }

    const rateLimitResults = await Promise.all(rateLimitPromises);
    const blockedRequests = rateLimitResults.filter(r => r.status === 429).length;
    console.log(`rate limiting ${blockedRequests > 0 ? 'active' : 'not detected'} (${blockedRequests}/20 blocked)`);

    console.log('\nsecurity test 3 auth bypass attempt');
    const authBypassResponse = await fetch(`${baseUrl}/login/profile/admin`, {
      headers: { 'Authorization': 'Bearer fake_token' }
    });

    console.log(`auth bypass status ${authBypassResponse.status}`);
    console.log(`auth protection ${authBypassResponse.status === 401 ? 'working' : 'vulnerable'}`);

    console.log('\nperf test 3 memory usage simulation');
    const memoryPromises = [];
    for (let i = 0; i < 50; i++) {
      const post = {
        title: `memory test post ${i}`,
        content: 'x'.repeat(1000),
        username: `memory_user_${i}`,
        category_id: 1
      };
      
      memoryPromises.push(fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
      }));
    }

    const memoryStartTime = Date.now();
    const memoryResults = await Promise.all(memoryPromises);
    const memoryEndTime = Date.now();
    
    console.log(`bulk operations time ${memoryEndTime - memoryStartTime}ms`);
    console.log(`bulk success rate ${memoryResults.filter(r => r.ok).length}/${memoryResults.length}`);

    console.log('\nsecurity test 4 input validation');
    const validationTests = [
      { username: null, expected: 'reject' },
      { username: undefined, expected: 'reject' },
      { username: '', expected: 'reject' },
      { username: 'a'.repeat(500), expected: 'reject' },
      { category_id: -1, expected: 'reject' },
      { category_id: 999999, expected: 'reject' }
    ];

    for (const test of validationTests) {
      const testPost = {
        title: 'validation test',
        content: 'testing input validation',
        username: test.username || 'valid_user',
        category_id: test.category_id || 1
      };

      const validationResponse = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPost)
      });

      const validationPassed = test.expected === 'reject' ? !validationResponse.ok : validationResponse.ok;
      console.log(`validation test ${JSON.stringify(test)} ${validationPassed ? 'passed' : 'failed'}`);
    }

    console.log('\nperformance security tests complete');
    console.log('security validation done');
    console.log('performance benchmarks recorded');

  } catch (error) {
    console.error('performance security test failed', error);
  }
}

testPerformanceAndSecurity();
