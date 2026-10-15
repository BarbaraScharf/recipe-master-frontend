<script setup>
import { ref, onMounted } from 'vue'
import { getMyRecipes, deleteRecipe } from '../services/recipeService'
import RecipeCard from '../components/recipe/RecipeCard.vue'
import BaseModal  from '../components/base/BaseModal.vue'

const recipes   = ref([])
const isLoading = ref(true)
const errorMsg  = ref('')

const showDeleteModal = ref(false)
const recipeToDelete  = ref(null)
const isDeleting      = ref(false)
const deleteError     = ref('')

onMounted(async () => {
  try {
    const response = await getMyRecipes()
    recipes.value = response.data.recipes
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
})

function openDeleteModal(recipe) {
  recipeToDelete.value  = recipe
  deleteError.value     = ''
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  recipeToDelete.value  = null
  deleteError.value     = ''
}

async function confirmDelete() {
  if (!recipeToDelete.value) return
  isDeleting.value  = true
  deleteError.value = ''
  try {
    await deleteRecipe(recipeToDelete.value.id)
    recipes.value = recipes.value.filter(r => r.id !== recipeToDelete.value.id)
    closeDeleteModal()
  } catch (err) {
    deleteError.value = err.message
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="container py-5">

    <!-- Cabeçalho -->
    <div class="d-flex align-items-center justify-content-between mb-5">
      <h2 class="fw-bold mb-0" style="color: var(--brand-color)">
        <i class="bi bi-journal-text me-2" />Minhas Receitas
      </h2>
      <router-link to="/recipes/upload" class="btn btn-brand">
        <i class="bi bi-plus-circle me-2" />Nova Receita
      </router-link>
    </div>

    <!-- Carregando -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando suas receitas...
    </div>

    <!-- Erro -->
    <div v-else-if="errorMsg" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ errorMsg }}
    </div>

    <!-- Estado vazio -->
    <div v-else-if="recipes.length === 0" class="empty-state">
      <i class="bi bi-journal-x empty-icon" />
      <p class="empty-text">Você ainda não publicou nenhuma receita.</p>
      <router-link to="/recipes/upload" class="btn btn-brand px-4">
        <i class="bi bi-plus-circle me-2" />Publicar minha primeira receita
      </router-link>
    </div>

    <!-- Grade de receitas -->
    <div v-else class="recipe-grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        :show-author="false"
      >
        <template #actions>
          <router-link
            :to="{ name: 'recipe-edit', params: { id: recipe.id } }"
            class="btn btn-card-action btn-action-edit"
          >
            <i class="bi bi-pencil me-1" />Editar
          </router-link>
          <button
            class="btn btn-card-action btn-action-delete"
            @click="openDeleteModal(recipe)"
          >
            <i class="bi bi-trash me-1" />Excluir
          </button>
        </template>
      </RecipeCard>
    </div>

    <!-- Modal de exclusão -->
    <BaseModal :show="showDeleteModal" title="Excluir receita" @close="closeDeleteModal">
      <p>
        Tem certeza que deseja excluir
        <strong>{{ recipeToDelete?.title }}</strong>?
        Esta ação não pode ser desfeita.
      </p>
      <p v-if="deleteError" class="text-danger small mb-0">
        <i class="bi bi-exclamation-circle me-1" />{{ deleteError }}
      </p>
      <template #footer>
        <button class="btn btn-secondary" @click="closeDeleteModal" :disabled="isDeleting">
          Cancelar
        </button>
        <button class="btn btn-danger" @click="confirmDelete" :disabled="isDeleting">
          <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" />
          {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
        </button>
      </template>
    </BaseModal>

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
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.btn-card-action {
  flex: 1;
  padding: 0.45rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  border: 2px solid;
  transition: all 0.15s;
}

.btn-action-edit {
  color: #555;
  border-color: #ccc;
  background: #fff;
  text-decoration: none;
}

.btn-action-edit:hover {
  background: #f0f0f0;
  color: #222;
  border-color: #aaa;
}

.btn-action-delete {
  color: #dc3545;
  border-color: #dc3545;
  background: #fff;
}

.btn-action-delete:hover {
  background: #dc3545;
  color: #fff;
}
</style>
