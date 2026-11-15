# Checkpoint 02: leitura guiada da API

Projeto: RecipeMaster. Módulos lidos: `search`, `user`, `recipe`, `like`, `comment` e `follow`.
Entidade principal: `Recipe`. Contador do usuário afetado: `recipesCount`.

## 2.1 Alguma rota (`*Routes.js`) tem lógica de negócio?

**Não.** Busquei por funções inline (`=> {`), `if`, `await`, `findOne` e `findAll` em todos os arquivos `*Routes.js`
e não encontrei nada. As rotas só declaram verbo, caminho, middlewares e o método do controller.
Exemplo: `modules/recipe/recipeRoutes.js`, rota `PUT /recipes/:id`: `isAuthenticated`, `upload.single('image')`, validador, `asyncHandler(recipeController.updateRecipe)`.

## 2.2 Algum controller consulta o Model direto, sem passar pelo Service?

**Não.** Nenhum `*Controller.js` importa um `*Model` nem chama `findOne`, `findAll`, `create`, `destroy` ou `increment`.
Os controllers só leem `req`, chamam o service e devolvem com `success()`.

## 2.3 Algum Service faz referência a `req` ou `res`?

**Não.** Nenhum `*Service.js` usa `req` ou `res`. Os services recebem valores simples (ids, textos, números) e devolvem dados ou lançam erro.

## 2.4 Todo controller usa `success()` / `error()`?

**Sim.** Nenhum controller usa `res.json`, `res.status` ou `res.send` direto.
Uma observação: `followController.js` usa `error()` dentro de `parseUserId` e responde sozinho, sem lançar. Funciona, mas é diferente do resto, que lança erro e deixa o `errorHandler` responder.

## 2.5 Toda rota que chama função `async` está dentro de `asyncHandler`?

**Sim.** As rotas de `recipe` aparecem na busca simples só porque o `router.post(` ocupa várias linhas.
Confirmei nas linhas 17, 24, 32, 39, 48 e 55 de `recipeRoutes.js`: todas chamam `asyncHandler(recipeController.<método>)`.
As duas rotas sem `asyncHandler` são síncronas e não precisam:
- `searchRoutes.js:6`: `searchController.search` (o service de busca ainda devolve listas vazias, sem banco).
- `userRoutes.js:12`: `userController.logout` (só devolve a mensagem).

Esses dois casos viram problema no dia em que o `search` consultar o banco.

## 2.6 Alguma validação de entrada feita com `if` manual, fora do `express-validator`?

**Não.** A única linha parecida é `userService.js:43` (`if (!passwordMatch)`), que é a conferência da senha no login, não validação de entrada.
Todos os campos de formulário são validados em `userValidator.js`, `recipeValidator.js` e `commentValidator.js`.

---

## Perguntas extras

### 1. Quantas vezes aparece o padrão `new Error(...)` / `error.status = N` / `throw error`?

- `new Error(`: **26** ocorrências.
- `error.status = N`: **19** ocorrências.
- Arquivos (ocorrências de `status =`): `recipeService.js` (7), `userService.js` (3), `commentService.js` (2), `followService.js` (2), `likeService.js` (2), `commentValidator.js` (1), `recipeValidator.js` (1), `userValidator.js` (1).
- `new Error(` também aparece nos dois multers (`profileMulter.js` e `recipeMulter.js`), para tipo de arquivo inválido.

O código que cria um erro com status é quase igual em todos esses lugares. Dá para trocar por uma função só (ex.: `httpError(status, message)`).

### 2. Que outro valor numérico solto aparece em mais de um arquivo?

- **255 e 150:** o tamanho de `bio` e de `title` aparece em `config/constants.js` (`BIO_MAX`, `TITLE_MAX`) **e** de novo nos models (`userModel.js:11` `STRING(255)`, `recipeModel.js:8` `STRING(150)`). São duas fontes de verdade: se eu mudar a constante e esquecer o model, a validação deixa passar um texto que o banco corta.
- **Limite de tamanho do upload:** `5 * 1024 * 1024` em `profileMulter.js:27` e `8 * 1024 * 1024` em `recipeMulter.js:33`, escritos à mão em cada multer.
- **Status `500`:** padrão repetido em `apiResponse.js:12` e `errorHandler.js:35`.
- **Salt do bcrypt:** `genSalt(10)` em `userService.js:17`.

### 3. Id inválido (`abc`) nas rotas equivalentes ao Bloco 2.5: respondem com o mesmo status?

**Não.**

| Rota com id `abc` | Status | Mensagem |
|---|---|---|
| `GET /users/abc/followers` | 400 | "O id do usuário deve ser um inteiro positivo." |
| `POST /users/abc/toggle-follow` | 400 | a mesma |
| `GET /recipes/abc` | **500** | `Unknown column 'NaN' in 'where clause'` |
| `GET /recipes/abc/comments` | **500** | idem |
| `POST /recipes/abc/toggle-like` | **500** | idem |
| `GET /recipes/abc/edit` | **500** | idem |
| `DELETE /recipes/abc` | **500** | idem |

Só o módulo `follow` valida o id (`parseUserId`, `followController.js`). Os módulos `recipe`, `like` e `comment` fazem `parseInt(req.params.id)` e passam o `NaN` para o banco, que devolve erro 500 e vaza um pedaço do SQL na mensagem.
Esse problema é do mesmo tipo da paginação corrigida hoje (entrada que o cliente controla indo direto para a consulta).

**Correção feita na Aula 12:** criei `utils/parseId.js` e passei a usar nos controllers de receita, curtida e comentário. Agora as cinco rotas acima respondem **400** com "O id da receita deve ser um inteiro positivo." (testei também `/recipes/-5`, que dá 400, e `/recipes/1`, que continua 200).

## Seção 2: nomes no meu projeto

| Nome | Exemplo (Shortz-App) | RecipeMaster |
|---|---|---|
| Entidade principal | Video | Recipe |
| Service que cria e mexe no contador do usuário | videoService.uploadVideo | recipeService.createRecipe |
| Contador do usuário afetado | videosCount | recipesCount |
| Controller do feed geral | userController.getFeed | userController.getFeed |
| Controller do feed filtrado | followController.getFollowingVideos | followController.getFollowingRecipes |
| Telas que leem dados ao montar | Detalhe, Perfil Público, Curtidas, Meus Vídeos, Listas de seguidores, Comentários, Feed, Feed filtrado | RecipeDetailView, PublicProfileView, LikedRecipesView, MyRecipesView, FollowListView, CommentSection, FeedView, FollowingRecipesView |

## Etapa 2: paginação antes e depois

Antes da correção (testei nos dois feeds, `/api/feed` e `/api/following-recipes`):

| Teste | O que aconteceu |
|---|---|
| `?limit=-3` | Erro 500, "You have an error in your SQL syntax ... near '-3'". O valor foi direto para o `LIMIT` do MySQL |
| `?limit=100000` | 200, devolveu tudo e ecoou `limit: 100000` |
| `?page=-2&limit=2` | Erro 500, SQL com `LIMIT -6, 2` (offset negativo) |
| `?limit=abc` | 200 com o padrão (10 no feed geral, 12 no filtrado: cada service tinha o seu número) |

Depois da correção (`PAGINATION` em `config/constants.js` e `parsePagination` em `utils/pagination.js`, usada no `userController.getFeed` e no `followController.getFollowingRecipes`):

| Teste | Resultado |
|---|---|
| `?limit=-3`, `?limit=abc`, `?page=-2&limit=2` | 200 com os valores padrão (page 1, limit 12) |
| `?limit=100000` | 200 com `limit: 50` (teto) |
| `?limit=1` e `?page=2&limit=1` | 200, uma receita por página, a página 2 traz a segunda receita |

Busca feita em `modules/`: o tamanho de página não aparece mais solto. O único número que sobrou é o `genSalt(10)` do bcrypt, que não tem nada a ver com paginação.

## Etapa 3: transação no createRecipe

`recipeService.createRecipe` agora faz o `Recipe.create` e o `User.increment('recipesCount')` dentro de `sequelize.transaction(async (t) => { ... })`, com `{ transaction: t }` nas duas escritas. Teste: criei uma receita pela API, ela respondeu 201 e o `recipesCount` da conta `teste123` foi de 6 para 7. Depois apaguei a receita de teste e o contador voltou para 6.
## Seção 13: pendências

| O que é | Por que não foi resolvido hoje | Em qual aula será resolvido |
|---|---|---|
| O `followController` tem a função `parseUserId`, que faz o mesmo que o `utils/parseId.js` | Não era bug, o follow já dava 400 | Aula 13 (Playlists e Busca), Etapa 1 |
| A busca é placeholder (`GET /api/search` e `SearchView`) | É funcionalidade nova | Aula 13 (Playlists e Busca), Etapas 4 e 5 |
| O CSS `.recipe-grid` está copiado em 5 telas e o `.empty-state` em 3 | É só visual e mexer agora exigiria retestar todas as listas | Aula 16 (Polimento de UX/UI) |
