import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import App from '../../App.vue'
import HomePage from '../../components/HomePage.vue'
import ForumPage from '../../components/ForumPage.vue'
import { waitForNextTick } from './setup'
const routes = [
  { path: '/', name: 'Login', component: { template:'<div data-testid="login-page">Login Page</div>'}},
  { path: '/home', name: 'Home', component: HomePage},
  { path: '/forum', name: 'Forum', component: ForumPage}
]
const createTestRouter =()=>{
  return createRouter({
    history: createWebHistory(),
    routes
  })}
describe('routes', () =>{
  let router: any
  beforeEach(() =>{
    router = createTestRouter()
  })

  describe('between routes',() =>{
    it('navigate between routes', async ()=>{
      router.push('/')
      await router.isReady()
      const wrapper = mount(App,{
        global:{
          plugins:[router]
        }})
      await waitForNextTick()
      expect(router.currentRoute.value.name).toBe('Login')
      await router.push('/home')
      await waitForNextTick()
      expect(router.currentRoute.value.path).toBe('/home') })
    it('show sidebar wo login', async ()=> {
      router.push('/home')
      await router.isReady()
      const wrapper =mount(App,{
        global: {
          plugins:[router]
        }})
      await waitForNextTick()
      const mainContent=wrapper.find('.main-content')
      expect(mainContent.exists()).toBe(true)
    })
    it('hides sidebar if loggedin', async () => {
      router.push('/')
      await router.isReady()
      const wrapper = mount(App,{
        global: {
          plugins: [router]
        }})
      await waitForNextTick()
      const mainContent = wrapper.find('.main-content-full')
      expect(mainContent.exists()).toBe(true)
    })})
  describe('Route change', () =>{
    it('handles route changes', async () => {
      const wrapper = mount(App,{
        global: {
          plugins: [router]
        }})
      await router.push('/')
      await waitForNextTick()
      expect(router.currentRoute.value.name).toBe('Login')
      await router.push('/forum')
      await waitForNextTick()
      expect(router.currentRoute.value.name).toBe('Forum')
      await router.push('/home')
      await waitForNextTick()
      expect(router.currentRoute.value.name).toBe('Home')
    })
  })
})
