import { ref } from 'vue'
import { TOAST_DURATION } from '../config/constants'

// Lista fora da função: todos os componentes que chamam useToast() compartilham a mesma lista.
const toasts = ref([])
let nextId = 1

function remove(id) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function show(type, message, duration) {
  const id = nextId++
  toasts.value.push({ id, type, message })
  setTimeout(() => remove(id), duration)
}

export function useToast() {
  return {
    toasts,
    remove,
    success: (message) => show('success', message, TOAST_DURATION.SUCCESS),
    error: (message) => show('error', message, TOAST_DURATION.ERROR),
  }
}
