<script setup>
/**
 * AdminLayout — moldura do painel: título, abas e a tela da aba atual (router-view).
 * As abas são rotas filhas de /admin; a guarda por papel fica no router.
 */
const tabs = [
  { name: 'admin-dashboard', label: 'Dashboard', icon: 'bi-speedometer2' },
  { name: 'admin-reports', label: 'Denúncias', icon: 'bi-flag' },
  { name: 'admin-users', label: 'Usuários', icon: 'bi-people' },
  { name: 'admin-recipes', label: 'Receitas', icon: 'bi-journal-text' },
]
</script>

<template>
  <div class="container py-4 admin-page">
    <h2 class="fw-bold mb-3" style="color: var(--brand-color)">
      <i class="bi bi-shield-lock me-2" />Administração
    </h2>

    <nav aria-label="Seções da administração" class="mb-4">
      <ul class="nav nav-pills admin-tabs">
        <li v-for="tab in tabs" :key="tab.name" class="nav-item">
          <router-link :to="{ name: tab.name }" class="nav-link" active-class="active">
            <i class="bi me-2" :class="tab.icon" />{{ tab.label }}
          </router-link>
        </li>
      </ul>
    </nav>

    <router-view />
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 1000px;
}
.admin-tabs {
  gap: 0.4rem;
  flex-wrap: wrap;
}
.admin-tabs .nav-link {
  color: #555;
  border-radius: 50px;
  font-weight: 600;
  padding: 0.45rem 1rem;
}
.admin-tabs .nav-link:hover {
  background: #fff0eb;
  color: var(--brand-color);
}
.admin-tabs .nav-link.active {
  background: var(--brand-color);
  color: #fff;
}
</style>
