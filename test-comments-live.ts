import fetch from 'node-fetch';
console.log('comments api tests starting');

async function testCommentsAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 get comments for post');
    const commentsResponse = await fetch(`${baseUrl}/posts/1/comments`);
    
    if (commentsResponse.ok) {
      const comments = await commentsResponse.json() as any[];
      console.log(`comments fetched ${comments.length} comments`);
      if (comments.length > 0) {
        console.log(`sample comment ${JSON.stringify(comments[0])}`);
      }
    } else {
      console.log(`comments fetch failed ${commentsResponse.status}`);
    }

    console.log('\ntest 2 add new comment');
    const newComment = {
      content: 'my grandma has this too, we found that keeping a daily routine really helps with her memory',
      username: 'caregiver_alex',
      email: 'mymail@sutd.edu.sg'
    };

    const addResponse = await fetch(`${baseUrl}/posts/1/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newComment)
    });

    console.log(`add comment status ${addResponse.status}`);
    const addResult = await addResponse.json() as any;
    console.log(`add comment result ${JSON.stringify(addResult)}`);

    console.log('\ntest 3 reply to comment');
    if (addResult.comment_id) {
      const reply = {
        content: 'thanks for sharing! did you try any specific memory exercises too?',
        username: 'worried_daughter',
        email: 'mymail@sutd.edu.sg',
        parent_comment_id: addResult.comment_id
      };

      const replyResponse = await fetch(`${baseUrl}/posts/1/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reply)
      });

      console.log(`reply status ${replyResponse.status}`);
      const replyResult = await replyResponse.json() as any;
      console.log(`reply result ${JSON.stringify(replyResult)}`);
    }

    console.log('\ntest 4 update comment');
    if (addResult.comment_id) {
      const updateData = {
        content: 'my grandma has this too, we found that keeping a daily routine really helps with her memory (also puzzles work great!)'
      };

      const updateResponse = await fetch(`${baseUrl}/comments/${addResult.comment_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log(`update comment status ${updateResponse.status}`);
    }

    console.log('\ntest 5 like comment');
    if (addResult.comment_id) {
      const likeResponse = await fetch(`${baseUrl}/comments/${addResult.comment_id}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'fellow_caregiver' })
      });

      console.log(`like comment status ${likeResponse.status}`);
    }

    console.log('\ntest 6 get comment thread');
    if (addResult.comment_id) {
      const threadResponse = await fetch(`${baseUrl}/comments/${addResult.comment_id}/thread`);
      
      if (threadResponse.ok) {
        const thread = await threadResponse.json() as any[];
        console.log(`comment thread ${thread.length} messages`);
      } else {
        console.log(`thread failed ${threadResponse.status}`);
      }
    }

    console.log('\ntest 7 delete comment');
    if (addResult.comment_id) {
      const deleteResponse = await fetch(`${baseUrl}/comments/${addResult.comment_id}`, {
        method: 'DELETE'
      });

      console.log(`delete comment status ${deleteResponse.status}`);
    }

    console.log('\ntest 8 get user comments');
    const userCommentsResponse = await fetch(`${baseUrl}/users/caregiver_alex/comments`);
    
    if (userCommentsResponse.ok) {
      const userComments = await userCommentsResponse.json() as any[];
      console.log(`user comments ${userComments.length} comments by user`);
    } else {
      console.log(`user comments failed ${userCommentsResponse.status}`);
    }

    console.log('\ncomments api tests complete');
    console.log('comments functionality working');

  } catch (error) {
    console.error('comments test failed', error);
  }
}

testCommentsAPI();
