<script setup>
import { ref, onMounted } from 'vue'
import { getFollowingRecipes } from '../services/followService'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const recipes = ref([])
const isLoading = ref(true)
const isLoadingMore = ref(false)
const errorMsg = ref('')
const currentPage = ref(1)
const totalPages = ref(0)
const LIMIT = 3

async function loadRecipes(page = 1) {
  errorMsg.value = ''
  try {
    const response = await getFollowingRecipes(page, LIMIT)
    if (page === 1) {
      recipes.value = response.data.recipes
    } else {
      recipes.value.push(...response.data.recipes)
    }
    currentPage.value = page
    totalPages.value = response.data.totalPages
  } catch (error) {
    errorMsg.value = error.message
  }
}

onMounted(async () => {
  await loadRecipes()
  isLoading.value = false
})

async function loadMore() {
  if (isLoadingMore.value || currentPage.value >= totalPages.value) return
  isLoadingMore.value = true
  await loadRecipes(currentPage.value + 1)
  isLoadingMore.value = false
}
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4" style="color: var(--brand-color)">
      <i class="bi bi-people me-2" />Receitas de quem sigo
    </h2>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receitas...
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger" role="alert">
      <i class="bi bi-exclamation-circle me-2" />{{ errorMsg }}
    </div>

    <div v-else-if="recipes.length === 0" class="empty-state">
      <i class="bi bi-people empty-icon" />
      <p class="empty-text">Nenhuma receita de quem você segue por enquanto.</p>
      <router-link to="/feed" class="btn btn-brand px-4">
        <i class="bi bi-grid me-2" />Explorar receitas
      </router-link>
    </div>

    <template v-else>
      <div class="recipe-grid">
        <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
      </div>

      <div v-if="currentPage < totalPages" class="text-center mt-4">
        <button
          class="btn btn-brand btn-lg px-5"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
      <p v-else class="text-center text-muted mt-4 small">Você viu todas as receitas.</p>
    </template>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 45vh;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  color: #ccc;
  font-size: 4rem;
}

.empty-text {
  margin: 0;
  color: #888;
  font-size: 1.1rem;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
