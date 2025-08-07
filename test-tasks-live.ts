import fetch from 'node-fetch';
console.log('tasks api tests starting');

async function testTasksAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 get all tasks');
    const tasksResponse = await fetch(`${baseUrl}/tasks`);
    
    if (tasksResponse.ok) {
      const tasks = await tasksResponse.json() as any[];
      console.log(`tasks fetched ${tasks.length} tasks`);
      if (tasks.length > 0) {
        console.log(`sample task ${JSON.stringify(tasks[0])}`);
      }
    } else {
      console.log(`tasks fetch failed ${tasksResponse.status}`);
    }

    console.log('\ntest 2 add new task');
    const newTask = {
      title: 'refill grandpas blood pressure medication',
      description: 'pharmacy closes at 6pm today need to pick up before then or he runs out tomorrow',
      due_date: '2024-12-20',
      priority: 'high',
      status: 'pending',
      username: 'busy_grandson',
      email: 'mymail@sutd.edu.sg'
    };

    const addResponse = await fetch(`${baseUrl}/tasks/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });

    console.log(`add task status ${addResponse.status}`);
    const addResult = await addResponse.json() as any;
    console.log(`add task result ${JSON.stringify(addResult)}`);

    console.log('\ntest 3 get tasks by user');
    const userResponse = await fetch(`${baseUrl}/tasks/user/busy_grandson`);
    
    if (userResponse.ok) {
      const userTasks = await userResponse.json() as any[];
      console.log(`user tasks ${userTasks.length} tasks found`);
    } else {
      console.log(`user tasks failed ${userResponse.status}`);
    }

    console.log('\ntest 4 update task status');
    if (addResult.task_id) {
      const updateData = {
        status: 'in_progress',
        progress_notes: 'called pharmacy they have it ready just need to drive over there'
      };

      const updateResponse = await fetch(`${baseUrl}/tasks/update/${addResult.task_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log(`update task status ${updateResponse.status}`);
      const updateResult = await updateResponse.json() as any;
      console.log(`update result ${JSON.stringify(updateResult)}`);
    }

    console.log('\ntest 5 mark task complete');
    if (addResult.task_id) {
      const completeResponse = await fetch(`${baseUrl}/tasks/complete/${addResult.task_id}`, {
        method: 'PUT'
      });

      console.log(`complete task status ${completeResponse.status}`);
      const completeResult = await completeResponse.json() as any;
      console.log(`complete result ${JSON.stringify(completeResult)}`);
    }

    console.log('\ntest 6 get tasks by priority');
    const priorityResponse = await fetch(`${baseUrl}/tasks/priority/high`);
    
    if (priorityResponse.ok) {
      const priorityTasks = await priorityResponse.json() as any[];
      console.log(`high priority tasks ${priorityTasks.length} tasks`);
    } else {
      console.log(`priority tasks failed ${priorityResponse.status}`);
    }

    console.log('\ntest 7 delete task');
    if (addResult.task_id) {
      const deleteResponse = await fetch(`${baseUrl}/tasks/delete/${addResult.task_id}`, {
        method: 'DELETE'
      });

      console.log(`delete task status ${deleteResponse.status}`);
      const deleteResult = await deleteResponse.json() as any;
      console.log(`delete result ${JSON.stringify(deleteResult)}`);
    }

    console.log('\ntasks api tests complete');
    console.log('tasks endpoints working');

  } catch (error) {
    console.error('tasks test failed', error);
  }
}

testTasksAPI();
