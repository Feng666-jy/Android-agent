import { createRouter, createWebHistory } from 'vue-router'
import { storage } from '@/utils/storage'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { title: '登录', guest: true }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { title: '注册', guest: true }
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/components/ai-home/AiHomePage.vue'),
      meta: { title: '首页', requiresAuth: true }
    }
  ]
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title || 'App') + ' - Android Agent'
  const token = storage.getToken()

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.guest && token) {
    next('/home')
  } else {
    next()
  }
})

export default router