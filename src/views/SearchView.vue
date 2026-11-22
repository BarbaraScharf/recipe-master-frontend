<script setup>
/**
 * SearchView — busca de receitas e pessoas.
 *
 * Duas defesas:
 *   - debounce (useDebouncedValue): só busca quando a pessoa para de digitar por 400 ms
 *   - lastCallId (dentro do useAsyncData): se uma resposta antiga chegar depois da nova, é ignorada
 * O termo fica na URL (?q=), então F5 e links compartilhados funcionam.
 */
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { search } from '../services/searchService'
import { useAsyncData } from '../composables/useAsyncData'
import { useDebouncedValue } from '../composables/useDebouncedValue'
import { SEARCH } from '../config/constants'
import { getProfilePictureUrl } from '../utils/media'
import RecipeCard from '../components/recipe/RecipeCard.vue'

const route = useRoute()
const router = useRouter()

function queryFromUrl() {
  return typeof route.query.q === 'string' ? route.query.q : ''
}

const typedText = ref(queryFromUrl())
const term = useDebouncedValue(typedText, SEARCH.DEBOUNCE_MS)
const normalizedTerm = computed(() => term.value.trim())

const EMPTY_RESULTS = { query: '', recipes: [], users: [] }

const { data: results, isLoading, error } = useAsyncData(
  () => normalizedTerm.value.length >= SEARCH.MIN_LENGTH
    ? search(normalizedTerm.value)
    // termo curto: nem chama a API
    : Promise.resolve({ data: { ...EMPTY_RESULTS, query: normalizedTerm.value } }),
  { watch: normalizedTerm, initialData: EMPTY_RESULTS }
)

// URL → campo (ex.: a busca da Navbar com outro termo enquanto já estou aqui)
watch(() => route.query.q, () => {
  const fromUrl = queryFromUrl()
  if (fromUrl.trim() !== normalizedTerm.value) typedText.value = fromUrl
})

// Campo → URL. replace (e não push): o Voltar não passa por cada pausa da digitação
watch(normalizedTerm, (value) => {
  if (value === queryFromUrl()) return
  router.replace({ name: 'search', query: value ? { q: value } : {} })
})

const typedLength = computed(() => typedText.value.trim().length)
const showHint = computed(() => typedLength.value > 0 && typedLength.value < SEARCH.MIN_LENGTH)
const hasSearched = computed(() => (results.value?.query || '').length >= SEARCH.MIN_LENGTH)
const recipes = computed(() => results.value?.recipes ?? [])
const users = computed(() => results.value?.users ?? [])

// Sugestões para quem ainda não digitou nada (só preenchem o campo; a busca segue a regra do debounce)
const SUGGESTIONS = ['Bolo', 'Frango', 'Salada', 'Torta', 'Massa']

function useSuggestion(text) {
  typedText.value = text
  inputRef.value?.focus()
}

const totalFound = computed(() => recipes.value.length + users.value.length)

const inputRef = ref(null)
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <div class="container py-4">
    <div class="search-header">
      <h2 class="fw-bold mb-1" style="color: var(--brand-color)">
        <i class="bi bi-search me-2" />Explorar
      </h2>
      <p class="text-muted mb-4">Encontre receitas pelo nome e pessoas pelo nome ou usuário.</p>

      <div class="search-box">
        <i class="bi bi-search search-icon" />
        <input
          ref="inputRef"
          v-model="typedText"
          type="search"
          class="form-control form-control-lg search-input"
          placeholder="Ex.: bolo de cenoura, frango, @usuario..."
          aria-label="Buscar receitas e pessoas"
        />
      </div>
      <p v-if="showHint" class="text-muted small mt-2 mb-0">
        <i class="bi bi-info-circle me-1" />Digite pelo menos {{ SEARCH.MIN_LENGTH }} letras para buscar.
      </p>
    </div>

    <div v-if="isLoading" class="text-center text-muted py-5">
      <span class="spinner-border spinner-border-sm me-2" />Buscando...
    </div>

    <div v-else-if="error" class="alert alert-danger mt-4">
      <i class="bi bi-exclamation-circle me-2" />{{ error }}
    </div>

    <!-- Ainda não buscou nada -->
    <div v-else-if="!hasSearched" class="state-card">
      <div class="state-icon"><i class="bi bi-egg-fried" /></div>
      <h5 class="fw-bold mb-2">O que você quer cozinhar hoje?</h5>
      <p class="text-muted mb-3">Experimente uma destas buscas:</p>
      <div class="d-flex justify-content-center flex-wrap gap-2">
        <button
          v-for="suggestion in SUGGESTIONS"
          :key="suggestion"
          type="button"
          class="suggestion-chip"
          @click="useSuggestion(suggestion)"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <template v-else>
      <!-- Buscou e não achou -->
      <div v-if="totalFound === 0" class="state-card">
        <div class="state-icon"><i class="bi bi-emoji-frown" /></div>
        <h5 class="fw-bold mb-2">Nada encontrado para "{{ results.query }}".</h5>
        <p class="text-muted mb-0">Confira se escreveu certo ou tente uma palavra mais curta.</p>
      </div>

      <template v-else>
        <p class="results-summary">
          Resultados para <strong>"{{ results.query }}"</strong>
          <span class="text-muted">· {{ totalFound === 1 ? '1 resultado' : `${totalFound} resultados` }}</span>
        </p>

        <section v-if="users.length > 0" class="mb-5">
          <h5 class="section-title"><i class="bi bi-people me-2" />Pessoas</h5>
          <div class="user-grid">
            <router-link
              v-for="user in users"
              :key="user.id"
              :to="{ name: 'public-profile', params: { username: user.username } }"
              class="user-chip"
            >
              <img :src="getProfilePictureUrl(user.profilePicture, user.fullName || user.username)" :alt="user.username" class="user-avatar" />
              <div class="text-truncate">
                <div class="fw-semibold text-dark text-truncate">{{ user.fullName || user.username }}</div>
                <div class="text-muted small">@{{ user.username }}</div>
              </div>
            </router-link>
          </div>
        </section>

        <section v-if="recipes.length > 0">
          <h5 class="section-title"><i class="bi bi-journal-text me-2" />Receitas</h5>
          <div class="recipe-grid">
            <RecipeCard v-for="recipe in recipes" :key="recipe.id" :recipe="recipe" />
          </div>
        </section>
      </template>
    </template>
  </div>
</template>

<style scoped>
.search-header {
  max-width: 720px;
  margin: 1rem auto 2.5rem;
  text-align: center;
}
.search-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 1.1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--brand-color);
  font-size: 1.1rem;
}
.search-input {
  padding: 0.9rem 1rem 0.9rem 2.9rem;
  border-radius: 14px;
  border: 2px solid #eee;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
}
.search-input:focus {
  border-color: var(--brand-color);
  box-shadow: 0 0 0 4px rgba(226, 88, 34, 0.12);
}
.state-card {
  max-width: 520px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  text-align: center;
}
.state-icon {
  width: 76px;
  height: 76px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: #fff0eb;
  color: var(--brand-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.1rem;
}
.suggestion-chip {
  border: 1.5px solid #f3c9b8;
  background: #fff;
  color: var(--brand-color);
  border-radius: 50px;
  padding: 0.35rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.15s;
}
.suggestion-chip:hover {
  background: #fff0eb;
}
.results-summary {
  font-size: 1.05rem;
  margin-bottom: 1.5rem;
}
.section-title {
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
}
.user-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 0.75rem;
}
.user-chip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid #eee;
  border-radius: 12px;
  text-decoration: none;
  background: #fff;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.user-chip:hover {
  border-color: var(--brand-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}
.user-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
