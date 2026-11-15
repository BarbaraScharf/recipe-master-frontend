import api from './api'

export function register(payload) {
  return api.post('/register', payload, { silent: true })
}

export function login(payload) {
  return api.post('/login', payload, { silent: true })
}

export function logout() {
  return api.post('/logout', null, { silent: true })
}

export function getMyProfile() {
  return api.get('/profile/me')
}

// silent: o formulário mostra o erro por conta própria, sem toast.
// updateProfile usa multipart/form-data — único caso que sobrescreve o Content-Type padrão
export function updateProfile(formData) {
  return api.put('/profile/me', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    silent: true,
  })
}

