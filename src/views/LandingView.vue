<script setup>
import { ref, onMounted } from 'vue'
import { getApiStatus } from '../services/systemService'

const apiStatus = ref('verificando...')

onMounted(async () => {
  try {
    const response = await getApiStatus()
    apiStatus.value = response.data.status
  } catch (error) {
    apiStatus.value = 'offline'
    console.error('Erro ao consultar a API:', error.message)
  }
})
</script>

<template>
  <div class="landing text-center py-5 px-3">
    <h1 class="landing-title">🍽️ Bem-vindo ao RecipeMaster</h1>
    <p class="landing-sub">Descubra, compartilhe e favorite as melhores receitas.</p>
    <p class="landing-status">
      Status da API: <strong :style="{ color: apiStatus === 'online' ? '#2a9d5c' : '#e25822' }">{{ apiStatus }}</strong>
    </p>
    <div class="d-flex justify-content-center gap-3 mt-4">
      <router-link to="/register" class="btn btn-brand btn-lg px-4">Criar conta</router-link>
      <router-link to="/feed" class="btn btn-outline-secondary btn-lg px-4">Explorar receitas</router-link>
    </div>
  </div>
</template>

<style scoped>
.landing {
  max-width: 700px;
  margin: 4rem auto;
}

.landing-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--brand-color);
  white-space: nowrap;
}

.landing-sub {
  font-size: 1.4rem;
  color: #555;
  margin-bottom: 0.5rem;
}

.landing-status {
  font-size: 1.2rem;
  color: #444;
}
</style>
