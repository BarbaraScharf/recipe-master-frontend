<script setup>
/**
 * CreateListModal — formulário de nova lista dentro do BaseModal.
 * O erro da API aparece aqui dentro (o service usa silent: true), nunca em toast.
 */
import { reactive, ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import BaseInput from '../base/BaseInput.vue'
import { createList } from '../../services/listService'
import { LIMITS } from '../../config/constants'

const emit = defineEmits(['close', 'created'])

const form = reactive({ title: '', description: '', isPublic: false })
const errors = reactive({ title: '', description: '' })
const apiErrorMessage = ref('')
const isSubmitting = ref(false)

function validate() {
  errors.title = ''
  errors.description = ''
  const title = form.title.trim()
  const description = form.description.trim()
  if (title.length < LIMITS.LIST_TITLE_MIN || title.length > LIMITS.LIST_TITLE_MAX) {
    errors.title = `O título deve ter entre ${LIMITS.LIST_TITLE_MIN} e ${LIMITS.LIST_TITLE_MAX} caracteres.`
  }
  if (description.length > LIMITS.LIST_DESCRIPTION_MAX) {
    errors.description = `A descrição deve ter no máximo ${LIMITS.LIST_DESCRIPTION_MAX} caracteres.`
  }
  return !errors.title && !errors.description
}

async function handleSubmit() {
  apiErrorMessage.value = ''
  if (!validate()) return
  isSubmitting.value = true
  try {
    const response = await createList({
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      isPublic: form.isPublic,
    })
    emit('created', response.data)
  } catch (err) {
    apiErrorMessage.value = err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal :show="true" title="Nova lista" @close="emit('close')">
    <form id="create-list-form" novalidate @submit.prevent="handleSubmit">
      <BaseInput
        id="list-title"
        v-model="form.title"
        label="Título"
        placeholder="Ex.: Bolos de aniversário"
        :error="errors.title"
      />
      <BaseInput
        id="list-description"
        v-model="form.description"
        label="Descrição (opcional)"
        :rows="3"
        :maxlength="LIMITS.LIST_DESCRIPTION_MAX"
        :error="errors.description"
      />
      <div class="form-check mb-2">
        <input id="list-public" v-model="form.isPublic" class="form-check-input" type="checkbox" />
        <label for="list-public" class="form-check-label">Lista pública (qualquer pessoa com o link pode ver)</label>
      </div>
      <p v-if="apiErrorMessage" class="text-danger small mb-0" role="alert">
        <i class="bi bi-exclamation-circle me-1" />{{ apiErrorMessage }}
      </p>
    </form>

    <template #footer>
      <button type="button" class="btn btn-secondary" :disabled="isSubmitting" @click="emit('close')">Cancelar</button>
      <button type="submit" form="create-list-form" class="btn btn-brand" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" />
        {{ isSubmitting ? 'Criando...' : 'Criar lista' }}
      </button>
    </template>
  </BaseModal>
</template>
