import api from './api'

export function getMyLists() {
  return api.get('/my-lists')
}

// silent: o erro aparece dentro do modal de criação, sem toast
export function createList(payload) {
  return api.post('/lists', payload, { silent: true })
}

export function getListById(listId) {
  return api.get(`/lists/${listId}`)
}

export function deleteList(listId) {
  return api.delete(`/lists/${listId}`)
}

// O id da receita vai no corpo
export function addRecipeToList(listId, recipeId) {
  return api.post(`/lists/${listId}/recipes`, { recipeId })
}

// O id da receita vai na URL
export function removeRecipeFromList(listId, recipeId) {
  return api.delete(`/lists/${listId}/recipes/${recipeId}`)
}

export function getListsStatus(recipeId) {
  return api.get(`/recipes/${recipeId}/lists-status`)
}
