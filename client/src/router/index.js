import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/merchant/:id',
      name: 'merchant-detail',
      component: () => import('../views/MerchantDetail.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/AdminLayout.vue'),
      children: [
        {
          path: 'merchants',
          name: 'admin-merchants',
          component: () => import('../views/admin/MerchantList.vue')
        },
        {
          path: 'merchants/add',
          name: 'merchant-add',
          component: () => import('../views/admin/MerchantForm.vue')
        },
        {
          path: 'merchants/:id/edit',
          name: 'merchant-edit',
          component: () => import('../views/admin/MerchantForm.vue')
        },
        {
          path: 'merchants/:id/status',
          name: 'merchant-status',
          component: () => import('../views/admin/MerchantStatus.vue')
        },
        {
          path: 'profile',
          name: 'admin-profile',
          component: () => import('../views/admin/ProfileView.vue')
        }
      ]
    }
  ]
})

export default router
