import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '../Login.vue'

describe('Login.vue', () => {
  describe('rendering', () => {
    it('shows form fields', () => {
      const wrapper = mount(Login)
      expect(wrapper.find('input[type="text"]').exists()).toBe(true)
      expect(wrapper.find('input[type="password"]').exists()).toBe(true)
      expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
    })
    it('has proper labels', () => {
      const wrapper = mount(Login)
      expect(wrapper.text()).toContain('Username')
      expect(wrapper.text()).toContain('Password')
    })
  })
  describe('Form interaction', () => {
    it('updates when typing', async () => {
      const wrapper = mount(Login)
      const usernameInput = wrapper.find('input[type="text"]')
      const passwordInput = wrapper.find('input[type="password"]')
      await usernameInput.setValue('testuser')
      await passwordInput.setValue('password123')
      
      expect(usernameInput.element.value).toBe('testuser')
      expect(passwordInput.element.value).toBe('password123')
    })
    it('empty or blank show error', async () => {
      const wrapper = mount(Login)
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('Username or email is required')
    })

    it('validate password length', async () => {
      const wrapper = mount(Login)
      
      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('123')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('Password must be at least')
    })
  })
})
