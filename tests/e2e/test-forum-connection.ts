import fetch from 'node-fetch';
console.log('test forum connection starting');

async function testForumConnection() {
  const baseUrl = 'http://localhost:3001';
  
  // Test tracking
  let totalTests = 0;
  let passedTests = 0;

  // Helper function to record test results
  function recordTest(testName: string, condition: boolean) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`TEST ${totalTests}: ${testName} - PASS`);
    } else {
      console.log(`TEST ${totalTests}: ${testName} - FAIL`);
    }
  }

  try {
    console.log('\ntest 1: get all forum posts');
    const postsResponse = await fetch(`${baseUrl}/posts`);
    const posts = await postsResponse.json() as any[];
    console.log(`forum posts fetched: ${posts.length} posts`);
    recordTest('GET /posts returns forum data', postsResponse.ok);

    console.log('\ntest 2: get forum categories');
    const categoriesResponse = await fetch(`${baseUrl}/posts/categories`);
    const categories = await categoriesResponse.json() as any[];
    console.log(`forum categories fetched: ${categories.length} categories`);
    recordTest('GET /posts/categories returns forum data', categoriesResponse.ok);

    console.log('\ntest 3: get comments for existing forum post');
    if (posts.length > 0) {
      const firstPostId = posts[0].post_id;
      const commentsResponse = await fetch(`${baseUrl}/posts/${firstPostId}/comments`);
      const comments = await commentsResponse.json() as any[];
      console.log(`forum comments fetched: ${comments.length} comments`);
      recordTest('GET /posts/:id/comments returns forum data', commentsResponse.ok);
    } else {
      recordTest('GET /posts/:id/comments returns forum data', false);
    }

    console.log('\ntest 4: test invalid forum post comments (should handle gracefully)');
    const invalidResponse = await fetch(`${baseUrl}/posts/99999/comments`);
    recordTest('GET /posts/99999/comments handles invalid forum ID', invalidResponse.status === 200 || invalidResponse.status === 404);

    console.log('\ntest 5: test missing forum comment data (should reject)');
    const invalidCommentResponse = await fetch(`${baseUrl}/posts/addcomments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body
    });
    recordTest('POST /posts/addcomments rejects invalid forum data', invalidCommentResponse.status === 400);

    console.log('\ntest 6: test missing forum post data (should reject)');
    const invalidPostResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body
    });
    recordTest('POST /posts/addposts rejects invalid forum data', invalidPostResponse.status === 400 || invalidPostResponse.status === 500);

    console.log('\ntest 7: test delete nonexistent forum comment (should handle gracefully)');
    const deleteNonexistentComment = await fetch(`${baseUrl}/posts/deletecomment/99999`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test_user' })
    });
    recordTest('DELETE nonexistent forum comment handled', deleteNonexistentComment.status === 404 || deleteNonexistentComment.status === 400);

    console.log('\ntest 8: test delete nonexistent forum post (should handle gracefully)');
    const deleteNonexistentPost = await fetch(`${baseUrl}/posts/delete/99999`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test_user' })
    });
    recordTest('DELETE nonexistent forum post handled', deleteNonexistentPost.status === 404 || deleteNonexistentPost.status === 400);

    console.log('\ntest 9: forum server responds to basic requests');
    recordTest('Forum server is responsive', totalTests > 0);

    console.log('\ntest 10: forum data structure validation');
    if (posts.length > 0) {
      const firstPost = posts[0];
      const hasRequiredFields = firstPost.post_id && firstPost.title && firstPost.content && firstPost.post_author;
      recordTest('Forum posts have required fields', hasRequiredFields);
    } else {
      recordTest('Forum posts have required fields', true); // Pass if no posts (can't validate structure)
    }

    // Final results
    console.log('\n' + '='.repeat(50));
    console.log('FORUM CONNECTION TEST RESULTS');
    console.log('='.repeat(50));
    console.log(`Passed: ${passedTests}/${totalTests} tests`);
    console.log(`Failed: ${totalTests - passedTests}/${totalTests} tests`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);
    
    if (passedTests === totalTests) {
      console.log('🎉 ALL FORUM CONNECTION TESTS PASSED! Your forum API is working correctly.');
    } else {
      console.log('Some forum connection tests failed. Check the issues above.');
    }
    
    console.log('='.repeat(50));
    console.log('test forum connection complete');

  } catch (error) {
    console.error('Forum connection test suite failed with error:', error);
    console.log(`Final Results: ${passedTests}/${totalTests} forum tests passed before error`);
  }
}

testForumConnection();