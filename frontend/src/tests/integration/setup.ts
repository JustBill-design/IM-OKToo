import { vi } from 'vitest'
export const createMockFetch = (mockResponse:any, shouldFail=false) => {
  return vi.fn().mockImplementation(() => {
    if (shouldFail) {
      return Promise.reject(new Error('Network error'))
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponse),
    })
  })
}
export const mockPostsApiResponse = [
  {
    post_id: 1,
    title: 'Managing anxiety in daily life',
    content: 'Does anyone have effective coping strategies',
    views: 125,
    likes_count: 15,
    comments_count: 3,
    created_at: '2025-07-19T10:30:00.000Z',
    username: 'testUser1',
    post_author: 'testUser1',
    name: 'Mental Health'
  },
  {
    post_id:2,
    title:'important question', 
    content: 'if i hit myself and it hurts, does that mean i am weak or strong?',
    views:89,
    likes_count:8,
    comments_count: 1,
    created_at: '2025-07-18T14:20:00.000Z',
    username: 'testUser2',
    post_author: 'testUser2',
    name:'Support Groups'
  }
]
export const waitForNextTick = () => new Promise(resolve =>setTimeout(resolve, 0))
export const BASE_API_URL = 'http://localhost:3001'
