import { ref, computed } from 'vue'
import { MESSAGES, PAGE_SIZE } from '../config/constants'

/**
 * usePaginatedList — lista com botão "Carregar mais".
 *
 * fetchPage(page, limit): chama o service e devolve a resposta completa da API.
 * A resposta precisa ter data.<itemsKey> (padrão: recipes) e data.totalPages.
 * options.itemsKey: nome da lista na resposta (ex.: 'notifications').
 *
 * error: falha ao carregar a primeira página (a tela mostra no lugar da lista).
 * loadMoreError: falha ao carregar mais (a lista continua visível e a tela mostra o aviso abaixo dela).
 */
export function usePaginatedList(fetchPage, { limit = PAGE_SIZE, itemsKey = 'recipes' } = {}) {
  const items = ref([])
  const currentPage = ref(0)
  const totalPages = ref(0)
  const isLoading = ref(true)
  const isLoadingMore = ref(false)
  const error = ref('')
  const loadMoreError = ref('')

  const hasMore = computed(() => currentPage.value < totalPages.value)

  async function loadFirst() {
    isLoading.value = true
    error.value = ''
    try {
      const response = await fetchPage(1, limit)
      items.value = response.data[itemsKey]
      currentPage.value = 1
      totalPages.value = response.data.totalPages
    } catch (err) {
      error.value = err?.message || MESSAGES.GENERIC_ERROR
    } finally {
      isLoading.value = false
    }
  }

  async function loadMore() {
    if (isLoadingMore.value || !hasMore.value) return
    isLoadingMore.value = true
    loadMoreError.value = ''
    try {
      const response = await fetchPage(currentPage.value + 1, limit)
      items.value.push(...response.data[itemsKey])
      currentPage.value += 1
      totalPages.value = response.data.totalPages
    } catch (err) {
      loadMoreError.value = err?.message || MESSAGES.GENERIC_ERROR
    } finally {
      isLoadingMore.value = false
    }
  }

  loadFirst()

  return { items, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore, reload: loadFirst }
}

