<script setup>
import { getFeed } from '../services/userService'
import { usePaginatedList } from '../composables/usePaginatedList'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const {
  items: recipes, isLoading, isLoadingMore, error: errorMsg, loadMoreError, hasMore, loadMore,
} = usePaginatedList((page, limit) => getFeed(page, limit))
</script>

<template>
  <div class="container py-4">
    <h2 class="fw-bold mb-4" style="color: var(--brand-color)">
      <i class="bi bi-grid me-2" />Feed de Receitas
    </h2>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receitas...
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ errorMsg }}
    </div>

    <div v-else-if="recipes.length === 0" class="text-center py-5 text-muted">
      <i class="bi bi-journal-x" style="font-size:3rem;" />
      <p class="mt-3">Nenhuma receita publicada ainda. Seja o primeiro!</p>
    </div>

    <div v-else>
      <!-- Grade de cards -->
      <div class="recipe-grid">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <!-- Botão Carregar mais -->
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

      <p v-else-if="!hasMore" class="text-center text-muted mt-4 small">
        Você viu todas as receitas disponíveis.
      </p>
    </div>
  </div>
</template>

<style scoped>
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>


