<script setup>
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import FormCard from '../../components/base/FormCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

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
  <FormCard title="Entrar" icon="bi-box-arrow-in-right">
    <form @submit.prevent="handleSubmit" novalidate>
      <BaseInput
        id="email"
        v-model="form.email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        :error="errors.email"
      />

      <BaseInput
        id="password"
        v-model="form.password"
        label="Senha"
        type="password"
        placeholder="sua senha"
        :error="errors.password"
      />

      <div v-if="apiErrorMessage" class="alert alert-danger py-2 mt-1 mb-2" role="alert">
        <i class="bi bi-exclamation-circle me-2" />{{ apiErrorMessage }}
      </div>

      <BaseButton
        label="Entrar"
        loading-label="Entrando..."
        :loading="isSubmitting"
      />
    </form>

    <p class="text-center mt-3 mb-0 small">
      Não tem conta?
      <router-link to="/register" class="fw-semibold text-decoration-none" style="color: var(--brand-color)">
        Criar conta
      </router-link>
    </p>
  </FormCard>
</template>
