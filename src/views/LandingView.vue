<script setup>
import { ref, onMounted } from 'vue'
import { getApiStatus } from '../services/systemService'
import { useAuth } from '../composables/useAuth'

const { authStore } = useAuth()
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
      <!-- Só mostra "Criar conta" quando não está logada -->
      <router-link v-if="!authStore.isAuthenticated" to="/register" class="btn btn-brand btn-lg px-4">Criar conta</router-link>
      <!-- Visitante não acessa o Feed (exige login), então vai para a busca, que é pública -->
      <router-link
        :to="authStore.isAuthenticated ? { name: 'feed' } : { name: 'search' }"
        class="btn btn-outline-secondary btn-lg px-4"
      >
        Explorar receitas
      </router-link>
    </div>

    <div class="landing-features">
      <div class="feature">
        <div class="feature-icon"><i class="bi bi-search" /></div>
        <h6 class="fw-bold mb-1">Encontre</h6>
        <p class="text-muted small mb-0">Busque receitas pelo nome e descubra outros cozinheiros.</p>
      </div>
      <div class="feature">
        <div class="feature-icon"><i class="bi bi-bookmark-heart" /></div>
        <h6 class="fw-bold mb-1">Guarde</h6>
        <p class="text-muted small mb-0">Curta as favoritas e organize tudo em listas suas.</p>
      </div>
      <div class="feature">
        <div class="feature-icon"><i class="bi bi-people" /></div>
        <h6 class="fw-bold mb-1">Acompanhe</h6>
        <p class="text-muted small mb-0">Siga quem você gosta e veja as receitas novas no feed.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-top: 3.5rem;
}
.feature {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 1.25rem 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.feature-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.landing {
  max-width: 760px;
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
