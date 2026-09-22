<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createRecipe } from '../services/recipeService'
import FormCard from '../components/base/FormCard.vue'
import BaseInput from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

const router = useRouter()

const CATEGORIES = [
  'Café da manhã', 'Almoço', 'Jantar', 'Sobremesa',
  'Lanche', 'Bebida', 'Salada', 'Sopa', 'Outro'
]

const form = reactive({
  title: '',
  description: '',
  ingredients: '',
  instructions: '',
  category: '',
  prepTime: '',
  servings: '',
})

const errors = reactive({
  title: '',
  ingredients: '',
  instructions: '',
  category: '',
})

const imageFile    = ref(null)
const previewUrl   = ref(null)
const uploadProgress = ref(0)
const isUploading  = ref(false)
const apiError     = ref('')
const successMsg   = ref('')

function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  imageFile.value = file
  // Prévia local — sem chamada de rede
  previewUrl.value = URL.createObjectURL(file)
}

function validate() {
  Object.keys(errors).forEach(k => (errors[k] = ''))

  if (!form.title.trim())        errors.title        = 'O título é obrigatório.'
  if (!form.ingredients.trim())  errors.ingredients  = 'Os ingredientes são obrigatórios.'
  if (!form.instructions.trim()) errors.instructions = 'O modo de preparo é obrigatório.'
  if (!form.category)            errors.category     = 'Selecione uma categoria.'

  return Object.values(errors).every(m => m === '')
}

async function handleSubmit() {
  apiError.value   = ''
  successMsg.value = ''

  if (!validate()) return

  const formData = new FormData()
  formData.append('title',        form.title.trim())
  formData.append('description',  form.description.trim())
  formData.append('ingredients',  form.ingredients.trim())
  formData.append('instructions', form.instructions.trim())
  formData.append('category',     form.category)
  if (form.prepTime) formData.append('prepTime', form.prepTime)
  if (form.servings) formData.append('servings', form.servings)
  if (imageFile.value) formData.append('image', imageFile.value)

  isUploading.value    = true
  uploadProgress.value = 0

  try {
    const response = await createRecipe(formData, (percent) => {
      uploadProgress.value = percent
    })
    successMsg.value = response.message || 'Receita publicada com sucesso!'
    setTimeout(() => router.push({ name: 'feed' }), 1500)
  } catch (err) {
    apiError.value = err.message
  } finally {
    isUploading.value = false
  }
}
</script>

<template>
  <div class="container py-4">
    <FormCard title="Nova Receita" icon="bi-journal-plus">
      <form @submit.prevent="handleSubmit" novalidate>

        <!-- Imagem da receita -->
        <div class="mb-4">
          <label class="form-label fw-semibold">Foto da receita</label>
          <div
            v-if="previewUrl"
            class="recipe-preview mb-2"
          >
            <img :src="previewUrl" alt="Prévia da receita" class="recipe-preview-img" />
          </div>
          <label class="btn btn-outline-secondary w-100" style="cursor:pointer;">
            <i class="bi bi-camera me-2" />
            {{ previewUrl ? 'Trocar imagem' : 'Escolher imagem' }}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              class="d-none"
              @change="handleImageChange"
            />
          </label>
        </div>

        <!-- Campos de texto -->
        <BaseInput
          id="title"
          v-model="form.title"
          label="Título da receita *"
          placeholder="Ex.: Bolo de cenoura com cobertura"
          :error="errors.title"
        />

        <!-- Categoria -->
        <div class="mb-4">
          <label for="category" class="form-label fw-semibold">Categoria *</label>
          <select
            id="category"
            v-model="form.category"
            class="form-select form-select-lg"
            :class="{ 'is-invalid': errors.category }"
          >
            <option value="" disabled>Selecione uma categoria</option>
            <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <div v-if="errors.category" class="invalid-feedback d-block">{{ errors.category }}</div>
        </div>

        <BaseInput
          id="description"
          v-model="form.description"
          label="Descrição"
          placeholder="Uma breve descrição da receita..."
          :rows="2"
        />

        <BaseInput
          id="ingredients"
          v-model="form.ingredients"
          label="Ingredientes *"
          placeholder="Liste os ingredientes, um por linha..."
          :rows="5"
          :error="errors.ingredients"
        />

        <BaseInput
          id="instructions"
          v-model="form.instructions"
          label="Modo de preparo *"
          placeholder="Descreva o passo a passo..."
          :rows="6"
          :error="errors.instructions"
        />

        <!-- Tempo e porções -->
        <div class="row g-3 mb-4">
          <div class="col-6">
            <label for="prepTime" class="form-label fw-semibold">Tempo de preparo (min)</label>
            <input
              id="prepTime"
              v-model="form.prepTime"
              type="number"
              min="1"
              class="form-control form-control-lg"
              placeholder="Ex.: 45"
            />
          </div>
          <div class="col-6">
            <label for="servings" class="form-label fw-semibold">Porções</label>
            <input
              id="servings"
              v-model="form.servings"
              type="number"
              min="1"
              class="form-control form-control-lg"
              placeholder="Ex.: 8"
            />
          </div>
        </div>

        <!-- Barra de progresso -->
        <div v-if="isUploading" class="mb-3">
          <div class="d-flex justify-content-between mb-1">
            <small class="text-muted">Enviando receita...</small>
            <small class="fw-bold" style="color: var(--brand-color)">{{ uploadProgress }}%</small>
          </div>
          <div class="progress" style="height: 10px; border-radius: 8px;">
            <div
              class="progress-bar"
              role="progressbar"
              :style="{ width: uploadProgress + '%', backgroundColor: 'var(--brand-color)' }"
              :aria-valuenow="uploadProgress"
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>
        </div>

        <!-- Mensagens -->
        <div v-if="apiError" class="alert alert-danger py-2 mb-3" role="alert">
          <i class="bi bi-exclamation-circle me-2" />{{ apiError }}
        </div>
        <div v-if="successMsg" class="alert alert-success py-2 mb-3" role="alert">
          <i class="bi bi-check-circle me-2" />{{ successMsg }}
        </div>

        <BaseButton
          label="Publicar Receita"
          loading-label="Enviando..."
          :loading="isUploading"
        />
      </form>
    </FormCard>
  </div>
</template>

<style scoped>
.recipe-preview {
  width: 100%;
  max-height: 260px;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid #f0e0d8;
}

.recipe-preview-img {
  width: 100%;
  height: 260px;
  object-fit: cover;
  display: block;
}
</style>
