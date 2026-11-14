<script setup>
/**
 * PublicProfileView — perfil público de um usuário. (Aula 11)
 *
 * - Dono do perfil:    botão "Editar Perfil"
 * - Logado (não dono): FollowButton com atualização otimista
 * - Visitante:         FollowButton (redireciona para login ao clicar)
 *
 * isOwner e isFollowing vêm da API (calculados com optionalAuth no backend).
 * Os números seguidores/seguindo viram router-links para as listas.
 */
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter }   from 'vue-router'
import { getPublicProfile }      from '../../services/userService'
import { useAuth }               from '../../composables/useAuth'
import { getProfilePictureUrl }  from '../../utils/media'
import RecipeCard   from '../../components/recipe/RecipeCard.vue'
import FollowButton from '../../components/user/FollowButton.vue'

const route  = useRoute()
const router = useRouter()
const { authStore } = useAuth()

const profile   = ref(null)
const isLoading = ref(true)
const errorMsg  = ref('')

async function loadProfile(username) {
  isLoading.value = true
  errorMsg.value  = ''
  profile.value   = null
  try {
    const response = await getPublicProfile(username)
    profile.value  = response.data
  } catch (err) {
    errorMsg.value = err.message
  } finally {
    isLoading.value = false
  }
}

onMounted(() => loadProfile(route.params.username))

watch(() => route.params.username, (newUsername) => {
  if (newUsername) loadProfile(newUsername)
})
</script>

<template>
  <div class="container py-4" style="max-width: 860px; margin: 0 auto;">

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando perfil...
    </div>

    <div v-else-if="errorMsg" class="text-center py-5">
      <i class="bi bi-person-x text-danger" style="font-size:3rem;" />
      <p class="mt-3 text-danger fw-semibold">{{ errorMsg }}</p>
      <button class="btn btn-brand mt-2" @click="router.back()">
        <i class="bi bi-arrow-left me-2" />Voltar
      </button>
    </div>

    <div v-else-if="profile">

      <!-- Cabeçalho do perfil -->
      <div class="profile-header mb-5">
        <img
          :src="getProfilePictureUrl(profile.profilePicture, profile.fullName || profile.username)"
          :alt="profile.username"
          class="profile-avatar"
        />
        <div class="profile-info">
          <h2 class="fw-bold mb-0" style="font-size:1.8rem;">{{ profile.fullName || profile.username }}</h2>
          <p class="text-muted mb-2" style="font-size:1rem;">@{{ profile.username }}</p>
          <p v-if="profile.bio" class="text-secondary mb-3" style="font-size:0.95rem; max-width:480px;">{{ profile.bio }}</p>

          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-number">{{ profile.recipesCount }}</span>
              <span class="stat-label">receitas</span>
            </div>
            <!-- Seguidores e Seguindo viram links para as listas -->
            <router-link
              :to="{ name: 'profile-followers', params: { username: profile.username } }"
              class="stat-item text-decoration-none"
            >
              <span class="stat-number">{{ profile.followersCount }}</span>
              <span class="stat-label">seguidores</span>
            </router-link>
            <router-link
              :to="{ name: 'profile-following', params: { username: profile.username } }"
              class="stat-item text-decoration-none"
            >
              <span class="stat-number">{{ profile.followingCount }}</span>
              <span class="stat-label">seguindo</span>
            </router-link>
          </div>
        </div>

        <!-- Ações -->
        <div class="profile-actions">
          <!-- Dono: Editar Perfil -->
          <router-link v-if="profile.isOwner" to="/profile/me" class="btn btn-brand">
            <i class="bi bi-pencil-square me-2" />Editar Perfil
          </router-link>

          <!-- Não-dono: FollowButton (funciona para logado e visitante) -->
          <FollowButton
            v-else
            :user-id="profile.id"
            v-model:following="profile.isFollowing"
            v-model:followers-count="profile.followersCount"
          />
        </div>
      </div>

      <!-- Receitas do usuário -->
      <h5 class="fw-bold mb-3" style="color: var(--brand-color)">
        <i class="bi bi-grid me-2" />Receitas publicadas
      </h5>

      <div v-if="!profile.recipes || profile.recipes.length === 0" class="text-center py-4 text-muted">
        <i class="bi bi-journal-x" style="font-size:2.5rem;" />
        <p class="mt-2">Nenhuma receita publicada ainda.</p>
      </div>

      <div v-else class="recipe-grid">
        <RecipeCard
          v-for="recipe in profile.recipes"
          :key="recipe.id"
          :recipe="{ ...recipe, author: { username: profile.username, fullName: profile.fullName, profilePicture: profile.profilePicture } }"
          :show-author="false"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  flex-wrap: wrap;
  padding: 1.5rem;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.07);
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--brand-color);
  flex-shrink: 0;
}

.profile-info { flex: 1; min-width: 200px; }

.profile-stats {
  display: flex;
  gap: 2rem;
  margin-top: 0.5rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
}

.stat-item:hover .stat-number {
  color: var(--brand-color);
}

.stat-number {
  font-size: 1.3rem;
  font-weight: 700;
  color: #222;
  transition: color 0.15s;
}

.stat-label {
  font-size: 0.8rem;
  color: #888;
}

.profile-actions {
  align-self: flex-start;
  margin-left: auto;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}
</style>
