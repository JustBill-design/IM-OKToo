import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Login = () => import('../components/Login.vue')
const Home = () => import('../components/Calendar.vue')
const ResourcePage = () => import('../components/ResourcePage.vue')
const ForumPage = () => import('../components/ForumPage.vue')

const routes: RouteRecordRaw[] = [
  {path: '/', name: 'Login', component: Login},
  { path: '/home', name: 'Home', component: Home },
  { path: '/resources', name: 'Resources', component: ResourcePage },
  { path: '/forum', name: 'Forum', component: ForumPage}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 