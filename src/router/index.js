import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

const routes = [
  { path: '/',               name: 'landing',        component: () => import('../views/LandingView.vue') },
  { path: '/login',          name: 'login',          component: () => import('../views/auth/LoginView.vue') },
  { path: '/register',       name: 'register',       component: () => import('../views/auth/RegisterView.vue') },
  { path: '/feed',           name: 'feed',           component: () => import('../views/FeedView.vue'),             meta: { requiresAuth: true } },
  { path: '/recipes/upload', name: 'recipe-upload',  component: () => import('../views/UploadRecipeView.vue'),     meta: { requiresAuth: true } },
  { path: '/recipes/:id',    name: 'recipe-detail',  component: () => import('../views/RecipeDetailView.vue') },
  { path: '/recipes/:id/edit', name: 'recipe-edit',  component: () => import('../views/EditRecipeView.vue'),       meta: { requiresAuth: true } },
  { path: '/my-recipes',     name: 'my-recipes',     component: () => import('../views/MyRecipesView.vue'),        meta: { requiresAuth: true } },
  { path: '/profile/me',     name: 'my-profile',     component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/:username', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },
  { path: '/my-lists',       name: 'my-lists',       component: () => import('../views/lists/MyListsView.vue'),    meta: { requiresAuth: true } },
  { path: '/lists/:id',      name: 'list-detail',    component: () => import('../views/lists/ListDetailView.vue') },
  { path: '/search',         name: 'search',         component: () => import('../views/SearchView.vue') },
  { path: '/notifications',  name: 'notifications',  component: () => import('../views/NotificationsView.vue'),   meta: { requiresAuth: true } },
  { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/reports',  name: 'admin-reports',  component: () => import('../views/admin/AdminReportsView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users',    name: 'admin-users',    component: () => import('../views/admin/AdminUsersView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/recipes',  name: 'admin-recipes',  component: () => import('../views/admin/AdminRecipesView.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found',     component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Guarda de rota — useAuthStore() chamado DENTRO do callback, não no topo do arquivo
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // Valida o token com a API — detecta token adulterado mesmo sem chamada da tela
    try {
      await api.get('/profile/me')
    } catch (err) {
      if (err.status === 401) {
        authStore.clearSession()
        return next({ name: 'login', query: { redirect: to.fullPath } })
      }
    }
  }

  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    return next({ name: 'feed' })
  }

  next()
})

export default router
