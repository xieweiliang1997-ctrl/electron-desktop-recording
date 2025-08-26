import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/luanch',
    name: 'Lanuch',
    component: () => import('@/pages/luanchPage.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/dashboardPage.vue')
  },
  {
    path: '/suspend',
    name: 'Suspend',
    component: () => import('@/pages/suspendPage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
