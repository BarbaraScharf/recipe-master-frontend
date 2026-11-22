<script setup>
/**
 * RecipeDetailView — tela de detalhe de uma receita (Grupo B).
 * Aula 10: botão de curtir (LikeButton) e seção de comentários (CommentSection).
 */
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRecipeById } from '../services/recipeService'
import { useAsyncData } from '../composables/useAsyncData'
import { useAuthenticatedAction } from '../composables/useAuthenticatedAction'
import { getRecipeImageUrl, getProfilePictureUrl } from '../utils/media'
import LikeButton     from '../components/recipe/LikeButton.vue'
import CommentSection from '../components/recipe/CommentSection.vue'
import AddToListModal from '../components/list/AddToListModal.vue'

const route  = useRoute()
const router = useRouter()

// Recarrega sozinho quando o id da rota muda
const { data: recipe, isLoading, error: errorMsg } = useAsyncData(
  () => getRecipeById(route.params.id),
  { watch: () => route.params.id }
)

const isOwner = ref(false)
const isLiked = ref(false)

watch(recipe, (value) => {
  isOwner.value = value?.isOwner ?? false
  isLiked.value = value?.isLiked ?? false
})
// Botão Salvar: visitante vai para o login (com redirect) e volta para a receita
const isSaveModalOpen = ref(false)
const { run: openSaveModal, isBusy: isOpeningSave } = useAuthenticatedAction(async () => {
  isSaveModalOpen.value = true
})

function onCommentAdded() {
  if (recipe.value) recipe.value.commentsCount++
}
</script>

<template>
  <div class="container py-4 detail-page">
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receita...
    </div>

    <div v-else-if="errorMsg" class="state-card">
      <div class="state-icon"><i class="bi bi-journal-x" /></div>
      <h4 class="fw-bold mb-2">Receita não encontrada</h4>
      <p class="text-muted mb-4">{{ errorMsg }}</p>
      <button class="btn btn-brand" @click="router.back()">
        <i class="bi bi-arrow-left me-2" />Voltar
      </button>
    </div>

    <div v-else-if="recipe">
      <button class="back-link" @click="router.back()">
        <i class="bi bi-arrow-left me-1" />Voltar
      </button>

      <!-- Capa: foto da receita, ou um fundo na cor da marca quando não tem foto -->
      <div class="recipe-cover">
        <img v-if="getRecipeImageUrl(recipe.image)" :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" class="recipe-cover-img" />
        <div v-else class="recipe-cover-placeholder">
          <i class="bi bi-egg-fried" />
        </div>
      </div>

      <!-- Cartão principal -->
      <div class="recipe-main-card">
        <span class="category-badge">{{ recipe.category }}</span>
        <h1 class="recipe-title">{{ recipe.title }}</h1>
        <p v-if="recipe.description" class="recipe-description">{{ recipe.description }}</p>

        <div class="recipe-meta">
          <span v-if="recipe.prepTime" class="meta-pill"><i class="bi bi-clock" />{{ recipe.prepTime }} min</span>
          <span v-if="recipe.servings" class="meta-pill"><i class="bi bi-people" />{{ recipe.servings }} {{ recipe.servings === 1 ? 'porção' : 'porções' }}</span>
          <span class="meta-pill"><i class="bi bi-eye" />{{ recipe.viewsCount }} visualizações</span>
          <span class="meta-pill"><i class="bi bi-chat-dots" />{{ recipe.commentsCount }} {{ recipe.commentsCount === 1 ? 'comentário' : 'comentários' }}</span>
        </div>

        <div class="recipe-footer">
          <!-- Autor clicável -->
          <router-link
            v-if="recipe.author"
            :to="{ name: 'public-profile', params: { username: recipe.author.username } }"
            class="author-chip"
          >
            <img :src="getProfilePictureUrl(recipe.author?.profilePicture, recipe.author?.fullName || recipe.author?.username)" :alt="recipe.author?.username" class="author-avatar" />
            <div class="text-start">
              <div class="author-name">{{ recipe.author?.fullName || recipe.author?.username }}</div>
              <div class="author-username">@{{ recipe.author?.username }}</div>
            </div>
          </router-link>

          <!-- Ações -->
          <div class="recipe-actions">
            <LikeButton
              :recipe-id="recipe.id"
              v-model:liked="isLiked"
              v-model:likes-count="recipe.likesCount"
            />
            <!-- Botão Salvar (Aula 13) -->
            <button class="btn btn-action" :disabled="isOpeningSave" @click="openSaveModal">
              <i class="bi bi-bookmark-plus me-2" />Salvar
            </button>
            <!-- Botão Editar — só visível para o dono -->
            <router-link
              v-if="isOwner"
              :to="{ name: 'recipe-edit', params: { id: recipe.id } }"
              class="btn btn-action"
            >
              <i class="bi bi-pencil me-2" />Editar
            </router-link>
          </div>
        </div>
      </div>

      <!-- Ingredientes e modo de preparo: lado a lado na tela grande, um embaixo do outro no celular -->
      <div class="recipe-sections">
        <section class="recipe-section">
          <h5 class="recipe-section-title"><span class="section-icon"><i class="bi bi-basket" /></span>Ingredientes</h5>
          <div class="recipe-section-content">{{ recipe.ingredients }}</div>
        </section>
        <section class="recipe-section">
          <h5 class="recipe-section-title"><span class="section-icon"><i class="bi bi-fire" /></span>Modo de preparo</h5>
          <div class="recipe-section-content">{{ recipe.instructions }}</div>
        </section>
      </div>

      <!-- Seção de comentários -->
      <div class="comments-card">
        <CommentSection
          :recipe-id="recipe.id"
          @comment-added="onCommentAdded"
        />
      </div>

      <AddToListModal
        v-if="isSaveModalOpen"
        :recipe-id="recipe.id"
        @close="isSaveModalOpen = false"
      />
    </div>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 980px;
}
.back-link {
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 1rem;
  color: #777;
  font-size: 0.92rem;
}
.back-link:hover {
  color: var(--brand-color);
}
.recipe-cover {
  width: 100%;
  height: 340px;
  border-radius: 18px;
  overflow: hidden;
}
.recipe-cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.recipe-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #fff3ec, #ffc4a8);
  color: var(--brand-color);
  font-size: 5rem;
}
.recipe-main-card {
  position: relative;
  margin: -70px 1.5rem 1.5rem;
  padding: 1.75rem 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}
.category-badge {
  display: inline-block;
  background: var(--brand-color);
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.3rem 0.8rem;
  border-radius: 50px;
  margin-bottom: 0.75rem;
}
.recipe-title {
  font-size: 2rem;
  font-weight: 800;
  color: #222;
  margin-bottom: 0.4rem;
  word-break: break-word;
}
.recipe-description {
  color: #666;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}
.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}
.meta-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: #f6f6f6;
  color: #555;
  font-size: 0.88rem;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
}
.meta-pill i {
  color: var(--brand-color);
}
.recipe-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 1.25rem;
  border-top: 1px solid #f0f0f0;
}
.author-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}
.author-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-color);
}
.author-name {
  font-weight: 700;
  color: #222;
}
.author-chip:hover .author-name {
  color: var(--brand-color);
}
.author-username {
  font-size: 0.85rem;
  color: #999;
}
.recipe-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}
.btn-action {
  border: 2px solid #e9ecef;
  border-radius: 50px;
  background: #fff;
  color: #555;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.45rem 1.1rem;
}
.btn-action:hover {
  border-color: var(--brand-color);
  color: var(--brand-color);
}
.recipe-sections {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.25rem;
  margin: 0 1.5rem 2rem;
}
.recipe-section {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.recipe-section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 1rem;
}
.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #fff0eb;
  color: var(--brand-color);
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.recipe-section-content {
  white-space: pre-line;
  line-height: 1.75;
  color: #333;
}
.comments-card {
  margin: 0 1.5rem;
  padding: 0.5rem 2rem 1.5rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
}
/* Dentro do cartão, os comentários não precisam da linha de cima nem da margem extra */
.comments-card :deep(.comment-section) {
  margin-top: 0;
  border-top: none;
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
@media (max-width: 768px) {
  .recipe-cover {
    height: 220px;
  }
  .recipe-main-card {
    margin: -50px 0.5rem 1.25rem;
    padding: 1.25rem;
  }
  .recipe-title {
    font-size: 1.5rem;
  }
  .recipe-sections {
    grid-template-columns: 1fr;
    margin: 0 0.5rem 1.5rem;
  }
  .comments-card {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem 1rem;
  }
}
</style>
