import api from './api'

export function addComment(recipeId, content) {
  return api.post(`/recipes/${recipeId}/comments`, { content }, { silent: true })
}

export function getComments(recipeId) {
  return api.get(`/recipes/${recipeId}/comments`)
}

