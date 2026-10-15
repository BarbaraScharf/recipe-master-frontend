/**
 * recipeService.js
 *
 * Service da entidade Recipe.
 * createRecipe: recebe onUploadProgress para barra de progresso (Aula 07).
 * getRecipeById: busca detalhe com autor populado + isOwner.
 * getMyRecipes: lista as receitas do usuário logado.
 * getRecipeForEdit: dados para pré-preencher o formulário de edição.
 * updateRecipe: edita texto e troca imagem opcionalmente.
 * deleteRecipe: exclui a receita.
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

export function getMyRecipes() {
  return api.get('/my-recipes')
}

export function getRecipeForEdit(id) {
  return api.get(`/recipes/${id}/edit`)
}

export function updateRecipe(id, formData) {
  return api.put(`/recipes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function deleteRecipe(id) {
  return api.delete(`/recipes/${id}`)
}
