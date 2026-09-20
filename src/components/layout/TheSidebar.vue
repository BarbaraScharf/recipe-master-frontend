<script setup>
/**
 * TheSidebar — navegação lateral.
 * Usa useAuth() (Aula 06) para mostrar links condicionalmente.
 *
 * Regra aplicada (ADR-013 do curso de referência):
 *   Só aparecem links para funcionalidades que EXISTEM hoje (Aulas 01–06).
 *   Links que dependem de módulos futuros serão adicionados quando esses
 *   módulos forem construídos:
 *     - Nova Receita / Minhas Receitas  → módulo recipes (Aulas futuras)
 *     - Minhas Listas                  → módulo lists (Aula futura)
 *     - Notificações                   → módulo notifications (Aula futura)
 *     - Admin                          → painel admin (Aula futura)
 *
 * Funcionalidades disponíveis hoje:
 *   - Landing (/)          — pública
 *   - Feed (/feed)         — pública (placeholder)
 *   - Buscar (/search)     — pública (placeholder)
 *   - Meu Perfil           — logado (funcional desde Aula 05)
 *   - Perfil Público       — pública (via navbar/links diretos)
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
        <i class="bi bi-search me-2" />Buscar Receitas
      </router-link>

      <!-- Links visíveis apenas quando logado -->
      <template v-if="authStore.isAuthenticated">
        <hr class="sidebar-divider" />
        <router-link class="sidebar-link" to="/recipes/upload">
          <i class="bi bi-plus-circle me-2" />Nova Receita
        </router-link>
        <router-link class="sidebar-link" to="/my-recipes">
          <i class="bi bi-book me-2" />Minhas Receitas
        </router-link>
        <router-link class="sidebar-link" to="/my-lists">
          <i class="bi bi-heart me-2" />Minhas Listas
        </router-link>
        <router-link class="sidebar-link" to="/profile/me">
          <i class="bi bi-person-circle me-2" />Meu Perfil
        </router-link>
        <router-link class="sidebar-link" to="/notifications">
          <i class="bi bi-bell me-2" />Notificações
        </router-link>
      </template>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  min-height: calc(100vh - 56px);
  background-color: #f8f9fa;
  border-right: 1px solid #dee2e6;
  flex-shrink: 0;
}

.sidebar-link {
  display: flex;
  align-items: center;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  color: #495057;
  text-decoration: none;
  font-size: 1.25rem;
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
</style>
