import { ref, watch as vueWatch } from 'vue'
import { MESSAGES } from '../config/constants'

/**
 * useAsyncData — carrega dados de leitura e controla data / isLoading / error.
 *
 * fetcher: função que devolve a chamada ao service, ex.: () => getRecipeById(route.params.id)
 * options.watch: fonte reativa (ex.: () => route.params.id). Quando muda, recarrega.
 * options.immediate: carrega assim que o composable é usado (padrão: true).
 *
 * Corrida entre chamadas: cada chamada recebe um número (lastCallId). Se uma chamada
 * antiga terminar depois de uma mais nova, o resultado dela é descartado.
 */
export function useAsyncData(fetcher, { watch: watchSource = null, immediate = true } = {}) {
  const data = ref(null)
  const isLoading = ref(immediate)
  const error = ref('')
  let lastCallId = 0

  async function execute() {
    const callId = ++lastCallId
    isLoading.value = true
    error.value = ''
    try {
      const response = await fetcher()
      if (callId !== lastCallId) return
      data.value = response.data
    } catch (err) {
      if (callId !== lastCallId) return
      data.value = null
      error.value = err?.message || MESSAGES.GENERIC_ERROR
    } finally {
      if (callId === lastCallId) isLoading.value = false
    }
  }

  if (watchSource) {
    vueWatch(watchSource, execute, { immediate })
  } else if (immediate) {
    execute()
  }

  return { data, isLoading, error, execute }
}
