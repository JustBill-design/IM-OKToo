import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CommentItem from '../CommentItem.vue'
import type { Comment } from '../../types/forum'

const mockComment: Comment = {
  id: '1',
  text: 'This is supportive comment',
  user: {
    id: '1',
    name: 'testUser',
    avatar: 'avatar.jpg'
  },
  createdAt: '2025-07-19T03:22:47.000Z'
}

describe('CommentItem.vue', () => {
  describe('Basic stuff', () => {
    it('shows comment text and user', () => {
      const wrapper = mount(CommentItem, {
        props: { comment: mockComment }
      })
      
      expect(wrapper.text()).toContain('This is supportive comment')
      expect(wrapper.text()).toContain('testUser')
    })
    it('time correcct', () => {
      const wrapper = mount(CommentItem, {
        props: { comment: mockComment }
      })
      
      expect(wrapper.text()).toContain('7/19/2025')
    })
  })
  describe('Edge cases', () => {
    it('empty text', () => {
      const emptyComment = { ...mockComment, text: '' }
      const wrapper = mount(CommentItem, {
        props: { comment: emptyComment }
      })
      expect(wrapper.text()).toContain('testUser')
    })

    it('long comments', () => {
      const longComment = { 
        ...mockComment, 
        text: 'wordssssssssssss s s s  s s ascmsdpfsie fei s jfois fosifosdsjvnuirdgbsro gjoeirg e fs gr grsrg rstg sg sh gherioghoesir erhsgdfngkbhk oinoiol oijoioijsrgof eojgoijogregerjgbkjo ijoi oi oijoirgheiygskgner oije eng g' 
      }
      const wrapper = mount(CommentItem, {
        props: { comment: longComment }
      })
      
      expect(wrapper.text()).toContain('wordssssssssssss s s s  s s ascmsdpfsie fei s jfois fosifosdsjvnuirdgbsro gjoeirg e fs gr grsrg rstg sg sh gherioghoesir erhsgdfngkbhk oinoiol oijoioijsrgof eojgoijogregerjgbkjo ijoi oi oijoirgheiygskgner oije eng g')
    })
  })
})
