<script setup>
/**
 * BaseModal — modal genérico reutilizável.
 *
 * Props:
 *   show    (Boolean) — controla visibilidade
 *   title   (String)  — título do modal
 *
 * Emits:
 *   close   — emitido ao clicar no overlay, no X ou pressionar Esc
 *
 * Regra importante: o modal não pode ficar dentro do card que o dispara —
 * ele precisa estar no topo da árvore para ficar centralizado na viewport
 * independentemente de onde o card estiver na página. Por isso é teleportado
 * para o <body> via Vue Teleport.
 */
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  show:  { type: Boolean, required: true },
  title: { type: String, default: '' }
})

const emit = defineEmits(['close'])

function handleKeydown(e) {
  if (e.key === 'Escape' && props.show) emit('close')
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="show"
        class="modal-overlay"
        @mousedown.self="emit('close')"
        role="dialog"
        aria-modal="true"
        :aria-label="title"
      >
        <div class="modal-box" @mousedown.stop>
          <!-- Cabeçalho -->
          <div class="modal-header-bar">
            <h5 class="modal-title-text">{{ title }}</h5>
            <button
              class="modal-close-btn"
              @click="emit('close')"
              aria-label="Fechar"
            >
              <i class="bi bi-x-lg" />
            </button>
          </div>

          <!-- Conteúdo via slot -->
          <div class="modal-body-area">
            <slot />
          </div>

          <!-- Ações via slot nomeado -->
          <div class="modal-footer-area" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-box {
  background: #fff;
  border-radius: 14px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.22);
  overflow: hidden;
}

.modal-header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-title-text {
  margin: 0;
  font-weight: 700;
  font-size: 1.05rem;
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.25rem;
  line-height: 1;
}

.modal-close-btn:hover {
  color: #222;
}

.modal-body-area {
  padding: 1.25rem;
}

.modal-footer-area {
  padding: 1rem 1.25rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

/* Transição */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
