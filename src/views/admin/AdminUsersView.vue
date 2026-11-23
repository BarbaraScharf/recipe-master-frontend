<script setup>
/**
 * Usuários do painel. Bloquear pede confirmação; desbloquear é direto.
 * As duas ações esperam a API: o selo só muda com o que o servidor devolveu.
 */
import { ref, reactive, computed } from 'vue'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useDebouncedValue } from '../../composables/useDebouncedValue'
import { useToast } from '../../composables/useToast'
import { useAuth } from '../../composables/useAuth'
import { getAdminUsers, setUserBlocked } from '../../services/adminService'
import { SEARCH } from '../../config/constants'
import { getProfilePictureUrl } from '../../utils/media'
import ConfirmModal from '../../components/base/ConfirmModal.vue'

const toast = useToast()
const { authStore } = useAuth()

const typedText = ref('')
// O watch vai no term (depois da pausa), e não no typedText: uma requisição por pausa
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)

const {
  items: users, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore,
} = usePaginatedList(
  (page) => getAdminUsers(term.value.trim(), page, undefined),
  { itemsKey: 'users', watch: term }
)

const busyIds = reactive(new Set())
const userToBlock = ref(null)
const blockMessage = computed(() => userToBlock.value
  ? `Bloquear @${userToBlock.value.username}?\nA pessoa sai da conta na próxima ação e não consegue mais entrar até ser desbloqueada. As receitas dela continuam no site.`
  : '')

async function changeBlocked(user, isBlocked) {
  if (busyIds.has(user.id)) return
  busyIds.add(user.id)
  try {
    const response = await setUserBlocked(user.id, isBlocked)
    user.isBlocked = response.data.isBlocked
    toast.success(response.message)
    // fecha só no sucesso: se a API recusar, o modal continua aberto
    userToBlock.value = null
  } catch {
    // o toast de erro já veio do interceptor
  } finally {
    busyIds.delete(user.id)
  }
}
</script>

<template>
  <div>
    <!-- Fora do bloco de carregamento, para não perder o foco enquanto a lista recarrega -->
    <div class="search-box mb-3">
      <i class="bi bi-search search-icon" />
      <input
        v-model="typedText"
        type="search"
        class="form-control search-input"
        placeholder="Buscar por usuário, nome ou e-mail"
        aria-label="Buscar usuários"
      />
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando usuários...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="users.length === 0" class="empty-box">
      <p class="mb-0">Nenhum usuário encontrado.</p>
    </div>

    <template v-else>
      <ul class="list-unstyled admin-list">
        <li v-for="user in users" :key="user.id" class="admin-row">
          <img :src="getProfilePictureUrl(user.profilePicture, user.fullName || user.username)" :alt="user.username" class="avatar" />

          <div class="row-body">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <router-link :to="{ name: 'public-profile', params: { username: user.username } }" class="row-title">
                @{{ user.username }}
              </router-link>
              <span v-if="user.isAdmin" class="badge bg-dark">Admin</span>
              <span v-if="user.isBlocked" class="badge bg-danger">Bloqueado</span>
            </div>
            <div class="row-meta">{{ user.fullName }} · {{ user.email }}</div>
            <div class="row-meta">{{ user.recipesCount }} receitas · {{ user.followersCount }} seguidores</div>
          </div>

          <span v-if="user.id === authStore.user?.id" class="row-note">Você</span>
          <span v-else-if="user.isAdmin" class="row-note">Administrador</span>
          <button
            v-else-if="user.isBlocked"
            class="btn btn-sm btn-outline-success row-action"
            :disabled="busyIds.has(user.id)"
            @click="changeBlocked(user, false)"
          >
            {{ busyIds.has(user.id) ? 'Aguarde...' : 'Desbloquear' }}
          </button>
          <button
            v-else
            class="btn btn-sm btn-outline-danger row-action"
            :disabled="busyIds.has(user.id)"
            @click="userToBlock = user"
          >
            <i class="bi bi-slash-circle me-1" />Bloquear
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button class="btn btn-brand px-4" :disabled="isLoadingMore" @click="loadMore">
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
      <p v-if="loadMoreError" class="text-center text-danger mt-3 small">{{ loadMoreError }}</p>
    </template>

    <ConfirmModal
      v-if="userToBlock"
      title="Bloquear usuário"
      :message="blockMessage"
      confirm-label="Bloquear"
      icon="bi-person-slash"
      :busy="busyIds.has(userToBlock.id)"
      @confirm="changeBlocked(userToBlock, true)"
      @close="userToBlock = null"
    />
  </div>
</template>

<style scoped>
.search-box {
  position: relative;
  max-width: 480px;
}
.search-icon {
  position: absolute;
  left: 0.9rem;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
.search-input {
  padding-left: 2.4rem;
  border-radius: 50px;
}
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.admin-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.8rem 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
}
.avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #eee;
}
.row-body {
  flex: 1;
  min-width: 0;
}
.row-title {
  font-weight: 700;
  color: #222;
  text-decoration: none;
}
.row-title:hover {
  color: var(--brand-color);
}
.row-meta {
  font-size: 0.85rem;
  color: #888;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.row-note {
  flex-shrink: 0;
  font-size: 0.85rem;
  color: #999;
}
.row-action {
  flex-shrink: 0;
  border-radius: 50px;
  font-weight: 600;
}
.empty-box {
  text-align: center;
  padding: 2rem 1rem;
  color: #888;
  background: #fff;
  border: 2px dashed #eee;
  border-radius: 16px;
}
</style>

