<script setup>
/**
 * AddToListModal — o modal "Salvar": uma caixa por lista, já marcada conforme o servidor.
 *
 * Cada caixa é otimista (runOptimistic): muda na hora e desfaz se a API falhar.
 * Cada linha tem a sua "cerca": enquanto a requisição daquela lista não termina,
 * a caixa fica desabilitada, então dois cliques rápidos geram uma requisição só.
 * :checked + @change (e não v-model): quem manda no estado é list.hasRecipe.
 */
import { reactive } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { getListsStatus, addRecipeToList, removeRecipeFromList } from '../../services/listService'
import { useAsyncData } from '../../composables/useAsyncData'
import { runOptimistic } from '../../utils/optimistic'

const props = defineProps({
  recipeId: { type: Number, required: true }
})
const emit = defineEmits(['close'])

const { data: lists, isLoading, error } = useAsyncData(
  () => getListsStatus(props.recipeId),
  { initialData: [] }
)

// ids das listas com requisição em andamento
const pendingIds = reactive(new Set())

function toggle(list) {
  if (pendingIds.has(list.id)) return
  pendingIds.add(list.id)

  // Estado de antes, guardado numa variável local: decide se é adicionar ou remover
  const hadRecipe = list.hasRecipe

  runOptimistic({
    apply: () => {
      list.hasRecipe = !hadRecipe
      list.recipesCount += hadRecipe ? -1 : 1
      return () => {
        list.hasRecipe = hadRecipe
        list.recipesCount += hadRecipe ? 1 : -1
      }
    },
    request: () => hadRecipe
      ? removeRecipeFromList(list.id, props.recipeId)
      : addRecipeToList(list.id, props.recipeId),
    confirm: (data) => {
      list.recipesCount = data.recipesCount
    },
  }).finally(() => pendingIds.delete(list.id))
}
</script>

<template>
  <BaseModal :show="true" title="Salvar em uma lista" @close="emit('close')">
    <div v-if="isLoading" class="text-center py-3 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando suas listas...
    </div>

    <div v-else-if="error" class="alert alert-danger mb-0">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="lists.length === 0" class="text-center py-3">
      <p class="text-muted mb-3">Você ainda não tem nenhuma lista.</p>
      <router-link :to="{ name: 'my-lists' }" class="btn btn-brand" @click="emit('close')">
        <i class="bi bi-plus-circle me-2" />Criar minha primeira lista
      </router-link>
    </div>

    <ul v-else class="list-unstyled mb-0 save-list">
      <li v-for="list in lists" :key="list.id" class="save-row">
        <input
          :id="`save-list-${list.id}`"
          type="checkbox"
          class="form-check-input mt-0"
          :checked="list.hasRecipe"
          :disabled="pendingIds.has(list.id)"
          @change="toggle(list)"
        />
        <label :for="`save-list-${list.id}`" class="save-label">
          <span class="fw-semibold">{{ list.title }}</span>
          <i v-if="!list.isPublic" class="bi bi-lock-fill text-secondary ms-1" title="Lista privada" aria-label="Lista privada" />
        </label>
        <span class="text-muted small">{{ list.recipesCount === 1 ? '1 receita' : `${list.recipesCount} receitas` }}</span>
      </li>
    </ul>
  </BaseModal>
</template>

<style scoped>
.save-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.save-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.55rem 0.5rem;
  border-radius: 8px;
}
.save-row:hover {
  background: #fafafa;
}
.save-row .form-check-input {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}
.save-label {
  flex: 1;
  cursor: pointer;
  margin: 0;
}
</style>
