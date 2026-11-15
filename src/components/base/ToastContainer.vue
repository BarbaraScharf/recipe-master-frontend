<script setup>
import { useToast } from '../../composables/useToast'

const { toasts, remove } = useToast()
</script>

<template>
  <div class="toast-container-app" aria-live="polite">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast-app"
      :class="toast.type === 'success' ? 'toast-success' : 'toast-error'"
      :role="toast.type === 'error' ? 'alert' : 'status'"
    >
      <i :class="toast.type === 'success' ? 'bi bi-check-circle-fill' : 'bi bi-exclamation-circle-fill'" />
      <span class="toast-message">{{ toast.message }}</span>
      <button class="toast-close" aria-label="Fechar aviso" @click="remove(toast.id)">
        <i class="bi bi-x" />
      </button>
    </div>
  </div>
</template>

<style scoped>
/* z-index acima do BaseModal (1050) para o aviso aparecer mesmo com modal aberto */
.toast-container-app {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 440px;
}
.toast-app {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 10px;
  color: #fff;
  font-size: 1.05rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
}
.toast-success { background: #2e7d32; }
.toast-error { background: #c62828; }
.toast-app > i { font-size: 1.3rem; }
.toast-message { flex: 1; }
.toast-app { min-width: 300px; }
.toast-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
}
</style>

