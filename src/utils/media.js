const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL

export function getProfilePictureUrl(filename) {
  if (!filename || filename === 'default-profile.png') {
    return 'https://ui-avatars.com/api/?background=e25822&color=fff&size=128&name=User'
  }
  return `${UPLOADS_URL}/profiles/${filename}`
}

/**
 * Retorna a URL da imagem de uma receita.
 * Grupo B: a imagem enviada já é o conteúdo — aponta para /uploads/recipes/<filename>.
 * Por que apontar para o arquivo estático e não para uma rota autenticada?
 * Tags <img> não conseguem enviar o header Authorization, então a imagem
 * precisa ser servida publicamente via express.static, sem token.
 */
export function getRecipeImageUrl(filename) {
  if (!filename) return null
  return `${UPLOADS_URL}/recipes/${filename}`
}
