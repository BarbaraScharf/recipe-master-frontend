<script setup>
/**
 * MyListsView — as listas da pessoa logada.
 *
 * Caminhos de clique (Aula 13):
 *   - Menu do avatar → "Minhas Listas" e Sidebar → "Minhas Listas"
 *   - Botão "Nova lista" (modal) e "Excluir" em cada cartão (confirmação)
 *   - Clique no cartão → detalhe da lista
 */
import { ref } from 'vue'
import { getMyLists, deleteList } from '../../services/listService'
import { useAsyncData } from '../../composables/useAsyncData'
import { useToast } from '../../composables/useToast'
import BaseModal from '../../components/base/BaseModal.vue'
import CreateListModal from '../../components/list/CreateListModal.vue'

const toast = useToast()

const { data: lists, isLoading, error } = useAsyncData(() => getMyLists(), { initialData: [] })

const isCreating = ref(false)
const listToDelete = ref(null)
const isDeleting = ref(false)

function recipesLabel(count) {
  return count === 1 ? '1 receita' : `${count} receitas`
}

function onCreated(newList) {
  // Array novo, com a lista nova no topo
  lists.value = [newList, ...lists.value]
  isCreating.value = false
  toast.success('Lista criada com sucesso.')
}

// Pessimista: espera a API. Se falhar, o toast vem do interceptor e o modal continua aberto.
async function confirmDelete() {
  if (!listToDelete.value) return
  isDeleting.value = true
  try {
    await deleteList(listToDelete.value.id)
    lists.value = lists.value.filter((list) => list.id !== listToDelete.value.id)
    listToDelete.value = null
    toast.success('Lista excluída com sucesso.')
  } catch {
    // toast de erro já mostrado pelo interceptor
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="container py-5">
    <div class="d-flex align-items-center justify-content-between mb-5">
      <h2 class="fw-bold mb-0" style="color: var(--brand-color)">
        <i class="bi bi-collection me-2" />Minhas Listas
      </h2>
      <button class="btn btn-brand" @click="isCreating = true">
        <i class="bi bi-plus-circle me-2" />Nova lista
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando suas listas...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="lists.length === 0" class="empty-lists">
      <i class="bi bi-collection empty-icon" />
      <p class="empty-text">Você ainda não tem listas.</p>
      <p class="text-muted">Clique em <strong>Nova lista</strong> para criar a primeira. Depois, abra uma receita e use o botão <strong>Salvar</strong>.</p>
    </div>

    <div v-else class="list-grid">
      <div v-for="list in lists" :key="list.id" class="list-card position-relative">
        <div class="list-cover" :class="list.isPublic ? 'cover-public' : 'cover-private'">
          <i class="bi bi-collection-fill" />
          <span class="list-badge">
            <i class="bi me-1" :class="list.isPublic ? 'bi-globe' : 'bi-lock-fill'" />{{ list.isPublic ? 'Pública' : 'Privada' }}
          </span>
        </div>

        <div class="list-body">
          <h5 class="list-title">
            <router-link :to="{ name: 'list-detail', params: { id: list.id } }" class="stretched-link list-link">
              {{ list.title }}
            </router-link>
          </h5>
          <p class="list-description">{{ list.description || 'Sem descrição' }}</p>
        </div>

        <div class="list-footer">
          <span class="list-count"><i class="bi bi-journal-text me-1" />{{ recipesLabel(list.recipesCount) }}</span>
          <!-- position-relative + z-index: o botão fica por cima do link esticado do cartão -->
          <button class="btn btn-sm delete-btn position-relative" :aria-label="`Excluir a lista ${list.title}`" @click="listToDelete = list">
            <i class="bi bi-trash me-1" />Excluir
          </button>
        </div>
      </div>
    </div>
    <CreateListModal v-if="isCreating" @close="isCreating = false" @created="onCreated" />

    <BaseModal :show="!!listToDelete" title="Excluir lista" @close="listToDelete = null">
      <p class="mb-0">
        Tem certeza que deseja excluir a lista <strong>{{ listToDelete?.title }}</strong>?
        As receitas continuam existindo, só saem desta lista.
      </p>
      <template #footer>
        <button class="btn btn-secondary" :disabled="isDeleting" @click="listToDelete = null">Cancelar</button>
        <button class="btn btn-danger" :disabled="isDeleting" @click="confirmDelete">
          <span v-if="isDeleting" class="spinner-border spinner-border-sm me-2" />
          {{ isDeleting ? 'Excluindo...' : 'Excluir' }}
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.list-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
.list-card {
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.15s, box-shadow 0.15s;
}
.list-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.1);
}
.list-cover {
  position: relative;
  height: 96px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
}
.cover-public {
  background: linear-gradient(135deg, #ffe3d6, #ffc4a8);
  color: var(--brand-color);
}
.cover-private {
  background: linear-gradient(135deg, #eef0f2, #dde1e5);
  color: #6c757d;
}
.list-badge {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  background: rgba(255, 255, 255, 0.9);
  color: #444;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
}
.list-body {
  flex: 1;
  padding: 1rem 1.1rem 0.5rem;
}
.list-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.35rem;
}
.list-link {
  color: #222;
  text-decoration: none;
}
.list-link:hover {
  color: var(--brand-color);
}
.list-description {
  color: #888;
  font-size: 0.88rem;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.list-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.1rem;
  border-top: 1px solid #f2f2f2;
}
.list-count {
  font-size: 0.88rem;
  font-weight: 600;
  color: #555;
}
.delete-btn {
  z-index: 2;
  color: #dc3545;
  border: 1px solid transparent;
  font-size: 0.82rem;
}
.delete-btn:hover {
  background: #fdecee;
  border-color: #f5c2c7;
  color: #dc3545;
}.empty-lists {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 40vh;
  gap: 0.5rem;
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
</style>

