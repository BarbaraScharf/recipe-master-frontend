/**
 * userService.js
 *
 * Service do módulo de usuário no frontend.
 * getFeed fica aqui — espelha a decisão do backend onde o feed é
 * uma visão do usuário logado (GET /api/feed está em userRoutes).
 * getPublicProfile — perfil público com lista de receitas e isOwner.
 */
import api from './api'
import { PAGE_SIZE } from '../config/constants'

export function getFeed(page = 1, limit = PAGE_SIZE) {
  return api.get('/feed', { params: { page, limit } })
}

export function getPublicProfile(username) {
  return api.get(`/profile/${username}`)
}

