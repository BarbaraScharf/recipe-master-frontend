<script setup>
/**
 * ConfirmModal — "tem certeza?" reutilizável, sobre o BaseModal.
 * Quem usa decide o que acontece no confirm; durante a chamada, passa busy = true
 * (o botão mostra "Aguarde..." e o modal não fecha).
 *
 * message: a primeira linha vira a pergunta em destaque; as outras, a explicação.
 */
import { computed } from 'vue'
import BaseModal from './BaseModal.vue'

const props = defineProps({
  title: { type: String, required: true },
  message: { type: String, required: true },
  confirmLabel: { type: String, default: 'Confirmar' },
  confirmVariant: { type: String, default: 'danger' },
  icon: { type: String, default: 'bi-exclamation-triangle' },
  // opcional: lista do que vai acontecer junto ({ icon, label }) e um aviso final em destaque
  items: { type: Array, default: () => [] },
  warning: { type: String, default: '' },
  busy: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm', 'close'])

const lines = computed(() => props.message.split('\n').map((line) => line.trim()).filter(Boolean))
const question = computed(() => lines.value[0] || '')
const details = computed(() => lines.value.slice(1))
</script>

<template>
  <BaseModal :show="true" :title="title" :busy="busy" @close="emit('close')">
    <div class="confirm-body">
      <div class="confirm-icon" :class="`icon-${confirmVariant}`">
        <i class="bi" :class="icon" />
      </div>
      <p class="confirm-question">{{ question }}</p>
      <p v-for="(line, index) in details" :key="index" class="confirm-detail">{{ line }}</p>
      <ul v-if="items.length" class="confirm-items">
        <li v-for="item in items" :key="item.label">
          <i class="bi" :class="item.icon" />{{ item.label }}
        </li>
      </ul>
      <div v-if="warning" class="confirm-warning">
        <i class="bi bi-exclamation-octagon-fill" />{{ warning }}
      </div>
    </div>
    <template #footer>
      <button type="button" class="btn btn-secondary" :disabled="busy" @click="emit('close')">Cancelar</button>
      <button type="button" class="btn" :class="`btn-${confirmVariant}`" :disabled="busy" @click="emit('confirm')">
        <span v-if="busy" class="spinner-border spinner-border-sm me-2" />
        {{ busy ? 'Aguarde...' : confirmLabel }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.confirm-body {
  text-align: center;
  padding: 0.5rem 0.5rem 0.25rem;
}
.confirm-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}
.icon-danger {
  background: #fdecee;
  color: #dc3545;
}
.icon-success {
  background: #e8f6ee;
  color: #2a9d5c;
}
.icon-brand,
.icon-primary {
  background: #fff0eb;
  color: var(--brand-color);
}
.confirm-question {
  font-size: 1.1rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 0.6rem;
  word-break: break-word;
}
.confirm-detail {
  color: #777;
  font-size: 0.92rem;
  line-height: 1.55;
  margin-bottom: 0.4rem;
}
.confirm-items {
  list-style: none;
  padding: 0.75rem 1rem;
  margin: 0.75rem 0 0;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: left;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.45rem 1rem;
}
.confirm-items li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.88rem;
  color: #555;
}
.confirm-items i {
  color: #dc3545;
  font-size: 0.95rem;
}
.confirm-warning {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.85rem;
  padding: 0.55rem 0.9rem;
  background: #fdecee;
  border: 1px solid #f5c2c7;
  border-radius: 10px;
  color: #b02a37;
  font-size: 0.9rem;
  font-weight: 700;
}
.confirm-detail:last-child {
  margin-bottom: 0;
}
</style>

