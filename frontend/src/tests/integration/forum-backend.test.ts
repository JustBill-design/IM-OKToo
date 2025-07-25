import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ForumPage from '../../components/ForumPage.vue'
import {createMockFetch, mockPostsApiResponse, waitForNextTick, BASE_API_URL} from './setup'
global.fetch = vi.fn()
describe('forum and backend',() => {
  beforeEach(() =>{
    vi.clearAllMocks()
  })
  describe('API Integration', () => {
    it('loads posts from backend', async () => {
      global.fetch = createMockFetch(mockPostsApiResponse)
      const wrapper = mount(ForumPage)
      await waitForNextTick()
      await waitForNextTick() 
      expect(fetch).toHaveBeenCalledWith(`${BASE_API_URL}/posts`)
      expect(wrapper.text()).toContain('Managing anxiety in daily life')
      expect(wrapper.text()).toContain('testUser1')
    })
    it('handles backend errors gracefully', async () => {
      global.fetch = createMockFetch(null, true)
      const wrapper = mount(ForumPage)
      await waitForNextTick()
      await waitForNextTick()
      expect(wrapper.text()).toContain('Error')
      expect(wrapper.text()).toContain('Try Again')
    })
    it('load during API call', async () =>{
      global.fetch = vi.fn().mockImplementation(() => {
        return new Promise(resolve =>{
          setTimeout(() =>{
            resolve({
              ok: true,
              json: () =>Promise.resolve(mockPostsApiResponse)
            })
          }, 100) //dekay to simulate loading
        })
      })
      const wrapper = mount(ForumPage)
      expect(wrapper.text()).toContain('Loading posts')
      await new Promise(resolve => setTimeout(resolve,150))
      await waitForNextTick()
      expect(wrapper.text()).toContain('Managing anxiety')
    })
  })
  describe('data flow', () => {
    it('empty post', async () => {
      global.fetch = createMockFetch([])
      const wrapper = mount(ForumPage)
      await waitForNextTick()
      await waitForNextTick()
      expect(wrapper.text()).toContain('No posts yet')
      expect(wrapper.text()).toContain('Be the first to start')
    })
    it('post format',async ()=>{
      global.fetch = createMockFetch(mockPostsApiResponse)
      const wrapper = mount(ForumPage)
      await waitForNextTick()
      await waitForNextTick()
      const firstPost = mockPostsApiResponse[0]
      expect(wrapper.text()).toContain(firstPost.title)
      expect(wrapper.text()).toContain(firstPost.username)
    })
  })
  describe('error recovery', () => {
    it('retry if fail api call', async () => {
      const mockFetch = vi.fn()
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok:true,
          json:() => Promise.resolve(mockPostsApiResponse)
        })
      global.fetch = mockFetch
      
      const wrapper = mount(ForumPage)
      await waitForNextTick()
      await waitForNextTick()
      
      expect(wrapper.text()).toContain('Error')
      
      const buttons = wrapper.findAll('button')
      const retryButton = buttons.find(b => b.text().includes('Try Again'))
      if (retryButton) {
        await retryButton.trigger('click')
        
        await new Promise(resolve => setTimeout(resolve, 100))
        await waitForNextTick()
        await waitForNextTick()
        
        expect(mockFetch).toHaveBeenCalledTimes(2)
      }
    })
  })
})
