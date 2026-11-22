<script setup>
/**
 * NotificationsView — avisos de quem curtiu, comentou ou passou a seguir.
 *
 * Caminhos de clique (Aula 14):
 *   - Sino na Navbar → esta tela
 *   - Botão "Marcar como lida" na linha, ou clique no texto (marca e navega)
 *   - Texto: seguir → perfil de quem seguiu; curtir/comentar → a receita
 *   - "Carregar mais" no fim e "Atualizar" no topo
 *
 * Marcar como lida é o quarto caso do runOptimistic (utils/optimistic.js não muda).
 * O desfazer do sino é relativo (+1): se duas linhas falharem juntas, cada uma devolve
 * o seu 1, e o sino volta ao número do começo. "Voltar ao número que eu vi" erraria.
 *
 * Lacuna conhecida: esta lista não se atualiza sozinha; só o número do sino.
 */
import { reactive } from 'vue'
import { getNotifications, markNotificationAsRead } from '../services/notificationService'
import { usePaginatedList } from '../composables/usePaginatedList'
import { useNotificationStore } from '../stores/notifications'
import { runOptimistic } from '../utils/optimistic'
import { getProfilePictureUrl } from '../utils/media'
import { timeAgo } from '../utils/format'
import { NOTIFICATION_TEXT } from '../config/constants'

const notificationStore = useNotificationStore()

const {
  items: notifications, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore, reload,
} = usePaginatedList((page, limit) => getNotifications(page, limit), { itemsKey: 'notifications' })

// ids com requisição em andamento: a "cerca" por linha (clique duplo → uma requisição)
const busyIds = reactive(new Set())

function markAsRead(notification) {
  if (notification.isRead || busyIds.has(notification.id)) return
  busyIds.add(notification.id)

  runOptimistic({
    apply: () => {
      notification.isRead = true
      notificationStore.setUnreadCount(notificationStore.unreadCount - 1)
      return () => {
        notification.isRead = false
        // relativo: devolve o 1 que tirou, sem voltar a um número antigo
        notificationStore.setUnreadCount(notificationStore.unreadCount + 1)
      }
    },
    request: () => markNotificationAsRead(notification.id),
    confirm: (data) => {
      notification.isRead = data.isRead
      notificationStore.setUnreadCount(data.unreadCount)
    },
  }).finally(() => busyIds.delete(notification.id))
}

// Para onde o clique leva: seguir → perfil de quem seguiu; o resto → a receita
function targetOf(notification) {
  if (notification.type === 'follow' || !notification.recipeId) {
    return { name: 'public-profile', params: { username: notification.Actor?.username } }
  }
  return { name: 'recipe-detail', params: { id: notification.recipeId } }
}

function actorName(notification) {
  return notification.Actor?.username ?? 'alguém'
}

function refreshAll() {
  reload()
  notificationStore.refresh()
}
</script>

<template>
  <div class="container py-4" style="max-width: 760px;">
    <div class="d-flex align-items-center justify-content-between mb-4 gap-2 flex-wrap">
      <h2 class="fw-bold mb-0" style="color: var(--brand-color)">
        <i class="bi bi-bell me-2" />Notificações
      </h2>
      <button class="btn btn-outline-secondary" :disabled="isLoading" @click="refreshAll">
        <i class="bi bi-arrow-clockwise me-2" />Atualizar
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando notificações...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="notifications.length === 0" class="state-card">
      <div class="state-icon"><i class="bi bi-bell-slash" /></div>
      <h5 class="fw-bold mb-2">Nenhuma notificação por enquanto</h5>
      <p class="text-muted mb-0">
        Quando alguém curtir ou comentar uma receita sua, ou começar a seguir você, o aviso aparece aqui.
      </p>
    </div>

    <template v-else>
      <ul class="list-unstyled notification-list">
        <li
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.isRead }"
        >
          <img
            :src="getProfilePictureUrl(notification.Actor?.profilePicture, notification.Actor?.fullName || notification.Actor?.username)"
            :alt="actorName(notification)"
            class="notification-avatar"
          />

          <div class="notification-body">
            <router-link :to="targetOf(notification)" class="notification-text" @click="markAsRead(notification)">
              <strong>@{{ actorName(notification) }}</strong>
              {{ NOTIFICATION_TEXT[notification.type] }}<template v-if="notification.recipe">: <span class="recipe-name">{{ notification.recipe.title }}</span></template>
            </router-link>
            <span class="notification-time">{{ timeAgo(notification.createdAt) }}</span>
          </div>

          <button
            v-if="!notification.isRead"
            class="btn btn-sm mark-btn"
            :disabled="busyIds.has(notification.id)"
            @click="markAsRead(notification)"
          >
            <i class="bi bi-check2 me-1" />Marcar como lida
          </button>
          <span v-else class="read-label"><i class="bi bi-check2-all me-1" />Lida</span>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-4">
        <button class="btn btn-brand px-4" :disabled="isLoadingMore" @click="loadMore">
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais notificações' }}
        </button>
      </div>
      <p v-if="loadMoreError" class="text-center text-danger mt-3 small">{{ loadMoreError }}</p>
    </template>
  </div>
</template>

<style scoped>
.notification-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.notification-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1.1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  transition: background 0.2s;
}
/* Não lidas em destaque: fundo laranja-claro, faixa na esquerda e texto em negrito */
.notification-item.unread {
  background: #fff6f1;
  border-color: #ffe0d1;
}
.notification-item.unread .notification-avatar {
  border-color: var(--brand-color);
}
.notification-item.unread .notification-text {
  font-weight: 600;
}
/* Foto com um aro: fica bonita mesmo quando a imagem tem fundo branco */
.notification-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #eee;
  background: #fff;
}
.notification-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.notification-text {
  color: #333;
  text-decoration: none;
  font-weight: 400;
}
.notification-text:hover {
  color: var(--brand-color);
}
.recipe-name {
  color: var(--brand-color);
}
.notification-time {
  font-size: 0.8rem;
  color: #999;
}
.mark-btn {
  flex-shrink: 0;
  border: none;
  border-radius: 50px;
  color: var(--brand-color);
  background: transparent;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 0.3rem 0.7rem;
}
.mark-btn:hover:not(:disabled) {
  background: #ffe8dc;
  color: var(--brand-color);
}
.read-label {
  flex-shrink: 0;
  font-size: 0.8rem;
  color: #aaa;
}
.state-card {
  max-width: 520px;
  margin: 1rem auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  text-align: center;
}
.state-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
}
@media (max-width: 576px) {
  .notification-item {
    flex-wrap: wrap;
  }
  .mark-btn,
  .read-label {
    margin-left: 3.2rem;
  }
}
</style>
