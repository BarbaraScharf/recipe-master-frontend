<script setup>
/**
 * LikeButton — botão de curtida com atualização otimista.
 *
 * Atualização otimista — três passos:
 *   1. Atualiza a UI imediatamente (antes de chamar a API)
 *   2. Chama a API
 *   3. Se a API falhar, desfaz (rollback) a mudança visual e mostra erro
 *
 * Quando NÃO usar otimismo: ações destrutivas (delete), pagamentos, ou
 * qualquer ação que não seja facilmente reversível na UI.
 *
 * Visitante: clicar em curtir redireciona para /login?redirect=<currentPath>
 * e volta ao detalhe depois de entrar (graças ao guarda de rota existente).
 */
import { ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toggleLike } from '../../services/likeService'
import { useAuth } from '../../composables/useAuth'
import { formatCount } from '../../utils/format'

const props = defineProps({
  recipeId:   { type: Number, required: true },
  liked:      { type: Boolean, default: false },
  likesCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:liked', 'update:likesCount'])

const { authStore } = useAuth()
const router = useRouter()
const route  = useRoute()

const localLiked      = ref(props.liked)
const localLikesCount = ref(props.likesCount)
const isBusy          = ref(false)
const errorMsg        = ref('')

// Sincroniza quando o pai atualizar as props
watch(() => props.liked,      v => { localLiked.value      = v })
watch(() => props.likesCount, v => { localLikesCount.value = v })

async function handleClick() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }

  if (isBusy.value) return
  isBusy.value = true
  errorMsg.value = ''

  // Passo 1 — atualiza UI imediatamente (otimista)
  const previousLiked      = localLiked.value
  const previousLikesCount = localLikesCount.value
  localLiked.value      = !localLiked.value
  localLikesCount.value = localLiked.value ? previousLikesCount + 1 : previousLikesCount - 1

  try {
    // Passo 2 — chama a API
    const response = await toggleLike(props.recipeId)
    // Sincroniza com o valor real retornado pela API
    localLiked.value      = response.data.liked
    localLikesCount.value = response.data.likesCount
    emit('update:liked',      localLiked.value)
    emit('update:likesCount', localLikesCount.value)
  } catch (err) {
    // Passo 3 — rollback
    localLiked.value      = previousLiked
    localLikesCount.value = previousLikesCount
    errorMsg.value = err.message || 'Erro ao curtir.'
  } finally {
    isBusy.value = false
  }
}
</script>

<template>
  <div class="like-btn-wrapper">
    <button
      class="like-btn"
      :class="{ 'liked': localLiked, 'busy': isBusy }"
      :disabled="isBusy"
      :aria-label="localLiked ? 'Descurtir receita' : 'Curtir receita'"
      :aria-pressed="localLiked"
      @click="handleClick"
    >
      <i :class="localLiked ? 'bi bi-heart-fill' : 'bi bi-heart'" />
      <span>{{ formatCount(localLikesCount) }}</span>
    </button>
    <p v-if="errorMsg" class="like-error">{{ errorMsg }}</p>
  </div>
</template>

<style scoped>
.like-btn-wrapper {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
}

.like-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border: 2px solid #e9ecef;
  border-radius: 50px;
  background: #fff;
  font-size: 0.95rem;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  transition: all 0.15s;
}

.like-btn:hover:not(:disabled) {
  border-color: #e25822;
  color: #e25822;
}

.like-btn.liked {
  background: #fff0eb;
  border-color: #e25822;
  color: #e25822;
}

.like-btn.busy {
  opacity: 0.6;
  cursor: not-allowed;
}

.like-error {
  font-size: 0.8rem;
  color: #dc3545;
  margin: 0;
}
</style>
