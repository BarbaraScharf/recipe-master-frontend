<script setup>
/**
 * ListDetailView — detalhe de uma lista.
 * Pública: qualquer pessoa vê. Privada: só a dona; os outros veem a mensagem do 403 na tela.
 * "Remover da lista" é pessimista: espera a API e só depois tira o cartão.
 */
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getListById, removeRecipeFromList } from '../../services/listService'
import { useAsyncData } from '../../composables/useAsyncData'
import { useToast } from '../../composables/useToast'
import { useAuth } from '../../composables/useAuth'
import { getProfilePictureUrl } from '../../utils/media'
import RecipeCard from '../../components/recipe/RecipeCard.vue'

const route = useRoute()
const toast = useToast()

const { authStore } = useAuth()

const { data: list, isLoading, error, errorStatus } = useAsyncData(
  () => getListById(route.params.id),
  { watch: () => route.params.id }
)

// Texto da tela de erro conforme o status que a API devolveu
const errorView = computed(() => {
  if (errorStatus.value === 403) {
    return {
      icon: 'bi-lock-fill',
      title: 'Lista privada',
      text: 'Só a dona desta lista pode ver as receitas que estão nela.',
    }
  }
  if (errorStatus.value === 404 || errorStatus.value === 400) {
    return {
      icon: 'bi-search',
      title: 'Lista não encontrada',
      text: 'Ela pode ter sido excluída, ou o link está errado.',
    }
  }
  return {
    icon: 'bi-wifi-off',
    title: 'Não foi possível carregar a lista',
    text: error.value,
  }
})

// Cópia local, para tirar o cartão depois de remover
const recipes = ref([])
watch(list, (value) => { recipes.value = value?.recipes ?? [] })

const isOwner = computed(() => list.value?.isOwner === true)
const removingId = ref(null)

async function removeRecipe(recipe) {
  if (removingId.value) return
  removingId.value = recipe.id
  try {
    const response = await removeRecipeFromList(list.value.id, recipe.id)
    recipes.value = recipes.value.filter((r) => r.id !== recipe.id)
    list.value.recipesCount = response.data.recipesCount
    toast.success('Receita removida da lista.')
  } catch {
    // toast de erro já mostrado pelo interceptor; o cartão continua na tela
  } finally {
    removingId.value = null
  }
}
</script>

<template>
  <div class="container py-5">
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando lista...
    </div>

    <!-- 403 (privada) e 404 (não encontrada) aparecem aqui, sem toast -->
    <div v-else-if="error" class="state-card">
      <div class="state-icon">
        <i class="bi" :class="errorView.icon" />
      </div>
      <h4 class="state-title">{{ errorView.title }}</h4>
      <p class="state-text">{{ errorView.text }}</p>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <template v-if="authStore.isAuthenticated">
          <router-link :to="{ name: 'my-lists' }" class="btn btn-brand">
            <i class="bi bi-collection me-2" />Minhas Listas
          </router-link>
          <router-link :to="{ name: 'feed' }" class="btn btn-outline-secondary">
            <i class="bi bi-grid me-2" />Ir para o Feed
          </router-link>
        </template>
        <template v-else>
          <router-link :to="{ name: 'login', query: { redirect: route.fullPath } }" class="btn btn-brand">
            <i class="bi bi-box-arrow-in-right me-2" />Entrar
          </router-link>
          <router-link :to="{ name: 'landing' }" class="btn btn-outline-secondary">
            <i class="bi bi-house me-2" />Ir para o início
          </router-link>
        </template>
      </div>
    </div>

    <template v-else-if="list">
      <router-link v-if="isOwner" :to="{ name: 'my-lists' }" class="back-link">
        <i class="bi bi-arrow-left me-1" />Minhas Listas
      </router-link>

      <!-- Cabeçalho da lista -->
      <div class="list-header" :class="list.isPublic ? 'header-public' : 'header-private'">
        <div class="list-header-icon">
          <i class="bi bi-collection-fill" />
        </div>
        <div class="list-header-info">
          <span class="list-badge">
            <i class="bi me-1" :class="list.isPublic ? 'bi-globe' : 'bi-lock-fill'" />{{ list.isPublic ? 'Lista pública' : 'Lista privada' }}
          </span>
          <h2 class="list-header-title">{{ list.title }}</h2>
          <p v-if="list.description" class="list-header-description">{{ list.description }}</p>
          <div class="list-header-meta">
            <router-link
              v-if="list.owner"
              :to="{ name: 'public-profile', params: { username: list.owner.username } }"
              class="owner-chip"
            >
              <img :src="getProfilePictureUrl(list.owner.profilePicture, list.owner.fullName || list.owner.username)" :alt="list.owner.username" class="owner-avatar" />
              <span>{{ list.owner.fullName || list.owner.username }}</span>
            </router-link>
            <span class="meta-pill">
              <i class="bi bi-journal-text me-1" />{{ list.recipesCount === 1 ? '1 receita' : `${list.recipesCount} receitas` }}
            </span>
          </div>
        </div>
      </div>
      <div v-if="recipes.length === 0" class="empty-list">
        <i class="bi bi-journal-x" style="font-size: 3rem;" />
        <p v-if="isOwner" class="mt-3">Sua lista ainda está vazia. Abra uma receita e use o botão <strong>Salvar</strong> para colocá-la aqui.</p>
        <p v-else class="mt-3">Esta lista ainda não tem receitas.</p>
      </div>

      <div v-else class="recipe-grid">
        <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe">
          <template v-if="isOwner" #actions>
            <button class="btn btn-sm btn-outline-danger w-100" :disabled="removingId === recipe.id" @click="removeRecipe(recipe)">
              <span v-if="removingId === recipe.id" class="spinner-border spinner-border-sm me-1" />
              <i v-else class="bi bi-x-circle me-1" />Remover da lista
            </button>
          </template>
        </RecipeCard>
      </div>
    </template>
  </div>
</template>

<style scoped>
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.state-card {
  max-width: 460px;
  margin: 3rem auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.state-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 1.25rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
}
.state-title {
  font-weight: 700;
  color: #222;
  margin-bottom: 0.5rem;
}
.state-text {
  color: #777;
  margin-bottom: 1.5rem;
}
.back-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 1rem;
  color: #777;
  font-size: 0.92rem;
  text-decoration: none;
}
.back-link:hover {
  color: var(--brand-color);
}
.list-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.75rem 2rem;
  margin-bottom: 2rem;
  border-radius: 18px;
}
.header-public {
  background: linear-gradient(135deg, #fff3ec, #ffd9c6);
}
.header-private {
  background: linear-gradient(135deg, #f4f5f7, #e2e5e9);
}
.list-header-icon {
  flex-shrink: 0;
  width: 96px;
  height: 96px;
  border-radius: 20px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.8rem;
  color: var(--brand-color);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}
.header-private .list-header-icon {
  color: #6c757d;
}
.list-header-info {
  min-width: 0;
}
.list-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.85);
  color: #555;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 50px;
  margin-bottom: 0.5rem;
}
.list-header-title {
  font-weight: 800;
  color: #222;
  margin-bottom: 0.35rem;
  word-break: break-word;
}
.list-header-description {
  color: #666;
  margin-bottom: 0.75rem;
}
.list-header-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.owner-chip,
.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 50px;
  padding: 0.25rem 0.8rem 0.25rem 0.3rem;
  font-size: 0.88rem;
  color: #444;
  text-decoration: none;
}
.meta-pill {
  padding-left: 0.8rem;
}
.owner-chip:hover {
  color: var(--brand-color);
}
.empty-list {
  text-align: center;
  padding: 3rem 1rem;
  color: #888;
  background: #fff;
  border: 2px dashed #eee;
  border-radius: 16px;
}
@media (max-width: 576px) {
  .list-header {
    flex-direction: column;
    text-align: center;
  }
  .list-header-meta {
    justify-content: center;
  }
}
.owner-avatar {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
}
</style>



