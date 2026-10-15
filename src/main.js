import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const routes = [
  { path: '/', redirect: '/products' },
  {
    path: '/register',
    name: 'register',
    component: () => import('./pages/RegisterPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./pages/LoginPage.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/products',
    name: 'products',
    component: () => import('./pages/ProductsPage.vue')
  },
  {
    path: '/products/:productId',
    name: 'product-details',
    component: () => import('./pages/ProductDetailsPage.vue'),
    props: true
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('./pages/CartPage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'orders',
    component: () => import('./pages/OrdersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('./pages/AdminOrdersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: () => import('./pages/AdminUsersView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('./pages/ProfilePage.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('./pages/NotFoundPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return { name: 'products' }
  }

  if (to.meta.guestOnly && auth.isLoggedIn) {
    return { name: 'products' }
  }

  return true
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
