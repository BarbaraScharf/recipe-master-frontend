<script setup>
/**
 * RecipeDetailView — tela de detalhe de uma receita (Grupo B).
 *
 * isOwner: recebido da API, guardado no estado da tela.
 * Ainda sem uso visual nesta aula — será usado na Aula 09
 * para mostrar botões de editar/deletar apenas ao dono.
 *
 * Por que <img> aponta para o arquivo estático e não para uma rota autenticada?
 * A tag <img> não consegue enviar o header Authorization, por isso a imagem
 * precisa ser servida via express.static (sem token), no caminho /uploads/recipes/.
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRecipeById } from '../services/recipeService'
import { getRecipeImageUrl, getProfilePictureUrl } from '../utils/media'

const route  = useRoute()
const router = useRouter()

const recipe    = ref(null)
const isOwner   = ref(false)
const isLoading = ref(true)
const errorMsg  = ref('')

onMounted(async () => {
  try {
    const response   = await getRecipeById(route.params.id)
    recipe.value     = response.data
    isOwner.value    = response.data.isOwner
  } catch (err) {
    errorMsg.value = err.message || 'Receita não encontrada.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="container py-4" style="max-width: 860px;">

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receita...
    </div>

    <div v-else-if="errorMsg" class="text-center py-5">
      <i class="bi bi-exclamation-circle text-danger" style="font-size:3rem;" />
      <p class="mt-3 text-danger fw-semibold">{{ errorMsg }}</p>
      <button class="btn btn-brand mt-2" @click="router.back()">
        <i class="bi bi-arrow-left me-2" />Voltar
      </button>
    </div>

    <div v-else-if="recipe" style="font-size: 0.9rem;">

      <!-- Imagem principal -->
      <div class="recipe-detail-img-wrapper mb-3" v-if="getRecipeImageUrl(recipe.image)">
        <img :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" class="recipe-detail-img" />
      </div>

      <!-- Cabeçalho -->
      <span class="badge mb-2" style="background-color: var(--brand-color);">{{ recipe.category }}</span>
      <h2 class="fw-bold mb-1">{{ recipe.title }}</h2>
      <p v-if="recipe.description" class="text-muted mb-2">{{ recipe.description }}</p>

      <!-- Meta -->
      <div class="d-flex gap-3 mb-3 text-muted small">
        <span v-if="recipe.prepTime"><i class="bi bi-clock me-1" />{{ recipe.prepTime }} min</span>
        <span v-if="recipe.servings"><i class="bi bi-people me-1" />{{ recipe.servings }} porções</span>
        <span><i class="bi bi-eye me-1" />{{ recipe.viewsCount }} visualizações</span>
        <span><i class="bi bi-heart me-1" />{{ recipe.likesCount }} curtidas</span>
      </div>

      <!-- Autor -->
      <div class="d-flex align-items-center gap-2 mb-3 p-2 rounded-3 bg-light">
        <img :src="getProfilePictureUrl(recipe.author?.profilePicture)" :alt="recipe.author?.username"
          class="rounded-circle" style="width:40px; height:40px; object-fit:cover; border:2px solid var(--brand-color);" />
        <div>
          <p class="mb-0 fw-semibold">{{ recipe.author?.fullName || recipe.author?.username }}</p>
          <p class="mb-0 text-muted small">@{{ recipe.author?.username }}</p>
        </div>
      </div>

      <!-- Ingredientes -->
      <div class="recipe-section mb-3">
        <h6 class="recipe-section-title"><i class="bi bi-list-ul me-2" />Ingredientes</h6>
        <div class="recipe-section-content">{{ recipe.ingredients }}</div>
      </div>

      <!-- Modo de preparo -->
      <div class="recipe-section mb-3">
        <h6 class="recipe-section-title"><i class="bi bi-journal-text me-2" />Modo de Preparo</h6>
        <div class="recipe-section-content">{{ recipe.instructions }}</div>
      </div>

      <!-- Botão voltar -->
      <button class="btn btn-brand mt-3" @click="router.back()">
        <i class="bi bi-arrow-left me-2" />Voltar ao Feed
      </button>

    </div>
  </div>
</template>

<style scoped>
.recipe-detail-img-wrapper {
  width: 100%;
  max-height: 380px;
  overflow: hidden;
  border-radius: 14px;
}

.recipe-detail-img {
  width: 100%;
  max-height: 380px;
  object-fit: cover;
  display: block;
}

.recipe-section {
  background: #fafafa;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  border-left: 4px solid var(--brand-color);
}

.recipe-section-title {
  font-weight: 700;
  color: var(--brand-color);
  margin-bottom: 0.5rem;
}

.recipe-section-content {
  white-space: pre-line;
  line-height: 1.6;
  color: #333;
}
</style>
