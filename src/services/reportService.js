import api from './api'

// silent: o erro aparece dentro do modal de denúncia, sem toast
export function reportRecipe(recipeId, reason) {
  return api.post(`/recipes/${recipeId}/report`, { reason }, { silent: true })
}
