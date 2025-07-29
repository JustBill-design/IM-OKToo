import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PostItem from '../PostItem.vue'
import type { Post } from '../../types/forum'

const mockPost: Post = {
  id: '1',
  title: 'Managing anxiety',
  content: 'Does anyone have coping strategies?',
  category: 'Mental Health',
  views: 999,
  likes: 99,
  createdAt: '2025-07-19T03:22:47.000Z',
  user: { 
    id: '1',
    name: 'testUser1',
    avatar: 'avatar.jpg'
  },
  comments: [
    {
      id: '1',
      text: 'You\'re doing great by reaching out!!!',
      user: { 
        id: '2',
        name: 'testUser2',
        avatar: 'avatar2.jpg'
      },
      createdAt: '2025-07-19T03:22:47.000Z'
    },
    {
      id: '2', 
      text: 'Breathing exercises',
      user: {
        id: '3',
        name: 'testUser3',
        avatar: 'avatar3.jpg'
      },
      createdAt: '2025-07-19T04:15:30.000Z'
    }
  ]
}

const mockPostWithoutComments: Post = {
  ...mockPost,
  id: '2',
  title: 'Feeling cute today',
  content: 'yay',
  comments: []
}

describe('PostItem test', () => {
  describe('Basic stuff', () => {
    it('shows post with basic info', () => {
      const wrapper = mount(PostItem, {
        props: { post: mockPost }
      })
      
      expect(wrapper.text()).toContain('Mental Health')
      expect(wrapper.text()).toContain('999')
      expect(wrapper.text()).toContain('99')
      expect(wrapper.text()).toContain('2')
    })
  })
  describe('Expand/collapse', () => {
    it('starts collapsed', () => {
      const wrapper = mount(PostItem, {
        props: { post: mockPost }
      })
      expect(wrapper.text()).not.toContain('Does anyone have coping strategies?')
    })

    it('expands when click', async () => {
      const wrapper = mount(PostItem, {
        props: { post: mockPost }
      })
      await wrapper.find('[data-testid="post-header"]').trigger('click')
      
      expect(wrapper.text()).toContain('Does anyone have coping strategies?')
      expect(wrapper.text()).toContain('testUser1')
    })

    it('shows comments when expand', async () => {
      const wrapper = mount(PostItem, {
        props: { post: mockPost }
      })
      await wrapper.find('[data-testid="post-header"]').trigger('click')
      
      expect(wrapper.text()).toContain('Comments')
    })
  })
})
