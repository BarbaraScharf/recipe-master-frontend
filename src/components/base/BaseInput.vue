<script setup>
/**
 * BaseInput — campo de formulário reutilizável.
 *
 * Suporta v-model via defineModel() (Vue 3.4+), dispensando a dança manual
 * de props + emit em cada componente que precise de v-model.
 *
 * Props:
 *   label       — texto do rótulo (obrigatório)
 *   id          — id do <input>, vinculado ao <label> (obrigatório)
 *   type        — tipo do input (padrão: 'text')
 *   placeholder — placeholder opcional
 *   error       — mensagem de erro a exibir abaixo do campo
 *   rows        — quando > 0 renderiza <textarea> em vez de <input>
 *   disabled    — desabilita o campo
 *   maxlength   — limite de caracteres (usado no textarea de bio)
 */
defineOptions({ name: 'BaseInput' })

const model = defineModel({ default: '' })

const props = defineProps({
  label:       { type: String, required: true },
  id:          { type: String, required: true },
  type:        { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  error:       { type: String, default: '' },
  rows:        { type: Number, default: 0 },
  disabled:    { type: Boolean, default: false },
  maxlength:   { type: Number, default: null },
})
</script>

<template>
  <div class="mb-4">
    <label :for="id" class="form-label fw-semibold fs-6">{{ label }}</label>

    <textarea
      v-if="rows > 0"
      :id="id"
      v-model="model"
      class="form-control form-control-lg"
      :class="{ 'is-invalid': error }"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :maxlength="maxlength || undefined"
    />

    <input
      v-else
      :id="id"
      v-model="model"
      class="form-control form-control-lg"
      :class="{ 'is-invalid': error }"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
    />

    <div v-if="error" class="invalid-feedback d-block">
      {{ error }}
    </div>
  </div>
</template>
