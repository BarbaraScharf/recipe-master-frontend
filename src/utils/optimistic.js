/**
 * runOptimistic — o miolo da atualização otimista, extraído no terceiro caso
 * (curtir, seguir e marcar lista).
 *
 * apply():    muda a tela na hora e devolve a função que desfaz essa mudança
 * request():  chama a API e devolve a promessa
 * confirm(d): acerta a tela com o que a API respondeu
 *
 * Se a API falhar, desfaz. Não mostra toast: o interceptor do Axios já avisou.
 */
export async function runOptimistic({ apply, request, confirm }) {
  const undo = apply()
  try {
    const response = await request()
    confirm(response.data)
  } catch {
    undo()
  }
}
