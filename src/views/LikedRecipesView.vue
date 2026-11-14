<script setup>
import { ref, onMounted } from 'vue'
import { getLikedRecipes } from '../services/likeService'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const recipes   = ref([])
const isLoading = ref(true)
const errorMsg  = ref('')

onMounted(async () => {
  try {
    const response = await getLikedRecipes()
    recipes.value = response.data.recipes
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-5" style="color: var(--brand-color)">
      <i class="bi bi-heart-fill me-2" />Receitas Curtidas
    </h2>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receitas curtidas...
    </div>

    <div v-else-if="errorMsg" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ errorMsg }}
    </div>

    <div v-else-if="recipes.length === 0" class="empty-state">
      <i class="bi bi-heart empty-icon" />
      <p class="empty-text">Você ainda não curtiu nenhuma receita.</p>
      <router-link to="/feed" class="btn btn-brand px-4">
        <i class="bi bi-grid me-2" />Explorar receitas
      </router-link>
    </div>

    <div v-else class="recipe-grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  gap: 1rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  color: #ccc;
}

.empty-text {
  font-size: 1.1rem;
  color: #888;
  margin: 0;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 320px));
  gap: 1.5rem;
}
</style>
