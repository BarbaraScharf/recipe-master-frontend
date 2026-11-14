<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toggleFollow } from '../../services/followService'

defineProps({
  userId: { type: Number, required: true }
})

const following = defineModel('following', { type: Boolean, default: false })
const followersCount = defineModel('followersCount', { type: Number, default: 0 })

const route = useRoute()
const router = useRouter()
const isBusy = ref(false)
const errorMsg = ref('')

async function handleClick(userId) {
  if (isBusy.value) return

  isBusy.value = true
  errorMsg.value = ''

  const previousFollowing = following.value
  const previousFollowersCount = followersCount.value
  const nowFollowing = !previousFollowing

  following.value = nowFollowing
  followersCount.value = Math.max(
    0,
    previousFollowersCount + (nowFollowing ? 1 : -1)
  )

  try {
    const response = await toggleFollow(userId)
    following.value = response.data.isFollowing
    followersCount.value = response.data.followersCount
  } catch (error) {
    following.value = previousFollowing
    followersCount.value = previousFollowersCount
    errorMsg.value = error.message || 'Não foi possível atualizar o seguimento.'
  } finally {
    isBusy.value = false
  }
}

function followOrLogin(userId) {
  if (!localStorage.getItem('auth_token')) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  handleClick(userId)
}
</script>

<template>
  <div class="follow-button-wrapper">
    <button
      type="button"
      class="btn"
      :class="following ? 'btn-outline-secondary' : 'btn-brand'"
      :disabled="isBusy"
      :aria-pressed="following"
      @click="followOrLogin(userId)"
    >
      <span v-if="isBusy" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
      <i v-else :class="following ? 'bi bi-person-check me-2' : 'bi bi-person-plus me-2'" />
      {{ following ? 'Seguindo' : 'Seguir' }}
    </button>
    <p v-if="errorMsg" class="follow-error" role="alert">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.follow-button-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

.follow-error {
  max-width: 260px;
  margin: 0;
  color: #dc3545;
  font-size: 0.8rem;
}
</style>
