import { ref, watch, toValue, onUnmounted } from 'vue'

/**
 * useDebouncedValue — devolve uma cópia de "source" que só muda depois de
 * "delay" ms sem nenhuma mudança nova. Cada mudança reinicia o relógio.
 * Começa com o valor atual da origem (sem esperar).
 */
export function useDebouncedValue(source, delay) {
  const debounced = ref(toValue(source))
  let timer = null

  watch(source, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      debounced.value = value
    }, delay)
  })

  // Se a tela fechar com um timer pendente, ele não dispara depois
  onUnmounted(() => clearTimeout(timer))

  return debounced
}
