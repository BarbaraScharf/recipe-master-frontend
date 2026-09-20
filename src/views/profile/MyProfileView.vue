<script setup>
import { ref, onMounted } from 'vue'
import { getMyProfile, updateProfile } from '../../services/authService'
import { getProfilePictureUrl } from '../../utils/media'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const user = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const apiErrorMessage = ref('')
const successMessage = ref('')

const form = ref({
  fullName: '',
  bio: '',
})

const previewUrl = ref(null)
const selectedFile = ref(null)

onMounted(async () => {
  try {
    const response = await getMyProfile()
    user.value = response.data
    form.value.fullName = response.data.fullName || ''
    form.value.bio = response.data.bio || ''
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isLoading.value = false
  }
})

function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return
  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
}

async function handleSubmit() {
  apiErrorMessage.value = ''
  successMessage.value = ''
  isSaving.value = true

  try {
    const formData = new FormData()
    formData.append('fullName', form.value.fullName)
    formData.append('bio', form.value.bio)
    if (selectedFile.value) {
      formData.append('profilePicture', selectedFile.value)
    }

    const response = await updateProfile(formData)
    user.value = response.data
    form.value.fullName = response.data.fullName || ''
    form.value.bio = response.data.bio || ''
    previewUrl.value = null
    selectedFile.value = null
    successMessage.value = 'Perfil atualizado com sucesso!'
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando...
    </div>

    <div v-else-if="user" class="d-flex flex-column align-items-center gap-4">

      <!-- Card de perfil centralizado -->
      <div class="profile-card card shadow-sm p-4 d-flex flex-column flex-md-row align-items-center gap-4">

        <!-- Foto + info -->
        <div class="text-center" style="min-width: 160px;">
          <img
            :src="previewUrl || getProfilePictureUrl(user.profilePicture)"
            :alt="user.username"
            class="profile-avatar rounded-circle mb-3"
          />
          <label class="btn btn-outline-secondary btn-sm d-block mx-auto" style="cursor:pointer; max-width:140px;">
            <i class="bi bi-camera me-1" />Trocar foto
            <input
              id="profilePicture"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="d-none"
              @change="handleFileChange"
            />
          </label>
          <div class="mt-3">
            <p class="fw-bold mb-1 fs-5">@{{ user.username }}</p>
            <p class="text-muted small mb-1">{{ user.email }}</p>
            <p class="small mb-1"><i class="bi bi-book me-1" />{{ user.recipesCount }} receitas publicadas</p>
            <p class="small text-muted">{{ user.followersCount }} seguidores · {{ user.followingCount }} seguindo</p>
          </div>
        </div>

        <!-- Divider vertical -->
        <div class="vr d-none d-md-block" style="height: auto; align-self: stretch;" />

        <!-- Formulário -->
        <div class="flex-grow-1 w-100">
          <h5 class="fw-bold mb-3" style="color: var(--brand-color);">
            <i class="bi bi-pencil-square me-2" />Editar Perfil
          </h5>
          <form @submit.prevent="handleSubmit" novalidate>
            <BaseInput
              id="fullName"
              v-model="form.fullName"
              label="Nome completo"
              placeholder="Seu nome completo"
            />
            <BaseInput
              id="bio"
              v-model="form.bio"
              label="Bio"
              placeholder="Conte um pouco sobre você..."
              :rows="3"
              :maxlength="255"
            />

            <div v-if="apiErrorMessage" class="alert alert-danger py-2 mt-1 mb-2" role="alert">
              <i class="bi bi-exclamation-circle me-2" />{{ apiErrorMessage }}
            </div>
            <div v-if="successMessage" class="alert alert-success py-2 mt-1 mb-2" role="alert">
              <i class="bi bi-check-circle me-2" />{{ successMessage }}
            </div>

            <BaseButton
              label="Salvar alterações"
              loading-label="Salvando..."
              :loading="isSaving"
            />
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.profile-card {
  width: 100%;
  max-width: 1200px;
  border-radius: 14px;
  border: none;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  padding: 2rem !important;
}

.profile-avatar {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border: 4px solid var(--brand-color);
}
</style>
