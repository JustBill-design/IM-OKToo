import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const Home = () => import('../components/HomePage.vue')
const Calendar = () => import('../components/CalendarPage.vue')
const Forum = () => import('../components/ForumPage.vue')
const Login = () => import('../components/Login.vue')
const ResourcePage = () => import('../components/ResourcePage.vue')
const ForumPage = () => import('../components/ForumPage.vue')

const routes: RouteRecordRaw[] = [
  { path: '/calendar', name: 'Calendar', component: Calendar },
  { path: '/', name: 'Login', component: Login},
  { path: '/home', name: 'Home', component: Home },
  { path: '/resources', name: 'Resources', component: ResourcePage },
  { path: '/forum', name: 'Forum', component: ForumPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router