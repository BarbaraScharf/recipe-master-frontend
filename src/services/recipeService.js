/**
 * recipeService.js
 *
 * Service da entidade Recipe.
 * A função createRecipe recebe onUploadProgress como parâmetro — isso permite
 * que o componente passe um callback que atualiza a barra de progresso na tela
 * enquanto o Axios envia os dados para a API.
 *
 * O que onUploadProgress recebe:
 *   Um ProgressEvent com { loaded, total } — bytes já enviados e total de bytes.
 *   Transformamos isso em porcentagem: Math.round((loaded / total) * 100).
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
