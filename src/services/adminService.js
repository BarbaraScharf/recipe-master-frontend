import api from './api'
import { PAGE_SIZE } from '../config/constants'

// Sem silent: as ações do painel que falham viram toast (interceptor), e as leituras
// mostram o erro na própria tela.

export function getAdminDashboard() {
  return api.get('/admin/dashboard')
}

export function getAdminReports(status = 'pending', page = 1, limit = PAGE_SIZE) {
  return api.get('/admin/reports', { params: { status, page, limit } })
}

// Sem segundo argumento (nunca null: o Axios mandaria o texto "null" como corpo)
export function reviewAdminReport(reportId) {
  return api.patch(`/admin/reports/${reportId}/review`)
}

export function getAdminUsers(search = '', page = 1, limit = PAGE_SIZE) {
  return api.get('/admin/users', { params: { search, page, limit } })
}

export function setUserBlocked(userId, isBlocked) {
  return api.patch(`/admin/users/${userId}/block`, { isBlocked })
}

export function getAdminRecipes(search = '', page = 1, limit = PAGE_SIZE) {
  return api.get('/admin/recipes', { params: { search, page, limit } })
}

export function deleteAdminRecipe(recipeId) {
  return api.delete(`/admin/recipes/${recipeId}`)
}
