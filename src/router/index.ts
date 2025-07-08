import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'


const Home = () => import('../components/HelloWorld.vue')
const ResourcePage = () => import('../components/ResourcePage.vue')

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: Home },
  { path: '/resources', name: 'Resources', component: ResourcePage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router 