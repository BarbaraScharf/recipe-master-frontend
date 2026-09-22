# Checklist de Alcançabilidade — Aula 07

## Como a tela de Nova Receita é alcançada

A tela `/recipes/upload` é acessada pelo link **"Nova Receita"** na Sidebar lateral,
visível apenas para usuários autenticados (`v-if="authStore.isAuthenticated"`).

---

## Respostas ao checklist

**Login → clique em Nova Receita → URL muda sem recarregar?**
Sim. O Vue Router troca o componente sem recarregar a página (SPA).
A URL passa de `/feed` para `/recipes/upload` instantaneamente.

**Envio vazio → erros de campo obrigatório?**
Sim. A função `validate()` no componente verifica title, ingredients,
instructions e category antes de qualquer chamada de rede.
Os erros aparecem abaixo de cada campo sem nenhum POST sendo disparado.

**Grupo A — escolha só um arquivo → erro pedindo o outro?**
Não se aplica. O projeto é Grupo B (um arquivo só — imagem opcional).

**Escolha a imagem → prévia aparece sem chamada de rede?**
Sim. O handler `handleImageChange` usa `URL.createObjectURL(file)` para
gerar uma URL local temporária, sem nenhuma requisição HTTP.

**Envio → barra de progresso avança → mensagem de sucesso?**
Sim. O callback `onUploadProgress` atualiza `uploadProgress.value` em tempo real.
Após sucesso, a mensagem "Receita publicada com sucesso!" aparece e o usuário
é redirecionado para `/feed` após 1,5 segundos.

**Network mostra Content-Type: multipart/form-data?**
Sim. O recipeService.js define explicitamente
`headers: { 'Content-Type': 'multipart/form-data' }` na chamada Axios.

**Banco confirma registro criado e recipesCount subiu?**
Sim. Confirmado via GET /api/profile/teste123 — campo recipesCount subiu
de 0 para o número correto após cada receita publicada.
