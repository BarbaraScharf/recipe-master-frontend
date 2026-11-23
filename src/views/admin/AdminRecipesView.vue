<script setup>
/**
 * Receitas do painel. Excluir pede confirmação e espera a API:
 * a linha só sai da lista depois do sucesso.
 */
import { ref, computed } from 'vue'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useDebouncedValue } from '../../composables/useDebouncedValue'
import { useToast } from '../../composables/useToast'
import { getAdminRecipes, deleteAdminRecipe } from '../../services/adminService'
import { SEARCH } from '../../config/constants'
import { getRecipeImageUrl } from '../../utils/media'
import { formatDate } from '../../utils/format'
import ConfirmModal from '../../components/base/ConfirmModal.vue'

const toast = useToast()

const typedText = ref('')
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)

const {
  items: recipes, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore,
} = usePaginatedList(
  (page) => getAdminRecipes(term.value.trim(), page, undefined),
  { itemsKey: 'recipes', watch: term }
)

// A receita escolhida é ao mesmo tempo o interruptor do modal e o dado dele
const recipeToDelete = ref(null)
const isDeleting = ref(false)

const deleteMessage = computed(() => recipeToDelete.value
  ? `Excluir "${recipeToDelete.value.title}", de @${recipeToDelete.value.author?.username}?\nVai sumir junto:`
  : '')

const deleteItems = [
  { icon: 'bi-heart', label: 'Curtidas' },
  { icon: 'bi-chat-dots', label: 'Comentários' },
  { icon: 'bi-flag', label: 'Denúncias' },
  { icon: 'bi-bell', label: 'Notificações' },
  { icon: 'bi-collection', label: 'Listas de quem salvou' },
  { icon: 'bi-image', label: 'A foto da receita' },
]

function pendingLabel(count) {
  return count === 1 ? '1 denúncia pendente' : `${count} denúncias pendentes`
}

async function confirmDelete() {
  if (!recipeToDelete.value || isDeleting.value) return
  isDeleting.value = true
  try {
    const response = await deleteAdminRecipe(recipeToDelete.value.id)
    recipes.value = recipes.value.filter((recipe) => recipe.id !== recipeToDelete.value.id)
    toast.success(response.message)
    recipeToDelete.value = null
  } catch {
    // o toast de erro já veio do interceptor; o modal continua aberto
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div>
    <div class="search-box mb-3">
      <i class="bi bi-search search-icon" />
      <input
        v-model="typedText"
        type="search"
        class="form-control search-input"
        placeholder="Buscar receitas pelo título"
        aria-label="Buscar receitas"
      />
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receitas...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="recipes.length === 0" class="empty-box">
      <p class="mb-0">Nenhuma receita encontrada.</p>
    </div>

    <template v-else>
      <ul class="list-unstyled admin-list">
        <li v-for="recipe in recipes" :key="recipe.id" class="admin-row">
          <router-link :to="{ name: 'recipe-detail', params: { id: recipe.id } }" class="thumb">
            <img v-if="getRecipeImageUrl(recipe.image)" :src="getRecipeImageUrl(recipe.image)" :alt="recipe.title" />
            <i v-else class="bi bi-egg-fried" />
          </router-link>

          <div class="row-body">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <router-link :to="{ name: 'recipe-detail', params: { id: recipe.id } }" class="row-title">
                {{ recipe.title }}
              </router-link>
              <span v-if="recipe.pendingReportsCount > 0" class="badge bg-danger">
                <i class="bi bi-flag-fill me-1" />{{ pendingLabel(recipe.pendingReportsCount) }}
              </span>
            </div>
            <div class="row-meta">
              de @{{ recipe.author?.username }} · {{ recipe.category }} · {{ formatDate(recipe.createdAt) }}
            </div>
          </div>

          <button class="btn btn-sm btn-outline-danger row-action" @click="recipeToDelete = recipe">
            <i class="bi bi-trash me-1" />Excluir
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button class="btn btn-brand px-4" :disabled="isLoadingMore" @click="loadMore">
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
      <p v-if="loadMoreError" class="text-center text-danger mt-3 small">{{ loadMoreError }}</p>
    </template>

    <ConfirmModal
      v-if="recipeToDelete"
      title="Excluir receita"
      :message="deleteMessage"
      confirm-label="Excluir"
      icon="bi-trash3"
      :items="deleteItems"
      warning="Isso não pode ser desfeito."
      :busy="isDeleting"
      @confirm="confirmDelete"
      @close="recipeToDelete = null"
    />
  </div>
</template>

<style scoped>
.search-box {
  position: relative;
  max-width: 480px;
}
.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
.search-input {
  padding-left: 2.4rem;
  border-radius: 50px;
}
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.admin-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.8rem 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
}
.thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #fff3ec, #ffd9c6);
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.row-body {
  flex: 1;
  min-width: 0;
}
.row-title {
  font-weight: 700;
  color: #222;
  text-decoration: none;
}
.row-title:hover {
  color: var(--brand-color);
}
.row-meta {
  font-size: 0.85rem;
  color: #888;
}
.row-action {
  flex-shrink: 0;
  border-radius: 50px;
  font-weight: 600;
}
.empty-box {
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
  background: #fff;
  border: 2px dashed #eee;
  border-radius: 16px;
}
</style>


