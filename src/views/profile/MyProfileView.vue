<script setup>
import { ref, onMounted } from 'vue'
import { getMyProfile, updateProfile } from '../../services/authService'
import { getProfilePictureUrl } from '../../utils/media'

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
  <div class="profile-page">
    <h1>Meu Perfil</h1>

    <div v-if="isLoading" class="loading">Carregando...</div>

    <div v-else-if="user" class="profile-content">
      <div class="profile-picture-section">
        <img
          :src="previewUrl || getProfilePictureUrl(user.profilePicture)"
          :alt="user.username"
          class="profile-picture"
        />
        <label class="btn-upload" for="profilePicture">Trocar foto</label>
        <input
          id="profilePicture"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          @change="handleFileChange"
          style="display:none"
        />
      </div>

      <div class="profile-info">
        <p><strong>@{{ user.username }}</strong></p>
        <p>{{ user.email }}</p>
        <p>{{ user.recipesCount }} receitas publicadas</p>
        <p>{{ user.followersCount }} seguidores · {{ user.followingCount }} seguindo</p>
      </div>

      <form @submit.prevent="handleSubmit" class="profile-form">
        <div class="field">
          <label for="fullName">Nome completo</label>
          <input id="fullName" type="text" v-model="form.fullName" />
        </div>

        <div class="field">
          <label for="bio">Bio</label>
          <textarea id="bio" v-model="form.bio" rows="3" maxlength="255"></textarea>
        </div>

        <p v-if="apiErrorMessage" class="api-error">{{ apiErrorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

        <button type="submit" :disabled="isSaving">
          {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </form>
    </div>
  </div>
</template>
