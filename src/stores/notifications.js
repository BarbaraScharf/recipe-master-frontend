import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUnreadCount } from '../services/notificationService'
import { NOTIFICATIONS } from '../config/constants'

/**
 * Store do sino: guarda o número de não lidas e pergunta à API de tempos em tempos (polling).
 *
 * - startPolling: liga ao entrar na conta (a Navbar chama). Pergunta na hora e depois a cada 30 s.
 * - stopPolling: desliga ao sair, para de perguntar e zera o número.
 * - Com a aba escondida, não pergunta; ao voltar para a aba, pergunta na hora.
 *
 * Corrida: uma resposta velha do polling não pode apagar um número mais novo.
 * Cada pergunta ganha um número (lastRefreshId); só a última vale.
 * Quando a tela muda o número (marcar como lida), setUnreadCount também sobe o
 * lastRefreshId, e qualquer pergunta que ainda estava no caminho é descartada.
 */
export const useNotificationStore = defineStore('notifications', () => {
  const unreadCount = ref(0)
  let timerId = null
  let lastRefreshId = 0

  async function refresh() {
    const callId = ++lastRefreshId
    try {
      const response = await getUnreadCount()
      if (callId !== lastRefreshId) return
      unreadCount.value = response.data.unreadCount
    } catch {
      // Sem rede: o sino fica com o último número. É leitura, então não há toast.
    }
  }

  function setUnreadCount(value) {
    lastRefreshId++
    unreadCount.value = Math.max(0, value)
  }

  // A mesma função vai no addEventListener e no removeEventListener (precisa ser a mesma referência)
  function refreshIfVisible() {
    if (document.visibilityState === 'visible') refresh()
  }

  function startPolling() {
    // Já ligado: não cria um segundo temporizador (logins repetidos, a Navbar montando de novo...)
    if (timerId !== null) return
    refresh()
    timerId = setInterval(refreshIfVisible, NOTIFICATIONS.POLL_MS)
    document.addEventListener('visibilitychange', refreshIfVisible)
  }

  function stopPolling() {
    if (timerId !== null) {
      clearInterval(timerId)
      timerId = null
    }
    document.removeEventListener('visibilitychange', refreshIfVisible)
    // Descarta uma pergunta que ainda estava no caminho
    lastRefreshId++
    unreadCount.value = 0
  }

  return { unreadCount, refresh, setUnreadCount, refreshIfVisible, startPolling, stopPolling }
})
