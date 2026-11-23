import { ref, computed, watch as vueWatch } from 'vue'
import { MESSAGES, PAGE_SIZE } from '../config/constants'

/**
 * usePaginatedList — lista com botão "Carregar mais".
 *
 * fetchPage(page, limit): chama o service e devolve a resposta completa da API.
 * A resposta precisa ter data.<itemsKey> (padrão: recipes) e data.totalPages.
 * options.itemsKey: nome da lista na resposta (ex.: 'notifications').
 * options.watch (Aula 15): fonte reativa (o filtro, o termo de busca). Quando muda, recarrega do começo.
 *
 * Resposta velha: cada carga da primeira página ganha um número (lastCallId). Se o filtro
 * mudar no meio do caminho, a resposta antiga chega e é descartada. O loadMore guarda o
 * número do início e também descarta a página que chegar depois de uma recarga.
 *
 * error: falha ao carregar a primeira página (a tela mostra no lugar da lista).
 * loadMoreError: falha ao carregar mais (a lista continua visível e a tela mostra o aviso abaixo dela).
 */
export function usePaginatedList(fetchPage, { limit = PAGE_SIZE, itemsKey = 'recipes', watch: source = null } = {}) {
  const items = ref([])
  const currentPage = ref(0)
  const totalPages = ref(0)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const error = ref('')
  const loadMoreError = ref('')
  let lastCallId = 0

  const hasMore = computed(() => currentPage.value < totalPages.value)

  async function loadFirstPage() {
    const callId = ++lastCallId
    isLoading.value = true
    error.value = ''
    loadMoreError.value = ''
    try {
      const response = await fetchPage(1, limit)
      if (callId !== lastCallId) return
      items.value = response.data[itemsKey]
      currentPage.value = 1
      totalPages.value = response.data.totalPages
    } catch (err) {
      if (callId !== lastCallId) return
      error.value = err?.message || MESSAGES.GENERIC_ERROR
    } finally {
      if (callId === lastCallId) isLoading.value = false
    }
  }

  async function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return
    const callId = lastCallId
    isLoadingMore.value = true
    loadMoreError.value = ''
    try {
      const response = await fetchPage(currentPage.value + 1, limit)
      // a lista foi recarregada enquanto esta página vinha: ela não pertence mais à lista atual
      if (callId !== lastCallId) return
      items.value.push(...response.data[itemsKey])
      currentPage.value += 1
      totalPages.value = response.data.totalPages
    } catch (err) {
      if (callId !== lastCallId) return
      loadMoreError.value = err?.message || MESSAGES.GENERIC_ERROR
    } finally {
      isLoadingMore.value = false
    }
  }

  loadFirstPage()
  if (source) vueWatch(source, loadFirstPage)

  return { items, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore, reload: loadFirstPage }
}
