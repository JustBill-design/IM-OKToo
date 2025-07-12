import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const Home = () => import('../components/HomePage.vue')
const Calendar = () => import('../components/CalendarPage.vue')
const Forum = () => import('../components/ForumPage.vue')
const ResourcePage = () => import('../components/ResourcePage.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/forum', name: 'Forum', component: Forum },
  { path: '/resources', name: 'Resources', component: ResourcePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router