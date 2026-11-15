<script setup>
import { getFollowingRecipes } from '../services/followService'
import { usePaginatedList } from '../composables/usePaginatedList'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const {
  items: recipes, isLoading, isLoadingMore, error: errorMsg, loadMoreError, hasMore, loadMore,
} = usePaginatedList((page, limit) => getFollowingRecipes(page, limit))
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

      <div v-if="hasMore" class="text-center mt-4">
        <button
          class="btn btn-brand btn-lg px-5"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
      <p v-if="loadMoreError" class="text-center text-danger mt-3 small">{{ loadMoreError }}</p>
      <p v-else-if="!hasMore" class="text-center text-muted mt-4 small">Você viu todas as receitas.</p>
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


