<script setup>
/**
 * RecipeCard — card reutilizável para a grade do Feed.
 * Ao clicar navega para /recipes/:id sem recarregar a página (Vue Router).
 *
 * Props:
 *   recipe — objeto com id, title, category, image, prepTime, servings, author
 */
import { useRouter } from 'vue-router'
import { getRecipeImageUrl } from '../../utils/media'

defineOptions({ name: 'RecipeCard' })

const props = defineProps({
  recipe: { type: Object, required: true }
})

const router = useRouter()

function goToDetail() {
  router.push({ name: 'recipe-detail', params: { id: props.recipe.id } })
}
</script>

<template>
  <div class="recipe-card" @click="goToDetail" role="button" tabindex="0"
    @keydown.enter="goToDetail">

    <!-- Imagem -->
    <div class="recipe-card-img-wrapper">
      <img
        v-if="getRecipeImageUrl(recipe.image)"
        :src="getRecipeImageUrl(recipe.image)"
        :alt="recipe.title"
        class="recipe-card-img"
      />
      <div v-else class="recipe-card-img-placeholder">
        <i class="bi bi-image text-muted" style="font-size:2rem;" />
      </div>
    </div>

    <!-- Info -->
    <div class="recipe-card-body">
      <span class="recipe-card-category">{{ recipe.category }}</span>
      <h3 class="recipe-card-title">{{ recipe.title }}</h3>

      <div class="recipe-card-meta">
        <span v-if="recipe.prepTime">
          <i class="bi bi-clock me-1" />{{ recipe.prepTime }} min
        </span>
        <span v-if="recipe.servings">
          <i class="bi bi-people me-1" />{{ recipe.servings }} porções
        </span>
      </div>

      <div class="recipe-card-author" v-if="recipe.author">
        <i class="bi bi-person-circle me-1" />{{ recipe.author.username }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.recipe-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.09);
  cursor: pointer;
  transition: transform 0.18s, box-shadow 0.18s;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(226,88,34,0.18);
}

.recipe-card-img-wrapper {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.recipe-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}

.recipe-card-body {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.recipe-card-category {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--brand-color);
}

.recipe-card-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #222;
  margin: 0;
  line-height: 1.3;
}

.recipe-card-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #777;
}

.recipe-card-author {
  font-size: 0.85rem;
  color: #999;
  margin-top: auto;
}
</style>
