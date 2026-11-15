// Interceptors de resposta — três situações possíveis:
// 1. Sucesso: retira o response.data automaticamente, entregando direto { success, message, data }
// 2. error.response: a API respondeu mas com erro (4xx/5xx), reaproveitamos a mensagem do apiResponse.js
// 3. error.request: requisição enviada mas sem resposta — API fora do ar ou sem conexão
//
// Quem avisa o usuário sobre o erro (regra da Aula 12):
// - Leitura (GET): a tela que pediu os dados mostra o erro no lugar do conteúdo. O interceptor não faz toast.
// - Ação (POST, PUT, DELETE): o interceptor mostra um toast de erro, a não ser que o service marque { silent: true }.
//   Os formulários usam silent porque mostram o erro junto ao campo ou no próprio formulário.
// - 401: limpa a sessão e redireciona para o login. Sem toast.
import axios from 'axios'
import { STORAGE_KEYS, MESSAGES } from '../config/constants'
import { useToast } from '../composables/useToast'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição — anexa o token JWT automaticamente
api.interceptors.request.use((config) => {
  // Lê direto do localStorage para evitar dependência circular com a store
  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

function notifyIfNeeded(error, normalized) {
  const config = error.config || {}
  const isAction = (config.method || 'get').toLowerCase() !== 'get'
  if (!isAction || config.silent || normalized.status === 401) return
  useToast().error(normalized.message)
}

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let normalized

    if (error.response) {
      // A API respondeu, mas com um status de erro (4xx ou 5xx)
      if (error.response.status === 401) {
        // Limpa sessão e redireciona ao login em qualquer 401
        localStorage.removeItem(STORAGE_KEYS.TOKEN)
        localStorage.removeItem(STORAGE_KEYS.USER)
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          window.location.href = `/login?redirect=${currentPath}`
        }
      }
      const apiError = error.response.data || {}
      normalized = {
        message: apiError.message || MESSAGES.GENERIC_ERROR,
        errors: apiError.errors || [],
        status: error.response.status,
      }
    } else if (error.request) {
      // A requisição foi enviada, mas nenhuma resposta chegou (API fora do ar, sem rede)
      normalized = { message: MESSAGES.NETWORK_ERROR, errors: [], status: null }
    } else {
      // Erro ao montar a própria requisição (configuração inválida, por exemplo)
      normalized = { message: MESSAGES.REQUEST_SETUP_ERROR, errors: [], status: null }
    }

    notifyIfNeeded(error, normalized)
    return Promise.reject(normalized)
  }
)

export default api
