/**
 * userService.js
 *
 * Service do módulo de usuário no frontend.
 * getFeed fica aqui — espelha a decisão do backend onde o feed é
 * uma visão do usuário logado (GET /api/feed está em userRoutes).
 * getPublicProfile — perfil público com lista de receitas e isOwner.
 */
import api from './api'

export function getFeed(page = 1, limit = 10) {
  return api.get('/feed', { params: { page, limit } })
}

export function getPublicProfile(username) {
  return api.get(`/profile/${username}`)
}
