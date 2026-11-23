import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import api from '../services/api'
import { useToast } from '../composables/useToast'

const routes = [
  { path: '/',               name: 'landing',        component: () => import('../views/LandingView.vue') },
  { path: '/login',          name: 'login',          component: () => import('../views/auth/LoginView.vue') },
  { path: '/register',       name: 'register',       component: () => import('../views/auth/RegisterView.vue') },
  { path: '/feed',           name: 'feed',           component: () => import('../views/FeedView.vue'),             meta: { requiresAuth: true } },
  { path: '/recipes/upload', name: 'recipe-upload',  component: () => import('../views/UploadRecipeView.vue'),     meta: { requiresAuth: true } },
  { path: '/recipes/:id',    name: 'recipe-detail',  component: () => import('../views/RecipeDetailView.vue') },
  { path: '/recipes/:id/edit', name: 'recipe-edit',  component: () => import('../views/EditRecipeView.vue'),       meta: { requiresAuth: true } },
  { path: '/my-recipes',     name: 'my-recipes',     component: () => import('../views/MyRecipesView.vue'),        meta: { requiresAuth: true } },
  { path: '/liked-recipes',  name: 'liked-recipes',  component: () => import('../views/LikedRecipesView.vue'),      meta: { requiresAuth: true } },
  { path: '/following-recipes', name: 'following-recipes', component: () => import('../views/FollowingRecipesView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/:username/followers', name: 'profile-followers', component: () => import('../views/profile/FollowListView.vue'), props: { kind: 'followers' } },
  { path: '/profile/:username/following', name: 'profile-following', component: () => import('../views/profile/FollowListView.vue'), props: { kind: 'following' } },
  { path: '/profile/me',     name: 'my-profile',     component: () => import('../views/profile/MyProfileView.vue'), meta: { requiresAuth: true } },
  { path: '/profile/:username', name: 'public-profile', component: () => import('../views/profile/PublicProfileView.vue') },
  { path: '/my-lists',       name: 'my-lists',       component: () => import('../views/lists/MyListsView.vue'),    meta: { requiresAuth: true } },
  { path: '/lists/:id',      name: 'list-detail',    component: () => import('../views/lists/ListDetailView.vue') },
  { path: '/search',         name: 'search',         component: () => import('../views/SearchView.vue') },
  { path: '/notifications',  name: 'notifications',  component: () => import('../views/NotificationsView.vue'),   meta: { requiresAuth: true } },
  // Painel (Aula 15): uma rota pai com o layout e a meta; as telas são filhas (path relativo, sem barra).
  // A meta do pai vale para os filhos (to.meta junta as metas de toda a cadeia).
  {
    path: '/admin',
    component: () => import('../components/layout/AdminLayout.vue'),
    redirect: { name: 'admin-dashboard' },
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('../views/admin/AdminDashboardView.vue') },
      { path: 'reports',   name: 'admin-reports',   component: () => import('../views/admin/AdminReportsView.vue') },
      { path: 'users',     name: 'admin-users',     component: () => import('../views/admin/AdminUsersView.vue') },
      { path: 'recipes',   name: 'admin-recipes',   component: () => import('../views/admin/AdminRecipesView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', name: 'not-found',     component: () => import('../views/NotFoundView.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/**
 * Guarda de rota — usa useAuth() (Aula 06).
 * useAuth() não chama useRouter() internamente, então pode ser
 * chamado aqui sem dependência circular.
 */
router.beforeEach(async (to, from, next) => {
  const { authStore } = useAuth()

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

  // Guarda por papel (Aula 15). Ela só melhora a experiência (não mostra um painel vazio);
  // quem protege os dados é a API: cada rota /api/admin confere o isAdmin no banco e responde 403.
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    useToast().error('Você não tem permissão para acessar a administração.')
    return next({ name: 'feed' })
  }

  next()
})

export default router
