const UPLOADS_URL = import.meta.env.VITE_UPLOADS_URL

export function getProfilePictureUrl(filename) {
  if (!filename || filename === 'default-profile.png') {
    // Placeholder genérico enquanto o usuário não tem foto
    return 'https://ui-avatars.com/api/?background=e25822&color=fff&size=128&name=User'
  }
  return `${UPLOADS_URL}/profiles/${filename}`
}
