import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, logout as logoutService } from '../services/authService'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || null)
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY)) || null)

  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const isAdmin = computed(() => user.value?.isAdmin === true)

  async function login(email, password) {
    const response = await loginService({ email, password })
    token.value = response.data.token
    user.value = response.data.user
    localStorage.setItem(TOKEN_KEY, token.value)
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  async function logout() {
    try {
      await logoutService()
    } catch (_) {
      // ignora erro de rede no logout
    } finally {
      clearSession()
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isAuthenticated, isAdmin, login, logout, clearSession }
})
