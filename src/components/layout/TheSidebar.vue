<script setup>
/**
 * TheSidebar — navegação lateral.
 * Usa useAuth() (Aula 06) para mostrar links condicionalmente.
 *
 * Links públicos (sempre visíveis):
 *   - Início, Feed, Explorar (busca, Aula 13)
 *
 * Links visíveis apenas quando logado (Aula 06+):
 *   - Nova Receita    → módulo recipes (construído na Aula 07)
 *   - Minhas Receitas → módulo recipes (construído na Aula 07)
 *   - Meu Perfil      → funcional desde Aula 05
 *
 * Links pendentes para aulas futuras:
 *   - Minhas Listas   → módulo lists (Aula 13)
 *   - Notificações    → pelo sino da Navbar (Aula 14)
 *   - Admin           → seção "Administração", só para administrador (Aula 15)
 */
import { useAuth } from '../../composables/useAuth'

const { authStore } = useAuth()
</script>

<template>
  <aside class="sidebar d-flex flex-column py-3 px-2">
    <nav class="sidebar-nav d-flex flex-column gap-1">
      <!-- Links sempre visíveis -->
      <router-link class="sidebar-link" to="/">
        <i class="bi bi-house me-2" />Início
      </router-link>
      <router-link class="sidebar-link" to="/feed">
        <i class="bi bi-grid me-2" />Feed
      </router-link>
      <router-link class="sidebar-link" to="/search">
        <i class="bi bi-search me-2" />Explorar
      </router-link>

      <!-- Links visíveis apenas quando logado -->
      <template v-if="authStore.isAuthenticated">
        <hr class="sidebar-divider" />
        <router-link class="sidebar-link" to="/recipes/upload">
          <i class="bi bi-plus-circle me-2" />Nova Receita
        </router-link>
        <router-link class="sidebar-link" to="/profile/me">
          <i class="bi bi-person-circle me-2" />Meu Perfil
        </router-link>
        <router-link class="sidebar-link" to="/my-recipes">
          <i class="bi bi-journal-text me-2" />Minhas Receitas
        </router-link>
        <router-link class="sidebar-link" to="/liked-recipes">
          <i class="bi bi-heart me-2" />Receitas Curtidas
        </router-link>
        <router-link class="sidebar-link" to="/following-recipes">
          <i class="bi bi-people me-2" />Seguindo
        </router-link>
        <router-link class="sidebar-link" to="/my-lists">
          <i class="bi bi-collection me-2" />Minhas Listas
        </router-link>
        <!-- Notificações: pelo sino da Navbar (Aula 14) -->
      </template>

      <!-- Administração (Aula 15): só para administrador. /admin redireciona para o Dashboard -->
      <template v-if="authStore.isAuthenticated && authStore.isAdmin">
        <hr class="sidebar-divider" />
        <span class="sidebar-section">Administração</span>
        <router-link class="sidebar-link" to="/admin">
          <i class="bi bi-shield-lock me-2" />Painel
        </router-link>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: clamp(180px, 15vw, 240px);
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  color: #495057;
  text-decoration: none;
  font-size: 1rem;
  transition: background-color 0.15s, color 0.15s;
}

.sidebar-link:hover,
.sidebar-link.router-link-active {
  background-color: #ffe8e0;
  color: var(--brand-color);
  font-weight: 600;
}

.sidebar-divider {
  margin: 0.5rem 0.75rem;
  border-color: #dee2e6;
}
.sidebar-section {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #999;
}
</style>
