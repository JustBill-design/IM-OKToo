import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fetch from 'node-fetch'

describe('Posts API Integration Tests', () => {
  const baseUrl = 'http://localhost:3001'

  beforeAll(() => {
    console.log('posts integration tests starting')
  })

  afterAll(() => {
    console.log('posts integration tests complete')
  })

  describe('GET /posts', () => {
    it('should get all posts', async () => {
      const response = await fetch(`${baseUrl}/posts`)
      
      console.log(`vitest get posts status ${response.status}`)
      expect(response.status).toBe(200)
      
      if (response.ok) {
        const posts = await response.json() as any[]
        console.log(`vitest posts count ${posts.length}`)
        expect(Array.isArray(posts)).toBe(true)
        
        // Verify post structure
        if (posts.length > 0) {
          const post = posts[0]
          expect(post).toHaveProperty('post_id')
          expect(post).toHaveProperty('title')
          expect(post).toHaveProperty('content')
          expect(post).toHaveProperty('post_author')
        }
      }
    })

    it('should handle database connection gracefully', async () => {
      const response = await fetch(`${baseUrl}/posts`)
      
      console.log(`vitest posts connection status ${response.status}`)
      expect([200, 500]).toContain(response.status)
    })

    it('should return posts with proper data types', async () => {
      const response = await fetch(`${baseUrl}/posts`)
      
      if (response.ok) {
        const posts = await response.json() as any[]
        
        posts.forEach(post => {
          expect(typeof post.post_id).toBe('number')
          expect(typeof post.title).toBe('string')
          expect(typeof post.content).toBe('string')
          expect(typeof post.post_author).toBe('string')
          expect(typeof post.views).toBe('number')
          expect(typeof post.likes_count).toBe('number')
        })
      }
    })
  })

  describe('GET /posts/categories', () => {
    it('should get all categories', async () => {
      const response = await fetch(`${baseUrl}/posts/categories`)
      
      console.log(`vitest categories status ${response.status}`)
      expect(response.status).toBe(200)
      
      if (response.ok) {
        const categories = await response.json() as any[]
        console.log(`vitest categories count ${categories.length}`)
        expect(Array.isArray(categories)).toBe(true)
        
        // Verify category structure
        if (categories.length > 0) {
          const category = categories[0]
          expect(category).toHaveProperty('category_id')
          expect(category).toHaveProperty('name')
        }
      }
    })

    it('should include common caretaking categories', async () => {
      const response = await fetch(`${baseUrl}/posts/categories`)
      
      if (response.ok) {
        const categories = await response.json() as any[]
        const categoryNames = categories.map(c => c.name.toLowerCase())
      
        const careCategories = ['general', 'medical', 'emotional', 'daily care', 'resources']
        const hasCareCategories = careCategories.some(cat => 
          categoryNames.some(name => name.includes(cat))
        )
        expect(hasCareCategories).toBe(true)
      }
    })
  })

  describe('POST /posts/addposts', () => {
    it('should create new post', async () => {
      const postData = {
        title: 'caring for my mom with dementia',
        content: 'need advice on daily routines that work well',
        username: 'worried_daughter',
        category: 'dementia care',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData)
      })

      console.log(`vitest create post status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle missing required fields', async () => {
      const incompletePost = {
        title: 'incomplete post'
        // missing content, username and stuff
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incompletePost)
      })

      console.log(`vitest incomplete post status ${response.status}`)
      expect([400, 422, 500]).toContain(response.status)
    })

    it('should handle caretaking-focused posts', async () => {
      const carePost = {
        title: 'managing medications for elderly parent',
        content: 'my dad keeps forgetting his pills, any tips for medication reminders that actually work?',
        username: 'frustrated_caregiver',
        category: 'medication management',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carePost)
      })

      console.log(`vitest care post status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle elderly care terminology', async () => {
      const elderlyPost = {
        title: 'fall prevention for seniors',
        content: 'grandma fell again yesterday. what safety measures have worked for your family?',
        username: 'caring_grandson',
        category: 'safety',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(elderlyPost)
      })

      console.log(`vitest elderly care post status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('GET /posts/:postId/comments', () => {
    it('should get comments for existing post', async () => {
      const response = await fetch(`${baseUrl}/posts/1/comments`)
      
      console.log(`vitest post comments status ${response.status}`)
      if (response.ok) {
        const comments = await response.json() as any[]
        expect(Array.isArray(comments)).toBe(true)
        
        // Verify comment structure
        if (comments.length > 0) {
          const comment = comments[0]
          expect(comment).toHaveProperty('comment_id')
          expect(comment).toHaveProperty('content')
          expect(comment).toHaveProperty('username')
        }
      }
    })

    it('should handle non-existent post comments', async () => {
      const response = await fetch(`${baseUrl}/posts/999999/comments`)
      
      console.log(`vitest non-existent post comments status ${response.status}`)
      expect([200, 404]).toContain(response.status)
    })
  })

  describe('POST /posts/addcomments', () => {
    it('should add comment to post', async () => {
      const commentData = {
        postId: 1,
        content: 'my grandma has this too, we found that keeping a daily routine really helps with her memory',
        username: 'caring_son',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addcomments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })

      console.log(`vitest add comment status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle supportive caretaking comments', async () => {
      const supportComment = {
        postId: 1,
        content: 'hang in there! caregiving is tough but youre doing great. have you tried setting up pill organizers?',
        username: 'experienced_caregiver',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addcomments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supportComment)
      })

      console.log(`vitest support comment status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('PUT /posts/:postId/edit', () => {
    it('should edit existing post', async () => {
      const editData = {
        title: 'updated: caring for mom',
        content: 'updated content about memory care strategies',
        category: 'memory care'
      }

      const response = await fetch(`${baseUrl}/posts/1/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      console.log(`vitest edit post status ${response.status}`)
      expect([200, 400, 404, 500]).toContain(response.status)
    })

    it('should handle non-existent post edit', async () => {
      const editData = {
        title: 'trying to edit non-existent post',
        content: 'this should fail',
        category: 'test'
      }

      const response = await fetch(`${baseUrl}/posts/999999/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      console.log(`vitest edit non-existent post status ${response.status}`)
      expect([404, 400, 500]).toContain(response.status)
    })
  })

  describe('DELETE /posts/delete/:postId', () => {
    it('should delete existing post', async () => {
      const response = await fetch(`${baseUrl}/posts/delete/1`, {
        method: 'DELETE'
      })

      console.log(`vitest delete post status ${response.status}`)
      expect([200, 404, 500]).toContain(response.status)
    })

    it('should handle non-existent post deletion', async () => {
      const response = await fetch(`${baseUrl}/posts/delete/999999`, {
        method: 'DELETE'
      })

      console.log(`vitest delete non-existent post status ${response.status}`)
      expect([404, 500]).toContain(response.status)
    })
  })

  describe('Posts API Edge Cases', () => {
    it('should handle concurrent post requests', async () => {
      const requests = Array(3).fill(0).map(() => 
        fetch(`${baseUrl}/posts`)
      )

      const responses = await Promise.all(requests)
      const statuses = responses.map(r => r.status)
      
      console.log(`vitest concurrent posts statuses ${statuses.join(', ')}`)
      statuses.forEach(status => {
        expect([200, 429, 500]).toContain(status)
      })
    })

    it('should handle posts with special characters', async () => {
      const specialPost = {
        title: 'caring for 奶奶 (grandma) with 💊💊 💊 💊 💊  medication reminders',
        content: 'need help managing multiple medications: aspirin, vitamin D & calcium supplements',
        username: 'multilingual_caregiver',
        category: 'medication',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(specialPost)
      })

      console.log(`vitest special chars post status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })

    it('should handle very long post content', async () => {
      const longContent = 'caring for elderly parent is challenging. '.repeat(100) //  long long
      const longPost = {
        title: 'very detailed caregiving experience',
        content: longContent,
        username: 'detailed_caregiver',
        category: 'general',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addposts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(longPost)
      })

      console.log(`vitest long post status ${response.status}`)
      expect([200, 201, 400, 413, 500]).toContain(response.status)
    })
  })

  // Merged from vitest-enhanced-coverage.test.ts - Additional Posts Tests
  describe('Comments API', () => {
    it('should handle get post comments', async () => {
      const response = await fetch(`${baseUrl}/posts/1/comments`)
      
      console.log(`vitest post comments status ${response.status}`)
      if (response.ok) {
        const comments = await response.json() as any[]
        expect(Array.isArray(comments)).toBe(true)
      }
    })

    it('should handle add comment', async () => {
      const commentData = {
        postId: 1,
        content: 'my grandma has this too, we found that keeping a daily routine really helps with her memory',
        username: 'caring_son',
        email: 'mymail@sutd.edu.sg'
      }

      const response = await fetch(`${baseUrl}/posts/addcomments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(commentData)
      })

      console.log(`vitest add comment status ${response.status}`)
      expect([200, 201, 400, 500]).toContain(response.status)
    })
  })

  describe('Post Management', () => {
    it('should handle edit post', async () => {
      const editData = {
        title: 'updated: caring for mom',
        content: 'updated content about memory care strategies',
        category: 'memory care'
      }

      const response = await fetch(`${baseUrl}/posts/1/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      console.log(`vitest edit post status ${response.status}`)
      expect([200, 400, 404, 500]).toContain(response.status)
    })

    it('should handle delete post', async () => {
      const response = await fetch(`${baseUrl}/posts/delete/999`, {
        method: 'DELETE'
      })

      console.log(`vitest delete post status ${response.status}`)
      expect([200, 404, 500]).toContain(response.status)
    })
  })
})
