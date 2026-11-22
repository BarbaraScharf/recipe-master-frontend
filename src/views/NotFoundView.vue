<template>
  <div class="container py-5">
    <div class="not-found-card">
      <div class="not-found-icon"><i class="bi bi-signpost-split" /></div>
      <p class="not-found-code">404</p>
      <h4 class="fw-bold mb-2">Página não encontrada</h4>
      <p class="text-muted mb-4">O endereço que você tentou abrir não existe ou mudou de lugar.</p>
      <div class="d-flex justify-content-center gap-2 flex-wrap">
        <router-link to="/" class="btn btn-brand">
          <i class="bi bi-house me-2" />Ir para o início
        </router-link>
        <router-link :to="{ name: 'search' }" class="btn btn-outline-secondary">
          <i class="bi bi-search me-2" />Explorar receitas
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-card {
  max-width: 460px;
  margin: 2rem auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  text-align: center;
}
.not-found-icon {
  width: 84px;
  height: 84px;
  margin: 0 auto 0.75rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.4rem;
}
.not-found-code {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--brand-color);
  margin-bottom: 0;
}
</style>
