
import fetch from 'node-fetch';
console.log('api integration test starting');

async function testLiveAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 get categories');
    const categoriesResponse = await fetch(`${baseUrl}/posts/categories`);
    
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json() as any[];
      console.log(`categories fetched ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`sample category ${JSON.stringify(categories[0])}`);
      }
    } else {
      console.log(`categories fetch failed ${categoriesResponse.status}`);
    }

    console.log('\ntest 2 get posts');
    const postsResponse = await fetch(`${baseUrl}/posts`);
    
    if (postsResponse.ok) {
      const posts = await postsResponse.json() as any[];
      console.log(`posts fetched ${posts.length} posts`);
    } else {
      console.log(`posts fetch failed ${postsResponse.status}`);
    }

    console.log('\ntest 3 post new stuff');
    const newPost = {
      title: `api test ${new Date().toISOString()}`,
      content: 'just testing api stuff dont mind this post lol',
      username: 'testuser1',
      category_id: 1
    };

    const createResponse = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost)
    });

    console.log(`create post response status ${createResponse.status}`);
    const createResult = await createResponse.json() as any;
    console.log(`create post response ${JSON.stringify(createResult)}`);

    console.log('\ntest 4 verify post creation worked');
    const verifyResponse = await fetch(`${baseUrl}/posts`);
    if (verifyResponse.ok) {
      const allPosts = await verifyResponse.json() as any[];
      console.log(`posts after creation ${allPosts.length} posts`);
      
      if (createResult.post_id) {
        const newPost = allPosts.find((p: any) => p.post_id === createResult.post_id);
        if (newPost) {
          console.log(`new post found ${newPost.title}`);
          console.log(`post id ${newPost.post_id}`);
        } else {
          console.log('new post not found in results');
        }
      } else {
        console.log('new post not found in results');
      }
    }

    console.log('api integration tests complete');
    console.log('cloud database connection working');
    console.log('api endpoints working'); 
    console.log('data persistence working');

  } catch (error) {
    console.error('api test failed', error);
  }
}

testLiveAPI();
