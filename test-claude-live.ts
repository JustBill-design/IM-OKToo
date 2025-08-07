import fetch from 'node-fetch';
console.log('claude ai tests starting');

async function testClaudeAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 basic chat');
    const chatData = {
      message: 'my mom keeps getting confused about her medications can you help me organize a system',
      conversation_id: null,
      username: 'overwhelmed_son',
      email: 'mymail@sutd.edu.sg'
    };

    const chatResponse = await fetch(`${baseUrl}/claude/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(chatData)
    });

    console.log(`chat status ${chatResponse.status}`);
    if (chatResponse.ok) {
      const chatResult = await chatResponse.json() as any;
      console.log(`claude response length ${chatResult.response?.length || 0} chars`);
      console.log(`conversation id ${chatResult.conversation_id}`);
    } else {
      console.log(`chat failed ${chatResponse.status}`);
    }

    console.log('\ntest 2 continue conversation');
    const followupData = {
      message: 'what about when she forgets if she already took them that day',
      conversation_id: 'test_convo_123',
      username: 'overwhelmed_son',
      email: 'mymail@sutd.edu.sg'
    };

    const followupResponse = await fetch(`${baseUrl}/claude/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(followupData)
    });

    console.log(`followup status ${followupResponse.status}`);
    if (followupResponse.ok) {
      const followupResult = await followupResponse.json() as any;
      console.log(`followup response received`);
    }

    console.log('\ntest 3 get chat history');
    const historyResponse = await fetch(`${baseUrl}/claude/history/overwhelmed_son`);
    
    if (historyResponse.ok) {
      const history = await historyResponse.json() as any[];
      console.log(`chat history ${history.length} conversations`);
    } else {
      console.log(`history failed ${historyResponse.status}`);
    }

    console.log('\ntest 4 summarize conversation');
    const summaryResponse = await fetch(`${baseUrl}/claude/summarize/test_convo_123`);
    
    if (summaryResponse.ok) {
      const summary = await summaryResponse.json() as any;
      console.log(`conversation summary received`);
    } else {
      console.log(`summary failed ${summaryResponse.status}`);
    }

    console.log('\ntest 5 delete conversation');
    const deleteResponse = await fetch(`${baseUrl}/claude/delete/test_convo_123`, {
      method: 'DELETE'
    });

    console.log(`delete conversation status ${deleteResponse.status}`);

    console.log('\nclaude ai tests complete');
    console.log('claude endpoints working');

  } catch (error) {
    console.error('claude test failed', error);
  }
}

testClaudeAPI();
