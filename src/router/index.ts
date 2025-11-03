import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/store/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard.index',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/master',
      children: [
        {
          path: 'categories/',
          children: [
            {
              path: '',
              name: 'master.categories.index',
              component: () => import('@/views/Master/Categories/Index.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'create',
              name: 'master.categories.create',
              component: () => import('@/views/Master/Categories/Create.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'edit/:id',
              name: 'master.categories.edit',
              component: () => import('@/views/Master/Categories/Edit.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: 'products/',
          children: [
            {
              path: '',
              name: 'master.products.index',
              component: () => import('@/views/Master/Products/Index.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'create',
              name: 'master.products.create',
              component: () => import('@/views/Master/Products/Create.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'edit/:id',
              name: 'master.products.edit',
              component: () => import('@/views/Master/Products/Edit.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
        {
          path: 'certificates/',
          children: [
            {
              path: '',
              name: 'master.certificates.index',
              component: () => import('@/views/Master/Certificates/Index.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'create',
              name: 'master.certificates.create',
              component: () => import('@/views/Master/Certificates/Create.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'edit/:id',
              name: 'master.certificates.edit',
              component: () => import('@/views/Master/Certificates/Edit.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/setting',
      children: [
        {
          path: 'users/',
          children: [
            {
              path: '',
              name: 'setting.users.index',
              component: () => import('@/views/Setting/Users/Index.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'create',
              name: 'setting.users.create',
              component: () => import('@/views/Setting/Users/Create.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      name: 'auth.login.index',
      component: () => import('@/views/Auth/Login.vue'),
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  document.title = 'Fuboru Indonesia Panel'
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    await auth.loadSession()
    if (!auth.user) {
      return next('/login')
    }
  }

  next()
})

export default router
