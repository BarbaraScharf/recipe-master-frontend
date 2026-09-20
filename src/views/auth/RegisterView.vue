<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../../services/authService'
import FormCard from '../../components/base/FormCard.vue'
import BaseInput from '../../components/base/BaseInput.vue'
import BaseButton from '../../components/base/BaseButton.vue'

const router = useRouter()

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  fullName: '',
})

const isSubmitting = ref(false)
const apiErrorMessage = ref('')

function validate() {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  if (!form.fullName.trim()) {
    errors.fullName = 'O nome completo é obrigatório.'
  }

  if (form.username.trim().length < 3 || form.username.trim().length > 20) {
    errors.username = 'O nome de usuário deve ter entre 3 e 20 caracteres.'
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(form.email)) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (form.password.length < 6) {
    errors.password = 'A senha deve ter pelo menos 6 caracteres.'
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = 'As senhas não coincidem.'
  }

  return Object.values(errors).every((message) => message === '')
}

async function handleSubmit() {
  apiErrorMessage.value = ''

  if (!validate()) return

  isSubmitting.value = true

  try {
    const response = await register({
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
      confirmPassword: form.confirmPassword,
      fullName: form.fullName.trim(),
    })

    console.log('Conta criada:', response.data)
    router.push({ name: 'login' })
  } catch (error) {
    apiErrorMessage.value = error.message
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <FormCard title="Criar Conta" icon="bi-person-plus">
    <form @submit.prevent="handleSubmit" novalidate>
      <BaseInput
        id="fullName"
        v-model="form.fullName"
        label="Nome completo"
        placeholder="Seu nome completo"
        :error="errors.fullName"
      />

      <BaseInput
        id="username"
        v-model="form.username"
        label="Usuário"
        placeholder="nome de usuário (3–20 caracteres)"
        :error="errors.username"
      />

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
        placeholder="mínimo 6 caracteres"
        :error="errors.password"
      />

      <BaseInput
        id="confirmPassword"
        v-model="form.confirmPassword"
        label="Confirmar senha"
        type="password"
        placeholder="repita a senha"
        :error="errors.confirmPassword"
      />

      <div v-if="apiErrorMessage" class="alert alert-danger py-2 mt-1 mb-2" role="alert">
        <i class="bi bi-exclamation-circle me-2" />{{ apiErrorMessage }}
      </div>

      <BaseButton
        label="Criar Minha Conta"
        loading-label="Criando conta..."
        :loading="isSubmitting"
      />
    </form>

    <p class="text-center mt-3 mb-0 small">
      Já tem conta?
      <router-link to="/login" class="fw-semibold text-decoration-none" style="color: var(--brand-color)">
        Entrar
      </router-link>
    </p>
  </FormCard>
</template>
