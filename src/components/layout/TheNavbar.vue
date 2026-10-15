<script setup>
/**
 * TheNavbar — barra de navegação principal (Aula 09 atualização).
 *
 * Novidades:
 *   - Menu suspenso no avatar quando logado: Editar Perfil, Ver Perfil,
 *     Minhas Receitas, Sair.
 *   - Fecha ao clicar fora (useClickOutside), ao pressionar Esc,
 *     ou ao escolher um item.
 *   - Links públicos mantidos: Feed, Buscar.
 */
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth }          from '../../composables/useAuth'
import { useClickOutside }  from '../../composables/useClickOutside'
import { getProfilePictureUrl } from '../../utils/media'

const { authStore, logout: logoutStore } = useAuth()
const router = useRouter()

const menuOpen   = ref(false)
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
      <router-link class="nav-link text-white navbar-nav-link" to="/search">
        <i class="bi bi-search me-1" />Buscar
      </router-link>

      <!-- Estado logado: menu suspenso no avatar -->
      <template v-if="authStore.isAuthenticated">
        <div class="avatar-menu-wrapper" ref="menuRef">
          <button class="avatar-btn" @click="toggleMenu" :aria-expanded="menuOpen" aria-haspopup="true">
            <img
              :src="getProfilePictureUrl(authStore.user?.profilePicture, authStore.user?.fullName || authStore.user?.username)"
              :alt="authStore.user?.username"
              class="avatar-img"
            />
            <span class="text-white small ms-1">@{{ authStore.user?.username }}</span>
            <i class="bi text-white ms-1" :class="menuOpen ? 'bi-chevron-up' : 'bi-chevron-down'" />
          </button>

          <!-- Menu suspenso -->
          <div v-if="menuOpen" class="avatar-dropdown" role="menu">
            <router-link
              class="dropdown-item-link"
              to="/profile/me"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-pencil-square me-2" />Editar Perfil
            </router-link>
            <router-link
              class="dropdown-item-link"
              :to="{ name: 'public-profile', params: { username: authStore.user?.username } }"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-person-circle me-2" />Ver Perfil
            </router-link>
            <router-link
              class="dropdown-item-link"
              to="/my-recipes"
              @click="closeMenu"
              role="menuitem"
            >
              <i class="bi bi-journal-text me-2" />Minhas Receitas
            </router-link>
            <hr class="dropdown-divider my-1" />
            <button class="dropdown-item-link text-danger" @click="handleLogout" role="menuitem">
              <i class="bi bi-box-arrow-right me-2" />Sair
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
  border-radius: 10px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  padding: 0.5rem 0;
  overflow: hidden;
}

.dropdown-item-link {
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  color: #333 !important;
  text-decoration: none !important;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
  transition: background 0.12s;
}

.dropdown-item-link:hover {
  background: #fce8e0 !important;
  color: var(--brand-color) !important;
}

.dropdown-divider {
  border-color: #e9ecef;
}

/* Botões da navbar deslogado — sem arredondamento, sem override do Bootstrap */
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

.navbar-btn-outline:hover {
  background: rgba(255,255,255,0.2);
  color: #fff !important;
}
</style>
