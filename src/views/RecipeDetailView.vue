<script setup>
/**
 * RecipeDetailView — tela de detalhe de uma receita (Grupo B).
 * Aula 10: botão de curtir (LikeButton) e seção de comentários (CommentSection).
 */
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRecipeById } from '../services/recipeService'
import { getRecipeImageUrl, getProfilePictureUrl } from '../utils/media'
import LikeButton     from '../components/recipe/LikeButton.vue'
import CommentSection from '../components/recipe/CommentSection.vue'

const route  = useRoute()
const router = useRouter()

const recipe    = ref(null)
const isOwner   = ref(false)
const isLiked   = ref(false)
const isLoading = ref(true)
const errorMsg  = ref('')

onMounted(async () => {
  try {
    const response   = await getRecipeById(route.params.id)
    recipe.value     = response.data
    isOwner.value    = response.data.isOwner
    isLiked.value    = response.data.isLiked
  } catch (err) {
    errorMsg.value = err.message || 'Receita não encontrada.'
  } finally {
    isLoading.value = false
  }
})

function onCommentAdded() {
  if (recipe.value) recipe.value.commentsCount++
}
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

    <div v-else-if="recipe" style="font-size: 1rem;">

      <!-- Imagem principal -->
      <div class="recipe-detail-img-wrapper mb-4" v-if="getRecipeImageUrl(recipe.image)">
        <img :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" class="recipe-detail-img" />
      </div>

      <!-- Cabeçalho -->
      <span class="badge mb-2" style="background-color: var(--brand-color); font-size: 0.85rem; padding: 0.4rem 0.8rem;">{{ recipe.category }}</span>
      <h2 class="fw-bold mb-1" style="font-size: 1.8rem;">{{ recipe.title }}</h2>
      <p v-if="recipe.description" class="text-muted mb-3" style="font-size: 1rem;">{{ recipe.description }}</p>

      <!-- Meta -->
      <div class="d-flex gap-3 mb-4 text-muted flex-wrap" style="font-size: 0.95rem;">
        <span v-if="recipe.prepTime"><i class="bi bi-clock me-1" />{{ recipe.prepTime }} min</span>
        <span v-if="recipe.servings"><i class="bi bi-people me-1" />{{ recipe.servings }} porções</span>
        <span><i class="bi bi-eye me-1" />{{ recipe.viewsCount }} visualizações</span>
        <span><i class="bi bi-chat-dots me-1" />{{ recipe.commentsCount }} comentários</span>
      </div>

      <!-- Autor clicável -->
      <router-link
        v-if="recipe.author"
        :to="{ name: 'public-profile', params: { username: recipe.author.username } }"
        class="d-flex align-items-center gap-2 mb-3 p-2 rounded-3 bg-light text-decoration-none"
      >
        <img :src="getProfilePictureUrl(recipe.author?.profilePicture, recipe.author?.fullName || recipe.author?.username)" :alt="recipe.author?.username"
          class="rounded-circle" style="width:40px; height:40px; object-fit:cover; border:2px solid var(--brand-color);" />
        <div>
          <p class="mb-0 fw-semibold text-dark">{{ recipe.author?.fullName || recipe.author?.username }}</p>
          <p class="mb-0 text-muted small">@{{ recipe.author?.username }}</p>
        </div>
      </router-link>

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

      <!-- Ações -->
      <div class="d-flex align-items-center gap-3 mt-3 flex-wrap">
        <button class="btn btn-brand" @click="router.back()">
          <i class="bi bi-arrow-left me-2" />Voltar ao Feed
        </button>

        <!-- Botão de curtir -->
        <LikeButton
          :recipe-id="recipe.id"
          v-model:liked="isLiked"
          v-model:likes-count="recipe.likesCount"
        />

        <!-- Botão Editar — só visível para o dono -->
        <router-link
          v-if="isOwner"
          :to="{ name: 'recipe-edit', params: { id: recipe.id } }"
          class="btn btn-outline-secondary"
        >
          <i class="bi bi-pencil me-2" />Editar
        </router-link>
      </div>

      <!-- Seção de comentários -->
      <CommentSection
        :recipe-id="recipe.id"
        @comment-added="onCommentAdded"
      />

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
