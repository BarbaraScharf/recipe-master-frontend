/**
 * useAuth — composable centralizado de acesso ao estado de autenticação.
 *
 * Diferença entre componente e composable:
 *   - Componente (BaseInput, BaseButton, FormCard): encapsula template + lógica
 *     visual, produz elementos DOM, usado com <BaseInput />.
 *   - Composable (useAuth): encapsula APENAS lógica e estado reativo, não produz
 *     nenhum DOM, chamado dentro de <script setup> como uma função.
 *
 * Nota sobre useRouter():
 *   O composable NÃO chama useRouter() internamente. Isso evita dependência
 *   circular quando useAuth() é chamado fora de um componente (ex.: no router/index.js).
 *   O logout com redirecionamento fica na Navbar, que já tem acesso ao router.
 */
import { useAuthStore } from '../stores/auth'

export function useAuth() {
  const authStore = useAuthStore()

  return {
    // estado reativo via store
    authStore,
    // atalhos diretos
    user:            authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin:         authStore.isAdmin,
    // ações (sem router — o redirecionamento fica no componente)
    login:           authStore.login,
    logout:          authStore.logout,
    clearSession:    authStore.clearSession,
  }
}
