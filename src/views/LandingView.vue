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
  <div class="landing">
    <h1>🍽️ Bem-vindo ao RecipeMaster</h1>
    <p>Descubra, compartilhe e favorite as melhores receitas.</p>
    <p class="api-status">Status da API: <strong>{{ apiStatus }}</strong></p>
    <div class="landing-actions">
      <router-link to="/register" class="btn btn-primary">Criar conta</router-link>
      <router-link to="/feed" class="btn btn-secondary">Explorar receitas</router-link>
    </div>
  </div>
</template>
