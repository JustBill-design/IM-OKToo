import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PostItem from '../PostItem.vue'
import type { Post } from '../../types/forum'

const mockPost: Post = {
  id: '1',
  title: 'Feeling cute today might delete later',
  content: 'Today I managed to get out of bed and go to school, but I still feel terrible',
  category: 'General',
  views: 999,
  likes: 99,
  createdAt: '2025-07-19T03:22:47.000Z',
  user: { 
    id: '1',
    name: 'yuchuan',
    avatar: 'avatar.jpg'
  },
  comments: [
    {
      id: '1',
      text: 'cool!',
      user: { 
        id: '2',
        name: 'bill',
        avatar: 'avatar2.jpg'
      },
      createdAt: '2025-07-19T03:22:47.000Z'
    }
  ]
}

describe('PostItem.vue', () => {
  it('renders post title correctly', () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost
      }
    })
    
    expect(wrapper.text()).toContain('Feeling cute today might delete later')
  })

  it('displays correct view count from database', () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost
      }
    })
    
    expect(wrapper.text()).toContain('999')
  })

  it('shows username from database when expanded', async () => {
    const wrapper = mount(PostItem, {
      props: { 
        post: mockPost
      }
    })
    
    // Click to expand the post
    await wrapper.find('[data-testid="post-header"]').trigger('click')
    
    expect(wrapper.text()).toContain('yuchuan')
  })

  it('displays sensitive mental health content when expanded', async () => {
    const sensitivePost = {
      ...mockPost,
      content: 'Today I managed to get out of bed and go to school, but I still feel terrible'
    }
    const wrapper = mount(PostItem, {
      props: { 
        post: sensitivePost
      }
    })
    
    await wrapper.find('[data-testid="post-header"]').trigger('click')
    
    expect(wrapper.text()).toContain('feel terrible')
  })
})
