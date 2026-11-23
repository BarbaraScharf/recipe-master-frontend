<script setup>
import { useAsyncData } from '../../composables/useAsyncData'
import { getAdminDashboard } from '../../services/adminService'

const { data: stats, isLoading, error, execute } = useAsyncData(() => getAdminDashboard())

// Cartões iguais; o das denúncias pendentes fica à parte, em destaque
const cards = [
  { key: 'users', label: 'Usuários', icon: 'bi-people' },
  { key: 'blockedUsers', label: 'Usuários bloqueados', icon: 'bi-person-slash' },
  { key: 'recipes', label: 'Receitas', icon: 'bi-journal-text' },
  { key: 'comments', label: 'Comentários', icon: 'bi-chat-dots' },
  { key: 'likes', label: 'Curtidas', icon: 'bi-heart' },
  { key: 'reviewedReports', label: 'Denúncias revisadas', icon: 'bi-check2-circle' },
]
</script>

<template>
  <div>
    <div class="d-flex justify-content-end mb-3">
      <button class="refresh-btn" :disabled="isLoading" @click="execute">
        <i class="bi bi-arrow-clockwise" :class="{ spinning: isLoading }" />Atualizar
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando números...
    </div>

    <!-- 403 (sem papel de administrador) aparece aqui, no lugar dos números -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <template v-else-if="stats">
      <router-link :to="{ name: 'admin-reports' }" class="pending-card mb-4">
        <div class="pending-icon"><i class="bi bi-flag-fill" /></div>
        <div>
          <div class="pending-number">{{ stats.pendingReports }}</div>
          <div class="pending-label">
            {{ stats.pendingReports === 1 ? 'denúncia pendente' : 'denúncias pendentes' }}
            <i class="bi bi-arrow-right ms-1" />
          </div>
        </div>
      </router-link>

      <div class="stats-grid">
        <div v-for="card in cards" :key="card.key" class="stat-card">
          <i class="bi stat-icon" :class="card.icon" />
          <div class="stat-number">{{ stats[card.key] }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pending-card {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #dc3545, #b02a37);
  /* !important: o style.css global tem a { color: inherit !important } */
  color: #fff !important;
  text-decoration: none;
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.25);
  transition: transform 0.15s;
}
.pending-card:hover {
  transform: translateY(-2px);
  color: #fff !important;
}
.pending-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
}
.pending-number {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1;
}
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
.pending-label {
  font-weight: 600;
  opacity: 0.95;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
.stat-card {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 1.1rem 1.2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}
.stat-icon {
  font-size: 1.3rem;
  color: var(--brand-color);
}
.stat-number {
  font-size: 1.7rem;
  font-weight: 800;
  color: #222;
  margin-top: 0.4rem;
}
.stat-label {
  color: #777;
  font-size: 0.9rem;
}
</style>


