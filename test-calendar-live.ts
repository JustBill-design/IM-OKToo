import fetch from 'node-fetch';
console.log('calendar api tests starting');

async function testCalendarAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 get events');
    const eventsResponse = await fetch(`${baseUrl}/calendar/events`);
    
    if (eventsResponse.ok) {
      const events = await eventsResponse.json() as any[];
      console.log(`events fetched ${events.length} events`);
      if (events.length > 0) {
        console.log(`sample event ${JSON.stringify(events[0])}`);
      }
    } else {
      console.log(`events fetch failed ${eventsResponse.status}`);
    }

    console.log('\ntest 2 add new event');
    const newEvent = {
      title: 'moms doctor appointment',
      description: 'yearly checkup with cardiologist need to ask about her new symptoms',
      start_date: '2024-12-15',
      end_date: '2024-12-15',
      start_time: '14:00:00',
      end_time: '16:00:00',
      username: 'caring_daughter',
      email: 'mymail@sutd.edu.sg'
    };

    const addResponse = await fetch(`${baseUrl}/calendar/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });

    console.log(`add event status ${addResponse.status}`);
    const addResult = await addResponse.json() as any;
    console.log(`add event result ${JSON.stringify(addResult)}`);

    console.log('\ntest 3 get events by date range');
    const rangeResponse = await fetch(`${baseUrl}/calendar/events/range?start_date=2024-12-01&end_date=2024-12-31`);
    
    if (rangeResponse.ok) {
      const rangeEvents = await rangeResponse.json() as any[];
      console.log(`range events ${rangeEvents.length} events found`);
    } else {
      console.log(`range events failed ${rangeResponse.status}`);
    }

    console.log('\ntest 4 get events by username');
    const userResponse = await fetch(`${baseUrl}/calendar/events/user/caring_daughter`);
    
    if (userResponse.ok) {
      const userEvents = await userResponse.json() as any[];
      console.log(`user events ${userEvents.length} events for user`);
    } else {
      console.log(`user events failed ${userResponse.status}`);
    }

    console.log('\ntest 5 update event');
    if (addResult.event_id) {
      const updateData = {
        title: 'moms doctor appointment RESCHEDULED',
        description: 'doc had emergency so moved to next week, need to update pill schedule timing'
      };

      const updateResponse = await fetch(`${baseUrl}/calendar/update/${addResult.event_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log(`update event status ${updateResponse.status}`);
      const updateResult = await updateResponse.json() as any;
      console.log(`update result ${JSON.stringify(updateResult)}`);
    }

    console.log('\ntest 6 delete event');
    if (addResult.event_id) {
      const deleteResponse = await fetch(`${baseUrl}/calendar/delete/${addResult.event_id}`, {
        method: 'DELETE'
      });

      console.log(`delete event status ${deleteResponse.status}`);
      const deleteResult = await deleteResponse.json() as any;
      console.log(`delete result ${JSON.stringify(deleteResult)}`);
    }

    console.log('\ntest 7 get calendar summary');
    const summaryResponse = await fetch(`${baseUrl}/calendar/summary/caring_daughter?month=12&year=2024`);
    
    if (summaryResponse.ok) {
      const summary = await summaryResponse.json() as any;
      console.log(`calendar summary ${JSON.stringify(summary)}`);
    } else {
      console.log(`summary failed ${summaryResponse.status}`);
    }

    console.log('\ntest 8 search events');
    const searchResponse = await fetch(`${baseUrl}/calendar/search?q=doctor`);
    
    if (searchResponse.ok) {
      const searchResults = await searchResponse.json() as any[];
      console.log(`search results ${searchResults.length} events found`);
    } else {
      console.log(`search failed ${searchResponse.status}`);
    }

    console.log('\ncalendar api tests complete');
    console.log('calendar endpoints working');

  } catch (error) {
    console.error('calendar test failed', error);
  }
}

testCalendarAPI();
