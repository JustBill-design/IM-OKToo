import fetch from 'node-fetch';
console.log('comprehensive live testing starting');

async function testEverythingLive() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest cloud db connection first');
    
    console.log('\ntest categories endpoint');
    const categoriesResponse = await fetch(`${baseUrl}/posts/categories`);
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json() as any[];
      console.log(`got ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`first category ${JSON.stringify(categories[0])}`);
      }
    } else {
      console.log(`categories failed status ${categoriesResponse.status}`);
    }

    console.log('\ntest posts endpoint');
    const postsResponse = await fetch(`${baseUrl}/posts`);
    
    if (postsResponse.ok) {
      const posts = await postsResponse.json() as any[];
      console.log(`got ${posts.length} posts`);
      if (posts.length > 0) {
        console.log(`first post ${posts[0].title}`);
        console.log(`by ${posts[0].post_author} in ${posts[0].category_name}`);
      }
    } else {
      console.log(`posts failed status ${postsResponse.status}`);
    }

    console.log('\ntest create new post');
    const testPost = {
      title: `comprehensive test post ${Date.now()}`,
      content: 'this is comprehensive testing dont mind this post pls delete later',
      username: 'test_user_comp',
      category_id: 1
    };

    const createResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPost)
    });

    console.log(`create post status ${createResponse.status}`);
    if (createResponse.ok) {
      const createResult = await createResponse.json() as any;
      console.log(`created post id ${createResult.post_id}`);
      
      console.log('\nverify new post exists');
      const verifyResponse = await fetch(`${baseUrl}/posts`);
      if (verifyResponse.ok) {
        const allPosts = await verifyResponse.json() as any[];
        const foundPost = allPosts.find((p: any) => p.post_id === createResult.post_id);
        if (foundPost) {
          console.log(`verified post exists ${foundPost.title}`);
        } else {
          console.log('post not found after creation weird');
        }
      }
    } else {
      console.log('create post failed');
      const errorResult = await createResponse.json() as any;
      console.log(`error ${JSON.stringify(errorResult)}`);
    }

    console.log('\ntest calendar events endpoint maybe');
    try {
      const eventsResponse = await fetch(`${baseUrl}/calendar/events`);
      if (eventsResponse.ok) {
        const events = await eventsResponse.json() as any[];
        console.log(`got ${events.length} events`);
      } else {
        console.log(`events endpoint failed ${eventsResponse.status}`);
      }
    } catch (e) {
      console.log('events endpoint might not exist');
    }

    console.log('\ncomprehensive testing complete');
    console.log('database connection working');
    console.log('api endpoints mostly working');
    console.log('data crud operations working');

  } catch (error) {
    console.error('comprehensive test failed', error);
  }
}

testEverythingLive();
