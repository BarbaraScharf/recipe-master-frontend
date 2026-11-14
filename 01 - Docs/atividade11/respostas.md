# Respostas — Aula 11

## 1. Por que a tabela follows precisa de apelidos (as)?

A tabela `follows` liga a tabela `users` com ela mesma duas vezes: uma coluna é quem segue (`followerId`) e a outra é quem é seguido (`followingId`). Sem apelido o Sequelize não sabe de qual das duas eu estou falando, então dei os nomes `Follower` e `Following`.

Para não trocar as funções eu leio em voz alta: `getFollowers` é "quem segue ele", então o `where` é `followingId = id dele`. `getFollowing` é "quem ele segue", então o `where` é `followerId = id dele`.

## 2. Por que a ordem das colunas no índice composto importa e por que tem um segundo índice?

O índice composto `(follower_id, following_id)` serve para duas coisas: impede seguir a mesma pessoa duas vezes (é único) e deixa rápida a busca "fulano segue sicrano?". O banco lê o índice da esquerda para a direita, então ele ajuda quando busco por `follower_id` (ou pelos dois), mas não ajuda quando busco só por `following_id`. Como eu também preciso listar os seguidores de alguém, criei um segundo índice só em `following_id`.

## 3. Por que followerId === followingId nunca dava true com o id vindo de req.params?

O id que vem de `req.params` é sempre texto (`"1"`), e o id da pessoa logada vem do token como número (`1`). Em JavaScript `"1" === 1` dá `false`, então eu conseguiria seguir a mim mesma sem erro. A conversão tem que ser feita logo na entrada, no controller (`parseUserId`, com `Number()`), antes de comparar qualquer coisa.

## 4. Quando usar v-model / defineModel em vez do "valor inicial, estado próprio"?

Quando o pai e o filho precisam mostrar o mesmo valor ao mesmo tempo. No `FollowButton` o número de seguidores aparece no cartão do perfil (o pai), e ele tem que mudar junto com o botão. Por isso usei `defineModel`. No `LikeButton` da Aula 10 era diferente: o botão guardava o próprio estado a partir de um valor inicial, porque o pai não precisava acompanhar.

## 5. Por que ler o valor do defineModel logo depois de atribuir devolve o antigo?

Quando atribuo ao `defineModel`, eu só aviso o pai da mudança. O valor só muda de verdade depois que o pai atualiza e o Vue renderiza de novo. Se eu leio na linha seguinte, ainda vem o valor antigo. Para evitar, guardo o novo estado numa variável local (`nowFollowing`), uso ela nas contas seguintes e só depois atribuo ao model, sem ler o model de volta.

## 6. Por que o feed de quem eu sigo responde cedo quando não sigo ninguém?

Se eu não sigo ninguém, a lista de ids que eu sigo vem vazia, e buscar receitas "de autores dessa lista" não ia achar nada de qualquer jeito. Então o service confere se a lista está vazia e já devolve a página vazia (`recipes: []`, `total: 0`), sem fazer a segunda consulta ao banco.
