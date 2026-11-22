<script setup>
/**
 * ReportRecipeModal — denunciar uma receita.
 * Motivo obrigatório (conferido aqui, sem chamar a API). O erro da API, como o 409
 * "Você já denunciou...", aparece dentro do modal: o service usa silent: true.
 */
import { ref } from 'vue'
import BaseModal from '../base/BaseModal.vue'
import { reportRecipe } from '../../services/reportService'
import { REPORT_REASONS } from '../../config/constants'

const props = defineProps({
  recipeId: { type: Number, required: true }
})
const emit = defineEmits(['close', 'reported'])

const reason = ref('')
const errorMessage = ref('')
const isSubmitting = ref(false)

async function handleSubmit() {
  errorMessage.value = ''
  if (!reason.value) {
    errorMessage.value = 'Escolha um motivo para continuar.'
    return
  }
  isSubmitting.value = true
  try {
    await reportRecipe(props.recipeId, reason.value)
    emit('reported')
  } catch (err) {
    errorMessage.value = err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <BaseModal :show="true" title="Denunciar receita" :busy="isSubmitting" @close="emit('close')">
    <form id="report-recipe-form" novalidate @submit.prevent="handleSubmit">
      <fieldset :disabled="isSubmitting">
        <legend class="report-legend">Por que esta receita merece revisão?</legend>
        <div v-for="option in REPORT_REASONS" :key="option.value" class="report-option">
          <input
            :id="`report-reason-${option.value}`"
            v-model="reason"
            class="form-check-input"
            type="radio"
            name="report-reason"
            :value="option.value"
          />
          <label :for="`report-reason-${option.value}`" class="report-label">{{ option.label }}</label>
        </div>
      </fieldset>
      <p class="text-muted small mt-2 mb-0">A denúncia vai para a moderação. O autor da receita não é avisado.</p>
      <div v-if="errorMessage" class="report-error" role="alert">
        <i class="bi bi-exclamation-triangle-fill" />
        <span>{{ errorMessage }}</span>
      </div>
    </form>

    <template #footer>
      <button type="button" class="btn btn-secondary" :disabled="isSubmitting" @click="emit('close')">Cancelar</button>
      <button type="submit" form="report-recipe-form" class="btn btn-danger" :disabled="isSubmitting">
        <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2" />
        {{ isSubmitting ? 'Enviando...' : 'Denunciar' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.report-legend {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}
.report-option {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 10px;
  margin-bottom: 0.4rem;
}
.report-option:has(input:checked) {
  border-color: #dc3545;
  background: #fdf1f2;
}
.report-option .form-check-input {
  margin: 0;
  cursor: pointer;
}
.report-label {
  flex: 1;
  margin: 0;
  cursor: pointer;
}
.report-error {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.75rem;
  padding: 0.45rem 0.75rem;
  background: #fdecee;
  border: 1px solid #f5c2c7;
  border-left: 3px solid #dc3545;
  border-radius: 8px;
  color: #b02a37;
  font-size: 0.88rem;
  font-weight: 600;
}
.report-error i {
  font-size: 0.95rem;
  flex-shrink: 0;
}
</style>

