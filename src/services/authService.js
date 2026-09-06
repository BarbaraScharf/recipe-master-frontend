import api from './api'

export function register(payload) {
  return api.post('/register', payload)
}

export function login(payload) {
  return api.post('/login', payload)
}

export function logout() {
  return api.post('/logout')
}

export function getMyProfile() {
  return api.get('/profile/me')
}

// updateProfile usa multipart/form-data — único caso que sobrescreve o Content-Type padrão
export function updateProfile(formData) {
  return api.put('/profile/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
