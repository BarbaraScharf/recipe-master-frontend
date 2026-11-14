<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPublicProfile } from '../../services/userService'
import { getFollowers, getFollowing } from '../../services/followService'
import { getProfilePictureUrl } from '../../utils/media'

const props = defineProps({
  kind: { type: String, required: true, validator: value => ['followers', 'following'].includes(value) }
})

const route = useRoute()
const router = useRouter()
const profile = ref(null)
const users = ref([])
const isLoading = ref(true)
const errorMsg = ref('')
let requestId = 0

async function loadList() {
  const currentRequest = ++requestId
  const username = route.params.username
  profile.value = null
  users.value = []
  errorMsg.value = ''
  isLoading.value = true

  try {
    const profileResponse = await getPublicProfile(username)
    const loadedProfile = profileResponse.data
    const listResponse = props.kind === 'followers'
      ? await getFollowers(loadedProfile.id)
      : await getFollowing(loadedProfile.id)

    if (currentRequest !== requestId) return
    profile.value = loadedProfile
    users.value = listResponse.data
  } catch (error) {
    if (currentRequest === requestId) {
      errorMsg.value = error.message
    }
  } finally {
    if (currentRequest === requestId) {
      isLoading.value = false
    }
  }
}

watch(() => [props.kind, route.params.username], loadList, { immediate: true })
</script>

<template>
  <div class="container py-4" style="max-width: 760px;">
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando lista...
    </div>

    <div v-else-if="errorMsg" class="text-center py-5">
      <p class="text-danger fw-semibold">{{ errorMsg }}</p>
      <button class="btn btn-outline-secondary" @click="router.back()">Voltar</button>
    </div>

    <template v-else-if="profile">
      <div class="d-flex align-items-center justify-content-between gap-3 mb-4 p-4 bg-white rounded-3 shadow-sm">
        <div class="d-flex align-items-center gap-3">
          <div>
            <h4 class="fw-bold mb-0" style="color: var(--brand-color)">
              {{ profile.fullName || profile.username }}
            </h4>
            <p class="text-muted mb-0 small">@{{ profile.username }}</p>
          </div>
        </div>
        <router-link
          :to="{ name: 'public-profile', params: { username: profile.username } }"
          class="btn btn-brand btn-sm"
        >
          <i class="bi bi-arrow-left me-1" />Perfil
        </router-link>
      </div>

      <div class="bg-white rounded-3 shadow-sm overflow-hidden">
        <nav class="follow-tabs nav nav-tabs px-3 pt-2" aria-label="Listas de seguidores">
          <router-link
            :to="{ name: 'profile-followers', params: { username: profile.username } }"
            class="nav-link"
            :class="{ active: kind === 'followers' }"
          >
            <i class="bi bi-people me-1" />Seguidores
          </router-link>
          <router-link
            :to="{ name: 'profile-following', params: { username: profile.username } }"
            class="nav-link"
            :class="{ active: kind === 'following' }"
          >
            <i class="bi bi-person-check me-1" />Seguindo
          </router-link>
        </nav>

        <div class="p-3">
          <p v-if="users.length === 0" class="text-center text-muted py-4 mb-0">
            {{ kind === 'followers'
              ? `${profile.fullName || profile.username} ainda não tem seguidores.`
              : `${profile.fullName || profile.username} ainda não segue ninguém.` }}
          </p>

          <ul v-else class="list-unstyled mb-0">
            <li v-for="user in users" :key="user.id" class="border-bottom last-no-border">
              <router-link
                :to="{ name: 'public-profile', params: { username: user.username } }"
                class="user-link py-3 px-2"
              >
                <img
                  :src="getProfilePictureUrl(user.profilePicture, user.fullName || user.username)"
                  :alt="user.username"
                  class="user-avatar"
                />
                <span>
                  <strong class="d-block">{{ user.fullName || user.username }}</strong>
                  <small class="text-muted">@{{ user.username }}</small>
                </span>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.follow-tabs .nav-link {
  color: #555;
  font-weight: 500;
}

.follow-tabs .nav-link.active {
  color: var(--brand-color);
  font-weight: 700;
  border-bottom-color: var(--brand-color);
}

.user-link {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: inherit;
  text-decoration: none;
  transition: background 0.15s;
  border-radius: 8px;
}

.user-link:hover strong {
  color: var(--brand-color);
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--brand-color);
  flex-shrink: 0;
}

.last-no-border:last-child {
  border-bottom: none !important;
}
</style>
