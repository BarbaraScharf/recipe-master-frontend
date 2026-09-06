// Interceptors de resposta — três situações possíveis:
// 1. Sucesso: retira o response.data automaticamente, entregando direto { success, message, data }
// 2. error.response: a API respondeu mas com erro (4xx/5xx), reaproveitamos a mensagem do apiResponse.js
// 3. error.request: requisição enviada mas sem resposta — API fora do ar ou sem conexão

import axios from 'axios'

const TOKEN_KEY = 'auth_token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor de requisição — anexa o token JWT automaticamente
api.interceptors.request.use((config) => {
  // Lê direto do localStorage para evitar dependência circular com a store
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// Interceptor de resposta
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      // A API respondeu, mas com um status de erro (4xx ou 5xx)
      if (error.response.status === 401) {
        // Limpa sessão e redireciona ao login em qualquer 401
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem('auth_user')
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          window.location.href = `/login?redirect=${currentPath}`
        }
      }
      const apiError = error.response.data
      return Promise.reject({
        message: apiError.message || 'Ocorreu um erro na requisição.',
        errors: apiError.errors || [],
        status: error.response.status,
      })
    } else if (error.request) {
      // A requisição foi enviada, mas nenhuma resposta chegou (API fora do ar, sem rede)
      return Promise.reject({
        message: 'Não foi possível se conectar ao servidor. Verifique sua conexão ou tente mais tarde.',
        errors: [],
        status: null,
      })
    } else {
      // Erro ao montar a própria requisição (configuração inválida, por exemplo)
      return Promise.reject({
        message: 'Erro inesperado ao preparar a requisição.',
        errors: [],
        status: null,
      })
    }
  }
)

export default api
