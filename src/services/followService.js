import api from './api'

export function toggleFollow(userId) {
  return api.post(`/users/${userId}/toggle-follow`)
}

export function getFollowStatus(userId) {
  return api.get(`/users/${userId}/follow-status`)
}

export function getFollowers(userId) {
  return api.get(`/users/${userId}/followers`)
}

export function getFollowing(userId) {
  return api.get(`/users/${userId}/following`)
}

export function getFollowingRecipes(page = 1, limit = 12) {
  return api.get('/following-recipes', { params: { page, limit } })
}
