<script setup>
/**
 * TheNavbar — barra de navegação principal.
 * Usa useAuth() (Aula 06) em vez de importar useAuthStore() diretamente.
 *
 * Links presentes:
 *   Público:       Feed, Buscar
 *   Logado:        Meu Perfil, username, Sair
 *   Deslogado:     Entrar, Cadastrar
 *
 * Links intencionalmente ausentes nesta barra (dependem de funcionalidades
 * ainda não construídas — serão adicionados nas aulas correspondentes):
 *   - Nova Receita  → tela de upload (Aula futura: módulo recipes)
 *   - Notificações  → módulo de notificações (Aula futura)
 *   - Admin         → painel administrativo (Aula futura)
 */
import { useAuth } from '../../composables/useAuth'

const { authStore, logout } = useAuth()
</script>

<template>
  <header class="navbar navbar-expand-md navbar-dark px-4 py-2" style="background-color: var(--brand-color); font-size: 1.35rem;">
    <router-link class="navbar-brand fw-bold fs-4" to="/">
      <i class="bi bi-egg-fried me-2" />RecipeMaster
    </router-link>

    <nav class="ms-auto d-flex align-items-center gap-3">
      <router-link class="nav-link text-white" to="/feed">
        <i class="bi bi-grid me-1" />Feed
      </router-link>
      <router-link class="nav-link text-white" to="/search">
        <i class="bi bi-search me-1" />Buscar
      </router-link>

      <template v-if="authStore.isAuthenticated">
        <router-link class="nav-link text-white" to="/profile/me">
          <i class="bi bi-person-circle me-1" />Meu Perfil
        </router-link>
        <span class="text-white small opacity-75">@{{ authStore.user?.username }}</span>
        <button class="btn btn-outline-light" @click="logout">
          <i class="bi bi-box-arrow-right me-1" />Sair
        </button>
      </template>

      <template v-else>
        <router-link class="btn btn-outline-light" to="/login">
          <i class="bi bi-box-arrow-in-right me-1" />Entrar
        </router-link>
        <router-link class="btn btn-outline-light" to="/register">
          <i class="bi bi-person-plus me-1" />Cadastrar
        </router-link>
      </template>
    </nav>
  </header>
</template>
