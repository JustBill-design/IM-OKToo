import { describe, it, expect } from 'vitest'
import fetch from 'node-fetch'

describe('vitest cloud database test', () => {
  const baseUrl = 'http://localhost:3001'

  it('should connect to cloud database with vitest', async () => {
    console.log('testing vitest with cloud database')
    
    const response = await fetch(`${baseUrl}/posts`)
    
    console.log(`vitest cloud test status ${response.status}`)
    
    if (response.ok) {
      const posts = await response.json() as any[]
      console.log(`vitest fetched ${posts.length} posts`)
      expect(Array.isArray(posts)).toBe(true)
    } else {
      console.log(`vitest cloud test failed ${response.status}`)
      expect(response.status).toBe(200)
    }
  })

  it('should create post via vitest', async () => {
    console.log('testing post creation with vitest')
    
    // ensure the test user exists
    const testUser = {
      username: 'vitest_tester',
      firstName: 'Vitest',
      email: `vitest_${Date.now()}@test.com`,
      password: 'TestPassword123!'
    }

    try {
      await fetch(`${baseUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      })
    } catch (e) {
      //if user already exists, ignore
      console.log('User registration result')
    }
    
    const newPost = {
      title: 'vitest cloud test post',
      content: 'testing if vitest works with cloud database better than jest',
      username: 'vitest_tester',
      category_id: 17  // general category
    }

    const response = await fetch(`${baseUrl}/posts/addposts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })

    console.log(`vitest post creation status ${response.status}`)
    
    if (response.ok) {
      const result = await response.json() as any
      console.log(`vitest post created ${result.post_id}`)
      expect(result.post_id).toBeDefined()
    } else {
      const errorText = await response.text()
      console.log(`vitest post creation failed: ${errorText}`)
      expect(response.status).toBe(200)
    }
  })
})
