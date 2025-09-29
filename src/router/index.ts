import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/utils/supabase'

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
            {
              path: 'edit/:slug',
              name: 'setting.users.edit',
              component: () => import('@/views/Setting/Users/Edit.vue'),
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
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
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
