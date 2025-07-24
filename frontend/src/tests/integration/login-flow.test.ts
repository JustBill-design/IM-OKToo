import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Login from '../../components/Login.vue'
import { waitForNextTick } from './setup'
const createTestRouter = () =>{
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/',component:{ template: '<div>Login</div>' } },
      { path: '/home',component:{ template: '<div>Home</div>'} }
    ]
  })
}
const localStorageMock={
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear:vi.fn(),
}
global.localStorage=localStorageMock as any
global.alert = vi.fn()
describe('login flow', () => {
  let router: any
  beforeEach(() => {
    vi.clearAllMocks()
    router = createTestRouter()
    localStorageMock.setItem.mockClear()
  })
  describe('Login', () => {
    it('compelte login flow',async () => {
      const wrapper = mount(Login, {
        global: {
          plugins:[router]
        }
      })
      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')
      await waitForNextTick()
      await new Promise(resolve => setTimeout(resolve, 1100))
      expect(localStorageMock.setItem).toHaveBeenCalledWith('isAuthenticated','true')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('username','testuser')
    })



    it('check before submit', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })
      await wrapper.find('form').trigger('submit')
      await waitForNextTick()
      expect(wrapper.text()).toContain('Username or email is required')
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
    it('loading during login', async ()=> {
      const wrapper = mount(Login,{
        global: {
          plugins: [router]
        }
      })
      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')
      expect(wrapper.text()).toContain('Logging in')
      await new Promise(resolve => setTimeout(resolve, 1100))
      expect(localStorageMock.setItem).toHaveBeenCalled()
    })
  })

  describe('form valid', () => {
    it('check passowrd length', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins:[router]
        }
      })

      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('123') 
      await wrapper.find('form').trigger('submit')
      await waitForNextTick()
      expect(wrapper.text()).toContain('Password must be at least')
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
    it('clear error when good password', async () => {
      const wrapper = mount(Login, {
        global: {
          plugins: [router]
        }
      })
      await wrapper.find('form').trigger('submit')
      await waitForNextTick()
      expect(wrapper.text()).toContain('required')
      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('password123')
      await wrapper.find('form').trigger('submit')
      await waitForNextTick()
      expect(wrapper.text()).not.toContain('Username or email is required')
    })
  })
})
