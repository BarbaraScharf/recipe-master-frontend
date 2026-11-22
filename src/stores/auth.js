import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginService, logout as logoutService, getMyProfile } from '../services/authService'

import { STORAGE_KEYS } from '../config/constants'

const TOKEN_KEY = STORAGE_KEYS.TOKEN
const USER_KEY = STORAGE_KEYS.USER

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

  // Atualiza os dados do usuário logado (ex.: depois de editar o perfil) para a navbar refletir na hora
  function updateUser(data) {
    user.value = { ...user.value, ...data }
    localStorage.setItem(USER_KEY, JSON.stringify(user.value))
  }

  // Busca o perfil atual na API e atualiza o usuário salvo (foto, nome...).
  // Chamado quando o app abre: o que estava no localStorage pode ser de um login antigo.
  async function refreshUser() {
    if (!token.value) return
    try {
      const response = await getMyProfile()
      updateUser({
        fullName: response.data.fullName,
        bio: response.data.bio,
        profilePicture: response.data.profilePicture,
      })
    } catch {
      // sem rede: fica com o que já estava salvo; 401 já é tratado pelo interceptor
    }
  }

  function clearSession() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  return { token, user, isAuthenticated, isAdmin, login, logout, updateUser, refreshUser, clearSession }
})


