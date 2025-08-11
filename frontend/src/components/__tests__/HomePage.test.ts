import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../HomePage.vue'
import { nextTick } from 'vue'


vi.mock('../ChatbotWithSpeech.vue', () => ({
  default: {
    name: 'ChatbotWithSpeech',
    template: '<div data-testid="chatbot">Chatbot Component</div>',
    emits: ['add-task', 'remove-task', 'clear-all-tasks']
  }
}))

vi.mock('../TaskList.vue', () => ({
  default: {
    name: 'TaskList',
    template: '<div data-testid="tasklist">TaskList Component</div>',
    methods: {
      addTask: vi.fn(),
      removeTaskByName: vi.fn(),
      clearAllTasks: vi.fn()
    }
  }
}))

const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component:{ template: '<div>Login</div>' } },
      { path: '/login', component: { template: '<div>Login Page</div>' } },
      { path: '/home', component: HomePage }
    ]
  })
}

describe('HomePage.vue', () => {
  let router: any
  let localStorageMock: any

  beforeEach(() => {
    vi.clearAllMocks()
    router = createTestRouter()
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
    global.localStorage = localStorageMock
    global.alert = vi.fn()
  })

  describe('Authentication State', () => {
    it('shows login prompt when user not logged in', async () => {
      localStorageMock.getItem.mockReturnValue(null)
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      
      expect(wrapper.text()).toContain('Please log in to view and manage your tasks')
      expect(wrapper.find('[data-testid="tasklist"]').exists()).toBe(false)
      expect(wrapper.html()).toContain('Please log in to view and manage your tasks')
    })

    it('shows login prompt when username is undefined string', async () => {
      localStorageMock.getItem.mockReturnValue('undefined')
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      
      expect(wrapper.text()).toContain('Please log in to view and manage your tasks')
      expect(wrapper.find('[data-testid="tasklist"]').exists()).toBe(false)
    })

    it('shows task interface when user is logged in', async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      
      expect(wrapper.find('[data-testid="tasklist"]').exists()).toBe(true)
      expect(wrapper.text()).not.toContain('Please log in to view and manage your tasks')
    })
  })

  describe('Component Rendering', () => {
    it('renders welcome message and chatbot', async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      
      expect(wrapper.text()).toContain('Welcome back! 👋')
      expect(wrapper.text()).toContain('Ready to manage your tasks? Leo the Lion is here to help!')
      expect(wrapper.find('[data-testid="chatbot"]').exists()).toBe(true)
    })

    it('has correct CSS classes and structure', async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      
      expect(wrapper.find('.min-h-screen').exists()).toBe(true)
      expect(wrapper.find('.bg-gradient-to-br').exists()).toBe(true)
      expect(wrapper.find('.animate-fade-in-up').exists()).toBe(true)
    })
  })

  describe('Task Management Event Handling', () => {
    let wrapper: any

    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      await nextTick()
    })

    it('handles add-task event when logged in', async () => {
      const chatbot = wrapper.findComponent({ name: 'ChatbotWithSpeech' })
      const taskList = wrapper.findComponent({ name: 'TaskList' })
      taskList.vm.addTask = vi.fn()
      await chatbot.vm.$emit('add-task', 'New test task')
      await nextTick()
      
      expect(taskList.vm.addTask).toHaveBeenCalledWith('New test task')
    })

    it('handles remove task', async () => {
      const chatbot = wrapper.findComponent({ name: 'ChatbotWithSpeech' })
      const taskList = wrapper.findComponent({ name: 'TaskList' })
      
      taskList.vm.removeTaskByName = vi.fn()
      
      await chatbot.vm.$emit('remove-task', 'Task to remove')
      await nextTick()
      
      expect(taskList.vm.removeTaskByName).toHaveBeenCalledWith('Task to remove')
    })
  })

  describe('auth check', () => {
    beforeEach(async () => {
      localStorageMock.getItem.mockReturnValue(null)
    })

    it('show alert when trying to add task without login', async () => {
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      await nextTick()
      
      const chatbot = wrapper.findComponent({ name: 'ChatbotWithSpeech' })
      await chatbot.vm.$emit('add-task', 'New task')
      await nextTick()
      
      expect(global.alert).toHaveBeenCalledWith('Please log in to add tasks.')
    })

    it('show alert when trying to remove task without login', async () => {
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      await nextTick()
      
      const chatbot = wrapper.findComponent({ name: 'ChatbotWithSpeech' })
      await chatbot.vm.$emit('remove-task', 'Task name')
      await nextTick()
      
      expect(global.alert).toHaveBeenCalledWith('Please log in to remove tasks.')
    })
  })

  describe('Error Handling', () => {
    it('logs error when TaskList ref is null during add task', async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      await nextTick()
      ;(wrapper.vm as any).taskListRef = null
      
      const chatbot = wrapper.findComponent({ name: 'ChatbotWithSpeech' })
      await chatbot.vm.$emit('add-task', 'New task')
      await nextTick()
      
      expect(consoleSpy).toHaveBeenCalledWith('TaskList component ref is null. Cannot add task.')
      
      consoleSpy.mockRestore()
    })
  })

  describe('Responsive Layout', () => {
    it('has responsive classes for mobile and desktop', async () => {
      localStorageMock.getItem.mockReturnValue('testuser')
      
      const wrapper = mount(HomePage, {
        global: { plugins: [router] }
      })
      
      await nextTick()
      expect(wrapper.find('.text-2xl.md\\:text-3xl').exists()).toBe(true)
      expect(wrapper.find('.text-sm.md\\:text-base').exists()).toBe(true)
      expect(wrapper.find('.flex-col.md\\:flex-row').exists()).toBe(true)
    })
  })
})
