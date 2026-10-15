<script setup>
/**
 * CommentSection — seção de comentários de uma receita.
 *
 * Segurança: o texto do comentário NUNCA usa v-html — sempre {{ }}
 * para evitar XSS. O v-html interpretaria tags HTML como <script> ou
 * <img onerror="...">, executando código malicioso.
 *
 * Quebras de linha são preservadas via CSS white-space: pre-line.
 */
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { addComment, getComments } from '../../services/commentService'
import { useAuth } from '../../composables/useAuth'
import { getProfilePictureUrl } from '../../utils/media'
import { timeAgo } from '../../utils/format'

const props = defineProps({
  recipeId: { type: Number, required: true }
})

const emit = defineEmits(['commentAdded'])

const { authStore } = useAuth()
const router = useRouter()
const route  = useRoute()

const comments    = ref([])
const isLoading   = ref(true)
const errorMsg    = ref('')
const newContent  = ref('')
const formError   = ref('')
const isSubmitting = ref(false)

const COMMENT_MAX = 500

onMounted(async () => {
  await loadComments()
})

async function loadComments() {
  isLoading.value = true
  errorMsg.value = ''
  try {
    const response = await getComments(props.recipeId)
    comments.value = response.data.comments
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}

function validateForm() {
  formError.value = ''
  const trimmed = newContent.value.trim()
  if (!trimmed) {
    formError.value = 'O comentário não pode ser vazio.'
    return false
  }
  if (trimmed.length > COMMENT_MAX) {
    formError.value = `O comentário deve ter no máximo ${COMMENT_MAX} caracteres.`
    return false
  }
  return true
}

async function handleSubmit() {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    const response = await addComment(props.recipeId, newContent.value.trim())
    // Novo comentário no topo, sem recarregar a lista
    comments.value.unshift(response.data)
    newContent.value = ''
    formError.value  = ''
    emit('commentAdded')
  } catch (err) {
    formError.value = err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="comment-section">
    <h5 class="comment-title">
      <i class="bi bi-chat-dots me-2" />Comentários
      <span class="comment-count">{{ comments.length }}</span>
    </h5>

    <!-- Formulário — só para logados -->
    <div v-if="authStore.isAuthenticated" class="comment-form mb-4">
      <div class="d-flex gap-2 align-items-start">
        <img
          :src="getProfilePictureUrl(authStore.user?.profilePicture, authStore.user?.fullName || authStore.user?.username)"
          :alt="authStore.user?.username"
          class="comment-avatar mt-1"
        />
        <div class="flex-grow-1">
          <textarea
            v-model="newContent"
            class="form-control comment-textarea"
            :class="{ 'is-invalid': formError }"
            rows="2"
            placeholder="Escreva um comentário..."
            :maxlength="COMMENT_MAX + 1"
          />
          <div class="d-flex justify-content-between align-items-center mt-1">
            <span v-if="formError" class="text-danger small">{{ formError }}</span>
            <span v-else class="text-muted" style="font-size:0.78rem;">{{ newContent.trim().length }}/{{ COMMENT_MAX }}</span>
            <button
              class="btn btn-brand btn-sm px-3"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1" />
              {{ isSubmitting ? 'Enviando...' : 'Comentar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Aviso para visitante -->
    <div v-else class="visitor-notice mb-3">
      <i class="bi bi-lock me-2" />
      <router-link :to="{ name: 'login', query: { redirect: $route.fullPath } }">Faça login</router-link>
      para comentar.
    </div>

    <!-- Carregando -->
    <div v-if="isLoading" class="text-center py-3 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando comentários...
    </div>

    <!-- Erro -->
    <div v-else-if="errorMsg" class="alert alert-danger py-2">{{ errorMsg }}</div>

    <!-- Lista vazia -->
    <div v-else-if="comments.length === 0" class="text-center py-3 text-muted">
      <i class="bi bi-chat-square me-2" />Nenhum comentário ainda. Seja o primeiro!
    </div>

    <!-- Lista de comentários -->
    <div v-else class="comment-list">
      <div
        v-for="comment in comments"
        :key="comment.id"
        class="comment-item"
      >
        <img
          :src="getProfilePictureUrl(comment.author?.profilePicture, comment.author?.fullName || comment.author?.username)"
          :alt="comment.author?.username"
          class="comment-avatar"
        />
        <div class="comment-body">
          <div class="comment-header">
            <router-link
              :to="{ name: 'public-profile', params: { username: comment.author?.username } }"
              class="comment-author"
            >
              {{ comment.author?.fullName || comment.author?.username }}
            </router-link>
            <span class="comment-username">@{{ comment.author?.username }}</span>
            <span class="comment-dot">·</span>
            <span class="comment-time">{{ timeAgo(comment.createdAt) }}</span>
          </div>
          <!-- {{ }} para evitar XSS — NUNCA v-html aqui -->
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-section {
  margin-top: 2rem;
  border-top: 2px solid #f0f0f0;
  padding-top: 1.5rem;
}

.comment-title {
  font-weight: 700;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.comment-count {
  background: var(--brand-color);
  color: #fff;
  border-radius: 50px;
  padding: 0.1rem 0.5rem;
  font-size: 0.8rem;
}

.comment-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.comment-textarea {
  resize: none;
  border-radius: 10px;
  font-size: 0.9rem;
}

.visitor-notice {
  color: #888;
  font-size: 0.9rem;
  padding: 0.75rem 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.comment-body {
  flex: 1;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--brand-color);
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  flex-wrap: wrap;
}

.comment-author {
  font-weight: 700;
  font-size: 0.95rem;
  color: #222;
  text-decoration: none;
}

.comment-author:hover {
  color: var(--brand-color);
}

.comment-username {
  font-size: 0.82rem;
  color: #aaa;
}

.comment-dot {
  color: #ccc;
  font-size: 0.8rem;
}

.comment-time {
  font-size: 0.82rem;
  color: #bbb;
}

.comment-text {
  font-size: 0.92rem;
  color: #333;
  margin: 0;
  white-space: pre-line;
  line-height: 1.6;
}
</style>
