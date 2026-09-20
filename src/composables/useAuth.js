/**
 * useAuth — composable centralizado de acesso ao estado de autenticação.
 *
 * Diferença entre componente e composable:
 *   - Componente (BaseInput, BaseButton, FormCard): encapsula template + lógica
 *     visual, produz elementos DOM, usado com <BaseInput />.
 *   - Composable (useAuth): encapsula APENAS lógica e estado reativo, não produz
 *     nenhum DOM, chamado dentro de <script setup> como uma função.
 *
 * Ao centralizar aqui, qualquer arquivo que precise saber "está logado?" ou
 * "é admin?" importa useAuth() em vez de importar useAuthStore() diretamente,
 * mantendo o restante do app desacoplado da implementação da store.
 */
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  async function logout() {
    await authStore.logout()
    router.push({ name: 'login' })
  }

  return {
    // estado
    user:            authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin:         authStore.isAdmin,
    // ações
    login:           authStore.login,
    logout,
    clearSession:    authStore.clearSession,
    // store completa (para casos que precisem de reatividade via computed)
    authStore,
  }
}
