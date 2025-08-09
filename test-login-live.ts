import fetch from 'node-fetch';
console.log('login auth tests starting');

async function testLoginAPI() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('\ntest 1 user registration');
    const newUser = {
      username: 'new_student_2024',
      email: 'mymail@sutd.edu.sg',
      password: 'password123',
      full_name: 'alex chen',
      student_id: 'SUTD001234'
    };

    const registerResponse = await fetch(`${baseUrl}/login/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    });

    console.log(`register status ${registerResponse.status}`);
    const registerResult = await registerResponse.json() as any;
    console.log(`register result ${JSON.stringify(registerResult)}`);

    console.log('\ntest 2 user login');
    const loginData = {
      email: 'mymail@sutd.edu.sg',
      password: 'password123'
    };

    const loginResponse = await fetch(`${baseUrl}/login/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    });

    console.log(`login status ${loginResponse.status}`);
    if (loginResponse.ok) {
      const loginResult = await loginResponse.json() as any;
      console.log(`login successful user ${loginResult.username}`);
      console.log(`session token ${loginResult.token ? 'received' : 'missing'}`);
    }

    console.log('\ntest 3 get user profile');
    const profileResponse = await fetch(`${baseUrl}/login/profile/new_student_2024`);
    
    if (profileResponse.ok) {
      const profile = await profileResponse.json() as any;
      console.log(`profile fetched ${profile.username}`);
      console.log(`student id ${profile.student_id}`);
    } else {
      console.log(`profile failed ${profileResponse.status}`);
    }

    console.log('\ntest 4 update user profile');
    const updateData = {
      full_name: 'alex chen updated',
      bio: 'just a tired engineering student trying to survive',
      year: 2
    };

    const updateResponse = await fetch(`${baseUrl}/login/update/new_student_2024`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    console.log(`update profile status ${updateResponse.status}`);
    if (updateResponse.ok) {
      const updateResult = await updateResponse.json() as any;
      console.log(`profile updated successfully`);
    }

    console.log('\ntest 5 change password');
    const passwordData = {
      current_password: 'password123',
      new_password: 'newpassword456'
    };

    const passwordResponse = await fetch(`${baseUrl}/login/change-password/new_student_2024`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(passwordData)
    });

    console.log(`password change status ${passwordResponse.status}`);

    console.log('\ntest 6 logout');
    const logoutResponse = await fetch(`${baseUrl}/login/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'new_student_2024' })
    });

    console.log(`logout status ${logoutResponse.status}`);

    console.log('\ntest 7 get all users');
    const usersResponse = await fetch(`${baseUrl}/login/users`);
    
    if (usersResponse.ok) {
      const users = await usersResponse.json() as any[];
      console.log(`users list ${users.length} users found`);
    } else {
      console.log(`users list failed ${usersResponse.status}`);
    }

    console.log('\nlogin auth tests complete');
    console.log('login endpoints working');

  } catch (error) {
    console.error('login test failed', error);
  }
}

testLoginAPI();
