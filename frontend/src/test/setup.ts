// Frontend test setup file
import { config } from '@vue/test-utils'

// Global test configuration
config.global.stubs = {
  // Stub router-link and router-view for testing
  RouterLink: true,
  RouterView: true
}


config.global.mocks = {
  $router: {
    push: () => {},
    replace: () => {},
    go: () => {},
    back: () => {},
    forward: () => {}
  },
  $route: {
    path: '/',
    params: {},
    query: {},
    hash: '',
    fullPath: '/',
    matched: [],
    name: undefined,
    redirectedFrom: undefined
  }
}

config.global.provide = {
  router: {
    push: () => {},
    replace: () => {},
    go: () => {},
    back: () => {},
    forward: () => {},
    currentRoute: { value: { path: '/' } }
  }
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock IntersectionObserver for scroll tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}
