<script setup>
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-brand">
      <router-link to="/">🍽️ RecipeMaster</router-link>
    </div>
    <nav class="navbar-nav">
      <router-link to="/feed">Feed</router-link>
      <router-link to="/search">Buscar</router-link>
      <template v-if="authStore.isAuthenticated">
        <router-link to="/profile/me">Meu Perfil</router-link>
        <span class="navbar-username">{{ authStore.user?.username }}</span>
        <button class="btn-logout" @click="handleLogout">Sair</button>
      </template>
      <template v-else>
        <router-link to="/login">Entrar</router-link>
        <router-link to="/register">Cadastrar</router-link>
      </template>
    </nav>
  </header>
</template>
