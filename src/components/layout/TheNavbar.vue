<script setup>
/**
 * TheNavbar — barra de navegação principal (Aula 09 atualização).
 *
 * Novidades:
 *   - Menu suspenso no avatar quando logado: Editar Perfil, Ver Perfil,
 *     Minhas Receitas, Sair.
 *   - Fecha ao clicar fora (useClickOutside), ao pressionar Esc,
 *     ou ao escolher um item.
 *   - Links públicos mantidos: Feed.
 *   - Aula 13: barra de busca (Enter leva a /search?q=...), visível também
 *     para visitante, e o item "Minhas Listas" no menu do avatar.
 */
import { ref, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth }          from '../../composables/useAuth'
import { useNotificationStore } from '../../stores/notifications'
import { useClickOutside }  from '../../composables/useClickOutside'
import { getProfilePictureUrl } from '../../utils/media'

const { authStore, logout: logoutStore } = useAuth()
const router = useRouter()

const menuOpen   = ref(false)
const searchText = ref('')

// Sino (Aula 14): o polling liga ao entrar na conta e desliga ao sair
const notificationStore = useNotificationStore()
const unreadCount = computed(() => notificationStore.unreadCount)
const unreadBadge = computed(() => (unreadCount.value > 99 ? '99+' : String(unreadCount.value)))
const bellLabel = computed(() => {
  if (unreadCount.value === 0) return 'Notificações'
  return unreadCount.value === 1 ? 'Notificações (1 não lida)' : `Notificações (${unreadCount.value} não lidas)`
})

watch(
  () => authStore.isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) notificationStore.startPolling()
    else notificationStore.stopPolling()
  },
  { immediate: true }
)

onUnmounted(() => notificationStore.stopPolling())

// Enter na barra de busca: ignora vazio, abre a busca com o termo e limpa o campo
function submitSearch() {
  const q = searchText.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
  searchText.value = ''
}
const menuRef    = ref(null)

useClickOutside(menuRef, () => { menuOpen.value = false })

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleKeydown(e) {
  if (e.key === 'Escape') menuOpen.value = false
}

async function handleLogout() {
  closeMenu()
  await logoutStore()
  router.push({ name: 'login' })
}
</script>

<template>
  <header
    class="navbar navbar-expand-md navbar-dark px-4 py-2"
    style="background-color: var(--brand-color);"
    @keydown="handleKeydown"
  >
    <router-link class="navbar-brand fw-bold fs-4" to="/">
      <i class="bi bi-egg-fried me-2" />RecipeMaster
    </router-link>

    <nav class="ms-auto d-flex align-items-center gap-3">
      <router-link class="nav-link text-white navbar-nav-link" to="/feed">
        <i class="bi bi-grid me-1" />Feed
      </router-link>
      <!-- Busca (Aula 13): visível também para visitante -->
      <form role="search" class="navbar-search" @submit.prevent="submitSearch">
        <input
          v-model="searchText"
          type="search"
          class="navbar-search-input"
          placeholder="Buscar receitas ou pessoas"
          aria-label="Buscar receitas ou pessoas"
        />
        <button type="submit" class="navbar-search-btn" aria-label="Buscar">
          <i class="bi bi-search" />
        </button>
      </form>

      <!-- Estado logado: menu suspenso no avatar -->
      <template v-if="authStore.isAuthenticated">
        <!-- Sino: só para quem está logado; o selo só aparece com não lidas -->
        <router-link
          :to="{ name: 'notifications' }"
          class="bell-btn position-relative"
          :aria-label="bellLabel"
          :title="bellLabel"
        >
          <i class="bi bi-bell" aria-hidden="true" />
          <span
            v-if="unreadCount > 0"
            class="bell-badge position-absolute top-0 start-100 translate-middle"
            aria-hidden="true"
          >
            {{ unreadBadge }}
          </span>
        </router-link>

        <div class="avatar-menu-wrapper" ref="menuRef">
          <button class="avatar-btn" @click="toggleMenu" :aria-expanded="menuOpen" aria-haspopup="true">
            <img
              :src="getProfilePictureUrl(authStore.user?.profilePicture, authStore.user?.fullName || authStore.user?.username)"
              :alt="authStore.user?.username"
              class="avatar-img"
            />
            <span class="text-white ms-1" style="font-size: 1rem;">@{{ authStore.user?.username }}</span>
            <i class="bi text-white ms-1" :class="menuOpen ? 'bi-chevron-up' : 'bi-chevron-down'" />
          </button>

          <!-- Menu suspenso -->
          <div v-if="menuOpen" class="avatar-dropdown" role="menu">
            <!-- Quem está logado, no topo do menu -->
            <div class="dropdown-user">
              <div class="dropdown-user-name">{{ authStore.user?.fullName || authStore.user?.username }}</div>
              <div class="dropdown-user-handle">@{{ authStore.user?.username }}</div>
            </div>
            <router-link
              class="dropdown-item-link"
              to="/profile/me"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-pencil-square dropdown-icon" />Editar Perfil
            </router-link>
            <router-link
              class="dropdown-item-link"
              :to="{ name: 'public-profile', params: { username: authStore.user?.username } }"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-person-circle dropdown-icon" />Ver Perfil
            </router-link>
            <router-link
              class="dropdown-item-link"
              to="/my-recipes"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-journal-text dropdown-icon" />Minhas Receitas
            </router-link>
            <router-link
              class="dropdown-item-link"
              to="/my-lists"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-collection dropdown-icon" />Minhas Listas
            </router-link>
            <hr class="dropdown-divider" />
            <button class="dropdown-item-link dropdown-item-danger" @click="handleLogout" role="menuitem">
              <i class="bi bi-box-arrow-right dropdown-icon" />Sair
            </button>
          </div>
        </div>
      </template>

      <!-- Estado deslogado -->
      <template v-else>
        <router-link class="navbar-btn-outline" to="/login">
          <i class="bi bi-box-arrow-in-right me-1" />Entrar
        </router-link>
        <router-link class="navbar-btn-outline" to="/register">
          <i class="bi bi-person-plus me-1" />Cadastrar
        </router-link>
      </template>
    </nav>
  </header>
</template>

<style scoped>
.navbar-nav-link {
  font-size: 1rem !important;
  font-weight: 500;
  letter-spacing: 0.01em;
  padding: 0.4rem 0.6rem !important;
}

.avatar-menu-wrapper {
  position: relative;
}

.avatar-btn {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  transition: background 0.15s;
}

.avatar-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.avatar-img {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.avatar-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 220px;
  z-index: 1000;
  padding: 0.35rem 0;
  overflow: hidden;
}
.dropdown-user {
  padding: 0.6rem 1rem 0.55rem;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0.3rem;
}
.dropdown-user-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: #222;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.dropdown-user-handle {
  font-size: 0.78rem;
  color: #999;
}
.dropdown-item-link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.5rem 1rem;
  font-family: inherit;
  font-size: 0.88rem;
  line-height: 1.3;
  text-align: left;
  color: #333 !important;
  text-decoration: none !important;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.12s;
}
/* Largura fixa para os textos ficarem alinhados, seja qual for o ícone */
.dropdown-icon {
  width: 1.1rem;
  font-size: 1rem;
  text-align: center;
  color: #777;
}
.dropdown-item-link:hover {
  background: #fce8e0 !important;
  color: var(--brand-color) !important;
}
.dropdown-item-link:hover .dropdown-icon {
  color: var(--brand-color);
}
.dropdown-item-danger,
.dropdown-item-danger .dropdown-icon {
  color: #dc3545 !important;
}
.dropdown-item-danger:hover {
  background: #fdecee !important;
  color: #dc3545 !important;
}
.dropdown-divider {
  margin: 0.3rem 0;
  border-color: #f0f0f0;
  opacity: 1;
}/* Botões da navbar deslogado — sem arredondamento, sem override do Bootstrap */
.navbar-btn-outline {
  display: inline-flex;
  align-items: center;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  border: 1.5px solid rgba(255,255,255,0.8);
  color: #fff !important;
  text-decoration: none !important;
  font-size: 0.95rem;
  font-weight: 500;
  background: transparent;
  transition: background 0.15s, color 0.15s;
}

.bell-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  color: #fff;
  font-size: 1.2rem;
  text-decoration: none;
  transition: background 0.15s;
}
.bell-btn:hover,
.bell-btn.router-link-active {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}
.bell-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 50px;
  background: #fff;
  color: var(--brand-color);
  font-size: 0.7rem;
  font-weight: 800;
  line-height: 20px;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}
.navbar-search {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 20px;
  padding: 0.15rem 0.25rem 0.15rem 0.9rem;
}
.navbar-search-input {
  background: transparent;
  border: none;
  outline: none;
  color: #fff;
  width: 220px;
  font-size: 0.95rem;
}
.navbar-search-input::placeholder {
  color: rgba(255, 255, 255, 0.85);
}
.navbar-search-btn {
  background: none;
  border: none;
  color: #fff;
  padding: 0.25rem 0.6rem;
  cursor: pointer;
}
.navbar-btn-outline:hover {
  background: rgba(255,255,255,0.2);
  color: #fff !important;
}
</style>

