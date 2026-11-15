import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { STORAGE_KEYS } from '../config/constants'

/**
 * useAuthenticatedAction — ação que exige login (curtir, seguir).
 *
 * - Visitante: vai para /login?redirect=<página atual> e a ação não roda.
 * - Logado: roda a ação. Enquanto ela não termina (isBusy), novos cliques são ignorados,
 *   então vários cliques rápidos geram uma única requisição.
 *
 * O erro da ação já aparece como toast (interceptor do axios). Quem usa este composable
 * só precisa desfazer a mudança visual no catch.
 * Se a ação falhar, a função lança o erro de novo para o catch de quem chamou.
 */
export function useAuthenticatedAction(action) {
  const route = useRoute()
  const router = useRouter()
  const isBusy = ref(false)

  async function run(...args) {
    if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
      return
    }
    if (isBusy.value) return
    isBusy.value = true
    try {
      return await action(...args)
    } finally {
      isBusy.value = false
    }
  }

  return { run, isBusy }
}
