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
    },
    {
      path: '/personal-center',
      name: 'PersonalCenter',
      component: () => import('@/views/personal-center/PersonalCenter.vue'),
      meta: { title: '个人中心', requiresAuth: true }
    },
    {
      path: '/me',
      name: 'Profile',
      component: () => import('@/views/me/ProfileView.vue'),
      meta: { title: '设置', requiresAuth: true }
    },

    {
      path: '/workspace',
      component: () => import('@/layouts/TabLayout.vue'),
      meta: { requiresAuth: true },
      redirect: '/workspace/search',
      children: [
        {
          path: 'search',
          name: 'search',
          component: () => import('@/views/SearchView.vue'),
          meta: { title: '搜索' }
        },
        {
          path: 'image',
          name: 'image',
          component: () => import('@/views/ImageView.vue'),
          meta: { title: '绘图' }
        },
        {
          path: 'files',
          name: 'files',
          component: () => import('@/views/FilesView.vue'),
          meta: { title: '文件' }
        },
        {
          path: 'code',
          name: 'code',
          component: () => import('@/views/CodeView.vue'),
          meta: { title: '代码' }
        },
        {
          path: 'history',
          name: 'history',
          component: () => import('@/views/HistoryView.vue'),
          meta: { title: '历史' }
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/SettingsView.vue'),
          meta: { title: '设置' },
          children: [
            {
              path: 'providers',
              name: 'provider-list',
              component: () => import('@/views/provider/ProviderList.vue'),
              meta: { title: '供应商管理' }
            },
            {
              path: 'providers/new',
              name: 'provider-create',
              component: () => import('@/views/provider/ProviderForm.vue'),
              meta: { title: '新增供应商' }
            },
            {
              path: 'providers/:id',
              name: 'provider-detail',
              component: () => import('@/views/provider/ProviderDetail.vue'),
              meta: { title: '供应商详情' }
            },
            {
              path: 'providers/:id/edit',
              name: 'provider-edit',
              component: () => import('@/views/provider/ProviderForm.vue'),
              meta: { title: '编辑供应商' }
            },
            {
              path: 'models',
              name: 'model-manager',
              component: () => import('@/views/model/ModelManager.vue'),
              meta: { title: '模型管理' }
            },
            {
              path: 'tools',
              name: 'tool-manager',
              component: () => import('@/views/tools/ToolManager.vue'),
              meta: { title: '工具管理' }
            }
          ]
        }
      ]
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
