import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const Home = () => import('../components/HomePage.vue')
const Calendar = () => import('../components/CalendarPage.vue')
const Forum = () => import('../components/ForumPage.vue')
const Login = () => import('../components/Login.vue')
const ResourcePage = () => import('../components/ResourcePage.vue')
const ForumPage = () => import('../components/ForumPage.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar,
    meta: { requiresAuth: true }
  },
  {
    path: '/resources',
    name: 'Resources',
    component: ResourcePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/forum',
    name: 'Forum',
    component: ForumPage,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('Access denied - redirecting to login')
    next('/')
  } else if (to.path === '/' && isAuthenticated) {
    console.log('Already logged in - redirecting to home')
    next('/home')
  } else {
    next()
  }
})

export default router