<script setup>
/**
 * FormCard — container visual para formulários de autenticação e edição.
 *
 * Props:
 *   title    — título exibido no topo do card
 *   icon     — classe Bootstrap Icons opcional (ex: 'bi-person-plus')
 */
defineOptions({ name: 'FormCard' })

const props = defineProps({
  title: { type: String, required: true },
  icon:  { type: String, default: '' },
})
</script>

<template>
  <div class="form-card-wrapper d-flex justify-content-center align-items-start py-5 px-3">
    <div class="card form-card">
      <div class="card-header form-card-header">
        <h4 class="mb-0 fw-bold d-flex align-items-center gap-2">
          <i v-if="icon" :class="`bi ${icon}`" />
          {{ title }}
        </h4>
      </div>
      <div class="card-body p-5">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-card {
  width: 100%;
  max-width: 580px;
  border-radius: 14px;
  border: none;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13), 0 2px 8px rgba(226, 88, 34, 0.08);
}

.form-card-header {
  background-color: var(--brand-color);
  color: #fff;
  border-radius: 14px 14px 0 0 !important;
  padding: 1.5rem 2rem;
  border-bottom: none;
}

.form-card-wrapper {
  min-height: calc(100vh - 120px);
}
</style>
