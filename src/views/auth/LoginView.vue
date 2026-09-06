<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errors = reactive({
  email: '',
  password: '',
})

const isSubmitting = ref(false)
const apiErrorMessage = ref('')

function validate() {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!form.password) {
    errors.password = 'A senha é obrigatória.'
  }

  return Object.values(errors).every((msg) => msg === '')
}

async function handleSubmit() {
  apiErrorMessage.value = ''

  if (!validate()) return

  isSubmitting.value = true

  try {
    await authStore.login(form.email, form.password)
    console.log('Perfil autenticado OK:', authStore.user)
    const redirect = route.query.redirect || '/feed'
    router.push(redirect)
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <h1>Entrar</h1>

    <form @submit.prevent="handleSubmit">
      <div class="field">
        <label for="email">E-mail</label>
        <input id="email" type="email" v-model="form.email" class="form-control" />
        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
      </div>

      <div class="field">
        <label for="password">Senha</label>
        <input id="password" type="password" v-model="form.password" class="form-control" />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>

      <p v-if="apiErrorMessage" class="api-error">{{ apiErrorMessage }}</p>

      <button type="submit" class="btn btn-brand w-100 mt-2" :disabled="isSubmitting">
        {{ isSubmitting ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="auth-link">
      Não tem conta? <router-link to="/register">Criar conta</router-link>
    </p>
  </div>
</template>
