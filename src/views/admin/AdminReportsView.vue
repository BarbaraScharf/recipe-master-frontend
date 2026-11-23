<script setup>
/**
 * Denúncias do painel. "Marcar como revisada" espera a API (pessimista):
 * a linha só muda com o que o servidor devolveu. Nada de runOptimistic aqui.
 *
 * Limitação conhecida: a paginação por offset pode pular itens se a lista mudar
 * entre uma página e a próxima (cursor fica para a Aula 18).
 */
import { ref, reactive } from 'vue'
import { usePaginatedList } from '../../composables/usePaginatedList'
import { useToast } from '../../composables/useToast'
import { getAdminReports, reviewAdminReport } from '../../services/adminService'
import { REPORT_FILTERS, REPORT_REASONS } from '../../config/constants'
import { getRecipeImageUrl } from '../../utils/media'
import { timeAgo, formatDate } from '../../utils/format'

const toast = useToast()

const statusFilter = ref('pending')

const {
  items: reports, isLoading, isLoadingMore, error, loadMoreError, hasMore, loadMore, reload,
} = usePaginatedList(
  (page) => getAdminReports(statusFilter.value, page, undefined),
  { itemsKey: 'reports', watch: statusFilter }
)

// A API guarda a chave (spam); a tela mostra o rótulo (Spam ou golpes)
const reasonLabels = Object.fromEntries(REPORT_REASONS.map((reason) => [reason.value, reason.label]))

const busyIds = reactive(new Set())

async function markAsReviewed(report) {
  if (busyIds.has(report.id)) return
  busyIds.add(report.id)
  try {
    const response = await reviewAdminReport(report.id)
    report.status = response.data.status
    report.reviewedAt = response.data.reviewedAt
    toast.success(response.message)
  } catch {
    // o toast de erro já veio do interceptor; a linha continua como estava
  } finally {
    busyIds.delete(report.id)
  }
}
</script>

<template>
  <div>
    <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mb-3">
      <div class="filter-pills" role="group" aria-label="Filtrar denúncias por situação">
        <button
          v-for="filter in REPORT_FILTERS"
          :key="filter.value"
          type="button"
          class="filter-pill"
          :class="{ active: statusFilter === filter.value }"
          :aria-pressed="statusFilter === filter.value"
          @click="statusFilter = filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
      <button class="refresh-btn" :disabled="isLoading" @click="reload">
        <i class="bi bi-arrow-clockwise" :class="{ spinning: isLoading }" />Atualizar
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5 text-muted">
      <span class="spinner-border spinner-border-sm me-2" />Carregando denúncias...
    </div>

    <div v-else-if="error" class="alert alert-danger">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <div v-else-if="reports.length === 0" class="empty-box">
      <i class="bi bi-check2-all" />
      <p class="mb-0">Nenhuma denúncia {{ statusFilter === 'pending' ? 'pendente' : statusFilter === 'reviewed' ? 'revisada' : '' }} por aqui.</p>
    </div>

    <template v-else>
      <ul class="list-unstyled admin-list">
        <li v-for="report in reports" :key="report.id" class="admin-row">
          <router-link v-if="report.recipe" :to="{ name: 'recipe-detail', params: { id: report.recipe.id } }" class="thumb">
            <img v-if="getRecipeImageUrl(report.recipe.image)" :src="getRecipeImageUrl(report.recipe.image)" :alt="report.recipe.title" />
            <i v-else class="bi bi-egg-fried" />
          </router-link>

          <div class="row-body">
            <router-link v-if="report.recipe" :to="{ name: 'recipe-detail', params: { id: report.recipe.id } }" class="row-title">
              {{ report.recipe.title }}
            </router-link>
            <div class="row-meta">
              de @{{ report.recipe?.author?.username }} ·
              <span class="reason">{{ reasonLabels[report.reason] || report.reason }}</span>
            </div>
            <div class="row-meta">
              Denunciado por @{{ report.Reporter?.username }} · {{ timeAgo(report.createdAt) }}
              <template v-if="report.reviewedAt"> · revisada em {{ formatDate(report.reviewedAt) }}</template>
            </div>
          </div>

          <span class="badge status-badge" :class="report.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'">
            {{ report.status === 'pending' ? 'Pendente' : 'Revisada' }}
          </span>

          <button
            v-if="report.status === 'pending'"
            class="btn btn-sm btn-outline-success row-action"
            :disabled="busyIds.has(report.id)"
            @click="markAsReviewed(report)"
          >
            <span v-if="busyIds.has(report.id)" class="spinner-border spinner-border-sm me-1" />
            {{ busyIds.has(report.id) ? 'Salvando...' : 'Marcar como revisada' }}
          </button>
        </li>
      </ul>

      <div v-if="hasMore" class="text-center mt-3">
        <button class="btn btn-brand px-4" :disabled="isLoadingMore" @click="loadMore">
          <span v-if="isLoadingMore" class="spinner-border spinner-border-sm me-2" />
          {{ isLoadingMore ? 'Carregando...' : 'Carregar mais' }}
        </button>
      </div>
      <p v-if="loadMoreError" class="text-center text-danger mt-3 small">{{ loadMoreError }}</p>
    </template>
  </div>
</template>

<style scoped>
/* Seletor de situação: mesmo estilo das abas do painel */
.filter-pills {
  display: inline-flex;
  gap: 0.25rem;
  padding: 0.25rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50px;
}
.filter-pill {
  border: none;
  background: transparent;
  color: #666;
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.4rem 1.1rem;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.filter-pill:hover:not(.active) {
  background: #fff0eb;
  color: var(--brand-color);
}
.filter-pill.active {
  background: var(--brand-color);
  color: #fff;
}
.admin-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.admin-row {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.8rem 1rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 14px;
}
.thumb {
  width: 56px;
  height: 56px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #fff3ec, #ffd9c6);
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}
.thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.row-body {
  flex: 1;
  min-width: 0;
}
.row-title {
  font-weight: 700;
  color: #222;
  text-decoration: none;
}
.row-title:hover {
  color: var(--brand-color);
}
.row-meta {
  font-size: 0.85rem;
  color: #888;
}
.reason {
  color: #dc3545;
  font-weight: 600;
}
.status-badge {
  flex-shrink: 0;
}
.row-action {
  flex-shrink: 0;
  border-radius: 50px;
  font-weight: 600;
}
.empty-box {
  text-align: center;
  padding: 2.5rem 1rem;
  color: #888;
  background: #fff;
  border: 2px dashed #eee;
  border-radius: 16px;
}
.empty-box i {
  font-size: 2.2rem;
  color: #2a9d5c;
}
</style>


