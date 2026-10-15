<script setup>
/**
 * EditRecipeView — formulário de edição de uma receita.
 *
 * Carrega os dados da receita via GET /recipes/:id/edit (só o dono consegue).
 * Permite editar todos os campos de texto e trocar a imagem opcionalmente.
 * Preview local da nova imagem sem chamada de rede (igual ao Upload).
 * Envia como multipart/form-data para suportar o arquivo opcional.
 */
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter }       from 'vue-router'
import { getRecipeForEdit, updateRecipe } from '../services/recipeService'
import { getRecipeImageUrl }             from '../utils/media'
import BaseInput  from '../components/base/BaseInput.vue'
import BaseButton from '../components/base/BaseButton.vue'

const route  = useRoute()
const router = useRouter()

const isLoading    = ref(true)
const isSubmitting = ref(false)
const loadError    = ref('')
const apiError     = ref('')
const imagePreview = ref(null)  // URL.createObjectURL para preview local
const currentImage = ref(null)  // filename já salvo no banco

const form = reactive({
  title:        '',
  description:  '',
  ingredients:  '',
  instructions: '',
  category:     '',
  prepTime:     '',
  servings:     '',
  image:        null   // File object novo, ou null
})

const errors = reactive({
  title:        '',
  ingredients:  '',
  instructions: '',
  category:     ''
})

const CATEGORIES = [
  'Café da manhã', 'Almoço', 'Jantar', 'Sobremesa',
  'Lanche', 'Bebidas', 'Vegetariano', 'Vegano', 'Fitness', 'Outros'
]

onMounted(async () => {
  try {
    const response    = await getRecipeForEdit(route.params.id)
    const recipe      = response.data
    form.title        = recipe.title        || ''
    form.description  = recipe.description  || ''
    form.ingredients  = recipe.ingredients  || ''
    form.instructions = recipe.instructions || ''
    form.category     = recipe.category     || ''
    form.prepTime     = recipe.prepTime     != null ? String(recipe.prepTime) : ''
    form.servings     = recipe.servings     != null ? String(recipe.servings) : ''
    currentImage.value = recipe.image
  } catch (err) {
    loadError.value = err.message
  } finally {
    isLoading.value = false
  }
})

function handleImageChange(event) {
  const file = event.target.files[0]
  if (!file) return
  form.image = file
  imagePreview.value = URL.createObjectURL(file)
}

function validate() {
  Object.keys(errors).forEach(k => (errors[k] = ''))
  if (!form.title.trim())        errors.title        = 'O título é obrigatório.'
  if (!form.ingredients.trim())  errors.ingredients  = 'Os ingredientes são obrigatórios.'
  if (!form.instructions.trim()) errors.instructions = 'O modo de preparo é obrigatório.'
  if (!form.category)            errors.category     = 'Selecione uma categoria.'
  return Object.values(errors).every(e => e === '')
}

async function handleSubmit() {
  apiError.value = ''
  if (!validate()) return

  isSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('title',        form.title.trim())
    fd.append('description',  form.description.trim())
    fd.append('ingredients',  form.ingredients.trim())
    fd.append('instructions', form.instructions.trim())
    fd.append('category',     form.category)
    if (form.prepTime) fd.append('prepTime', form.prepTime)
    if (form.servings) fd.append('servings', form.servings)
    if (form.image)    fd.append('image', form.image)

    await updateRecipe(route.params.id, fd)
    router.push({ name: 'recipe-detail', params: { id: route.params.id } })
  } catch (err) {
    apiError.value = err.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="container py-4" style="max-width: 700px;">
    <h2 class="fw-bold mb-4" style="color: var(--brand-color)">
      <i class="bi bi-pencil-square me-2" />Editar Receita
    </h2>

    <!-- Carregando -->
    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando receita...
    </div>

    <!-- Erro de carregamento (404 ou 403) -->
    <div v-else-if="loadError" class="text-center py-5">
      <i class="bi bi-exclamation-circle text-danger" style="font-size:3rem;" />
      <p class="mt-3 text-danger fw-semibold">{{ loadError }}</p>
      <button class="btn btn-brand mt-2" @click="router.back()">
        <i class="bi bi-arrow-left me-2" />Voltar
      </button>
    </div>

    <!-- Formulário -->
    <form v-else @submit.prevent="handleSubmit">

      <!-- Preview da imagem atual ou nova -->
      <div class="mb-3 text-center">
        <img
          v-if="imagePreview || getRecipeImageUrl(currentImage)"
          :src="imagePreview || getRecipeImageUrl(currentImage)"
          alt="Preview"
          class="img-preview"
        />
      </div>

      <!-- Imagem (opcional na edição) -->
      <div class="mb-3">
        <label class="form-label fw-semibold">
          Trocar imagem <span class="text-muted fw-normal">(opcional)</span>
        </label>
        <input
          type="file"
          class="form-control"
          accept="image/jpeg,image/png,image/webp"
          @change="handleImageChange"
        />
      </div>

      <BaseInput
        v-model="form.title"
        id="title"
        label="Título"
        placeholder="Nome da receita"
        :error="errors.title"
      />

      <div class="mb-3">
        <label for="category" class="form-label fw-semibold">Categoria</label>
        <select
          id="category"
          v-model="form.category"
          class="form-select"
          :class="{ 'is-invalid': errors.category }"
        >
          <option value="" disabled>Selecione uma categoria</option>
          <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <div v-if="errors.category" class="invalid-feedback">{{ errors.category }}</div>
      </div>

      <div class="mb-3">
        <label for="description" class="form-label fw-semibold">
          Descrição <span class="text-muted fw-normal">(opcional)</span>
        </label>
        <textarea
          id="description"
          v-model="form.description"
          class="form-control"
          rows="2"
          placeholder="Breve descrição da receita"
        />
      </div>

      <div class="row g-3 mb-3">
        <div class="col-6">
          <label for="prepTime" class="form-label fw-semibold">Tempo de preparo (min)</label>
          <input
            id="prepTime"
            type="number"
            min="1"
            v-model="form.prepTime"
            class="form-control"
            placeholder="ex: 30"
          />
        </div>
        <div class="col-6">
          <label for="servings" class="form-label fw-semibold">Porções</label>
          <input
            id="servings"
            type="number"
            min="1"
            v-model="form.servings"
            class="form-control"
            placeholder="ex: 4"
          />
        </div>
      </div>

      <div class="mb-3">
        <label for="ingredients" class="form-label fw-semibold">Ingredientes</label>
        <textarea
          id="ingredients"
          v-model="form.ingredients"
          class="form-control"
          :class="{ 'is-invalid': errors.ingredients }"
          rows="5"
          placeholder="Liste os ingredientes, um por linha"
        />
        <div v-if="errors.ingredients" class="invalid-feedback">{{ errors.ingredients }}</div>
      </div>

      <div class="mb-3">
        <label for="instructions" class="form-label fw-semibold">Modo de Preparo</label>
        <textarea
          id="instructions"
          v-model="form.instructions"
          class="form-control"
          :class="{ 'is-invalid': errors.instructions }"
          rows="7"
          placeholder="Descreva o passo a passo"
        />
        <div v-if="errors.instructions" class="invalid-feedback">{{ errors.instructions }}</div>
      </div>

      <p v-if="apiError" class="text-danger small">
        <i class="bi bi-exclamation-circle me-1" />{{ apiError }}
      </p>

      <div class="d-flex gap-2">
        <BaseButton
          type="submit"
          label="Salvar Alterações"
          loading-label="Salvando..."
          :loading="isSubmitting"
        />
        <button type="button" class="btn btn-outline-secondary mt-2" @click="router.back()">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.img-preview {
  max-height: 260px;
  max-width: 100%;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid var(--brand-color);
}
</style>
