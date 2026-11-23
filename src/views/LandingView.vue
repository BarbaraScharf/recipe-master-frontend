<script setup>
import { ref, computed, onMounted } from 'vue'
import { getApiStatus } from '../services/systemService'
import { useAuth } from '../composables/useAuth'

const { authStore } = useAuth()
const apiStatus = ref('verificando...')

const firstName = computed(() => {
  const name = authStore.user?.fullName || authStore.user?.username || ''
  return name.split(' ')[0]
})

onMounted(async () => {
  try {
    const response = await getApiStatus()
    apiStatus.value = response.data.status
  } catch (error) {
    apiStatus.value = 'offline'
  }
})

const features = [
  { icon: 'bi-search', title: 'Encontre', text: 'Busque receitas pelo nome e descubra outros cozinheiros.' },
  { icon: 'bi-bookmark-heart', title: 'Guarde', text: 'Curta as favoritas e organize tudo em listas suas.' },
  { icon: 'bi-people', title: 'Acompanhe', text: 'Siga quem você gosta e veja as receitas novas no feed.' },
]

// Atalhos para quem já está logado
const shortcuts = [
  { to: { name: 'feed' }, icon: 'bi-grid', label: 'Feed' },
  { to: { name: 'recipe-upload' }, icon: 'bi-plus-circle', label: 'Nova receita' },
  { to: { name: 'my-lists' }, icon: 'bi-collection', label: 'Minhas listas' },
  { to: { name: 'liked-recipes' }, icon: 'bi-heart', label: 'Curtidas' },
]
</script>

<template>
  <div class="home-page">
    <!-- Destaque principal -->
    <section class="hero">
      <div class="hero-icon"><i class="bi bi-egg-fried" /></div>

      <template v-if="authStore.isAuthenticated">
        <h1 class="hero-title">Olá, {{ firstName }}!</h1>
        <p class="hero-sub">O que vamos cozinhar hoje?</p>
        <div class="hero-actions">
          <router-link :to="{ name: 'feed' }" class="btn btn-light btn-lg hero-btn-main">
            <i class="bi bi-grid me-2" />Ver o feed
          </router-link>
          <router-link :to="{ name: 'search' }" class="btn btn-outline-light btn-lg">
            <i class="bi bi-search me-2" />Explorar
          </router-link>
        </div>
      </template>

      <template v-else>
        <h1 class="hero-title">Bem-vindo ao RecipeMaster</h1>
        <p class="hero-sub">Descubra, compartilhe e guarde as melhores receitas.</p>
        <div class="hero-actions">
          <router-link to="/register" class="btn btn-light btn-lg hero-btn-main">
            <i class="bi bi-person-plus me-2" />Criar conta
          </router-link>
          <!-- Visitante não acessa o Feed (exige login), então vai para a busca, que é pública -->
          <router-link :to="{ name: 'search' }" class="btn btn-outline-light btn-lg">
            <i class="bi bi-search me-2" />Explorar receitas
          </router-link>
        </div>
      </template>
    </section>

    <!-- Atalhos (logado) -->
    <section v-if="authStore.isAuthenticated" class="shortcuts">
      <router-link v-for="item in shortcuts" :key="item.label" :to="item.to" class="shortcut">
        <span class="shortcut-icon"><i class="bi" :class="item.icon" /></span>
        <span class="shortcut-label">{{ item.label }}</span>
      </router-link>
    </section>

    <!-- O que dá para fazer -->
    <section class="features">
      <div v-for="feature in features" :key="feature.title" class="feature">
        <div class="feature-icon"><i class="bi" :class="feature.icon" /></div>
        <h6 class="feature-title">{{ feature.title }}</h6>
        <p class="feature-text">{{ feature.text }}</p>
      </div>
    </section>

    <p class="api-status">
      <span class="status-dot" :class="apiStatus === 'online' ? 'dot-online' : 'dot-offline'" />
      API {{ apiStatus }}
    </p>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.hero {
  text-align: center;
  padding: 3rem 1.5rem 2.75rem;
  border-radius: 24px;
  background: linear-gradient(135deg, #f06a35, #c44a1a);
  color: #fff;
  box-shadow: 0 12px 32px rgba(226, 88, 34, 0.3);
}
.hero-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
}
.hero-title {
  font-size: 2.3rem;
  font-weight: 800;
  margin-bottom: 0.4rem;
}
.hero-sub {
  font-size: 1.2rem;
  opacity: 0.92;
  margin-bottom: 1.75rem;
}
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.hero-actions .btn {
  border-radius: 50px;
  font-weight: 600;
  padding-left: 1.6rem;
  padding-right: 1.6rem;
}
.hero-title,
.hero-sub {
  color: #fff;
}
/* o style.css global tem a { color: inherit !important }: sem o !important o texto ficaria branco no botão branco */
.hero-btn-main {
  color: var(--brand-color) !important;
}
.hero-btn-main:hover {
  color: #c44a1a !important;
}
.shortcuts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.shortcut {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.85rem 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: border-color 0.15s, transform 0.15s;
}
.shortcut:hover {
  border-color: var(--brand-color);
  color: var(--brand-color);
  transform: translateY(-2px);
}
.shortcut-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.15rem;
  flex-shrink: 0;
}
.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 2rem;
}
.feature {
  text-align: center;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.feature-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 0.85rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}
.feature-title {
  font-weight: 700;
  margin-bottom: 0.35rem;
}
.feature-text {
  color: #777;
  font-size: 0.92rem;
  margin: 0;
  line-height: 1.5;
}
.api-status {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.85rem;
  color: #999;
}
.status-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 0.35rem;
  vertical-align: middle;
}
.dot-online { background: #2a9d5c; }
.dot-offline { background: #dc3545; }
@media (max-width: 576px) {
  .hero-title {
    font-size: 1.7rem;
  }
}
</style>

