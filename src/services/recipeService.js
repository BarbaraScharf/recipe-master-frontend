/**
 * recipeService.js
 *
 * Service da entidade Recipe.
 * createRecipe: recebe onUploadProgress para barra de progresso (Aula 07).
 * getRecipeById: busca detalhe com autor populado + isOwner.
 * getFeed foi movido para userService.js (espelha userRoutes no backend).
 */
import api from './api'

export function createRecipe(formData, onUploadProgress) {
  return api.post('/recipes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
        onUploadProgress(percent)
      }
    }
  })
}

export function getRecipeById(id) {
  return api.get(`/recipes/${id}`)
}
