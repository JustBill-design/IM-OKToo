import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PostItem from '../PostItem.vue'

// we try local mock data first 
const mockPost = {
  post_id: 1,
  title: 'Feeling cute today might delete later',
  content: 'i am sad',
  category: 'General',
  views: 999,
  likes_count: 99,
  comments_count: 2,
  created_at: '2025-07-19T03:22:47.000Z',
  user: { username: 'yuchuan' },
  comments: [
    {
      comment_id: 1,
      content: 'cool!',
      user: { username: 'bill' },
      created_at: '2025-07-19T03:22:47.000Z'
    }
  ]
}

describe('PostItem.vue', () => {
  it('renders post title correctly', () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost,
        isLoggedIn: false 
      }
    })
    
    expect(wrapper.text()).toContain('Feeling cute today might delete later')
  })

  it('displays correct view count from database', () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost,
        isLoggedIn: false 
      }
    })
    
    expect(wrapper.text()).toContain('999')
  })

  it('shows username from database', () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost,
        isLoggedIn: false 
      }
    })
    
    expect(wrapper.text()).toContain('yuchuan')
  })
  it('ehhh', () => {
    const sensitivePost = {
      ...mockPost,
      content: 'Today I managed to get out of bed and go school, but I still feel terrible'
    }
    const wrapper = mount(PostItem, {
      props: { 
        post: sensitivePost,
        isLoggedIn: false 
      }
    })
    expect(wrapper.text()).toContain('feel terrible')
  })
})
