import api from './api'
import { PAGE_SIZE } from '../config/constants'

export function getNotifications(page = 1, limit = PAGE_SIZE) {
  return api.get('/notifications', { params: { page, limit } })
}

export function getUnreadCount() {
  return api.get('/notifications/unread-count')
}

// É uma ação (POST): se falhar, o interceptor mostra o toast de erro
export function markNotificationAsRead(notificationId) {
  return api.post(`/notifications/${notificationId}/read`)
}
