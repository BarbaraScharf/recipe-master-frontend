# Respostas — Atividade 09

## 1. Diferença entre 401, 403 e 404

- **401 Unauthorized**: a requisição chegou sem autenticação válida (sem token ou token inválido).
  O servidor não sabe *quem* está pedindo.
- **403 Forbidden**: o servidor sabe *quem* está pedindo (token válido), mas essa pessoa não tem
  permissão para acessar o recurso. No projeto, acontece quando um usuário tenta editar ou excluir
  uma receita de outro usuário.
- **404 Not Found**: o recurso pedido simplesmente não existe.

A verificação 404 vem antes da 403 por uma questão de segurança: se verificássemos o dono antes de
confirmar que o item existe, um atacante poderia deduzir, a partir da resposta 403, que o item existe
mas pertence a outra pessoa — informação que não deve ser revelada. Verificando 404 primeiro, um item
inexistente sempre retorna 404, seja qual for o usuário.

## 2. Banco antes do disco

Ao excluir ou trocar um arquivo, o banco de dados é atualizado primeiro, e só depois o arquivo é
removido do disco. O motivo: se o disco falhar após o banco já ter sido atualizado, a situação é
recuperável (o arquivo sumiu mas o banco está correto; na próxima tentativa o arquivo já não estava
mais referenciado). Na ordem inversa — disco primeiro — o arquivo seria apagado e o banco ainda
apontaria para ele, deixando referências quebradas e sem como recuperar o dado.

## 3. Arquivo órfão — dois exemplos no projeto

Um arquivo órfão é um arquivo salvo em disco sem nenhum registro no banco que o referencie.

**Exemplo 1 — Validação falha após upload:** O Multer salva a imagem da receita em
`public/uploads/recipes/` antes de o validador checar os campos de texto. Se o título estiver vazio,
o validator lança um erro 400 e o controller nem é chamado — o arquivo ficou no disco sem ter sido
registrado no banco.

**Exemplo 2 — Autorização falha após upload:** Um usuário malicioso manda um PUT com uma imagem
nova para uma receita que não é dele. O Multer salva a imagem, depois o service verifica o dono e
lança 403 — a nova imagem ficaria no disco sem nunca ter sido associada a nenhuma receita.

A limpeza ocorre no `errorHandler.js`: antes de responder o erro, o middleware verifica se `req.file`
ou `req.files` existem e apaga os arquivos que o Multer salvou antes do erro ser lançado.

## 4. Botão excluir fora do `<a>`, modal fora do card

Um botão de ação (Editar/Excluir) não pode ficar dentro de um `<a>` porque elementos interativos
não podem ser aninhados em HTML — um `<button>` dentro de um `<a>` viola o padrão e gera
comportamento imprevisível entre navegadores. No projeto o card inteiro era clicável: envolver tudo em
`<a>` colocaria os botões dentro dele.

O modal não pode ficar dentro do card por outro motivo: o card tem `overflow: hidden` e
`position: relative` para seus estilos visuais. Um modal dentro dele ficaria recortado pela caixa do
card e não conseguiria se centralizar na viewport. A solução é usar `<Teleport to="body">`, que move
o modal para o topo da árvore DOM, fora de qualquer container que possa limitá-lo.

## 5. Esconder o botão Editar não é segurança

Esconder o botão "Editar" de quem não é dono é uma melhoria de UX, não uma medida de segurança.
Qualquer pessoa pode inspecionar o DOM, descobrir o ID da receita e fazer diretamente uma requisição
PUT para a API — sem passar pela interface. A proteção real está no backend: o service verifica se
`recipe.userId === requestingUserId` antes de permitir qualquer alteração, retornando 403 caso não seja
o dono. A interface apenas evita que usuários comuns vejam um botão que não funcionaria para eles.
