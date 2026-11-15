<script setup>
import { useAuthenticatedAction } from '../../composables/useAuthenticatedAction'
import { toggleFollow } from '../../services/followService'

const props = defineProps({
  userId: { type: Number, required: true }
})

const following = defineModel('following', { type: Boolean, default: false })
const followersCount = defineModel('followersCount', { type: Number, default: 0 })

// useAuthenticatedAction cuida do visitante (vai para o login) e de cliques repetidos (isBusy).
// O erro da API aparece como toast, aqui só desfazemos a mudança visual.
const { run: handleClick, isBusy } = useAuthenticatedAction(async () => {
  const previousFollowing = following.value
  const previousFollowersCount = followersCount.value
  const nowFollowing = !previousFollowing

  following.value = nowFollowing
  followersCount.value = Math.max(
    0,
    previousFollowersCount + (nowFollowing ? 1 : -1)
  )

  try {
    const response = await toggleFollow(props.userId)
    following.value = response.data.isFollowing
    followersCount.value = response.data.followersCount
  } catch {
    following.value = previousFollowing
    followersCount.value = previousFollowersCount
  }
})</script>

<template>
  <div class="follow-button-wrapper">
    <button
      type="button"
      class="btn"
      :class="following ? 'btn-outline-secondary' : 'btn-brand'"
      :disabled="isBusy"
      :aria-pressed="following"
      @click="handleClick"
    >
      <span v-if="isBusy" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
      <i v-else :class="following ? 'bi bi-person-check me-2' : 'bi bi-person-plus me-2'" />
      {{ following ? 'Seguindo' : 'Seguir' }}
    </button>
  </div>
</template>

<style scoped>
.follow-button-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35rem;
}

</style>

