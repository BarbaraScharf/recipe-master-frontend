<script setup>
/**
 * BaseButton — botão reutilizável com estado de carregamento.
 *
 * Props:
 *   loading  — substitui o label pelo loadingLabel e desabilita o botão
 *   label    — texto padrão do botão
 *   loadingLabel — texto exibido enquanto loading=true
 *   variant  — classe Bootstrap de cor ('brand' usa a cor de marca do projeto)
 *   type     — atributo type do <button> (padrão: 'submit')
 *   icon     — classe de ícone Bootstrap Icons (ex: 'bi-save'), opcional
 */
defineOptions({ name: 'BaseButton' })

const props = defineProps({
  loading:      { type: Boolean, default: false },
  label:        { type: String, required: true },
  loadingLabel: { type: String, default: 'Aguarde...' },
  variant:      { type: String, default: 'brand' },
  type:         { type: String, default: 'submit' },
  icon:         { type: String, default: '' },
})
</script>

<template>
  <button
    :type="type"
    class="btn btn-lg w-100 mt-2"
    :class="variant === 'brand' ? 'btn-brand' : `btn-${variant}`"
    :disabled="loading"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
    <i v-else-if="icon" :class="`bi ${icon} me-2`" />
    {{ loading ? loadingLabel : label }}
  </button>
</template>
