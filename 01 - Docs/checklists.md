# Checklists — RecipeMaster

---

## Aula 01

### Parte A — Backend

**Etapa 1**
- [x] node -v e npm -v conferidos
- [x] Pasta recipe-master-api criada dentro de projetos-prog-web
- [x] package.json gerado com npm init -y

**Etapa 2**
- [x] express, cors, dotenv, morgan instalados
- [x] nodemon instalado como devDependency
- [x] Scripts start e dev configurados no package.json

**Etapa 3**
- [x] Pastas bin/, config/, middlewares/, modules/, routes/ criadas
- [x] .gitignore criado com node_modules/ e .env

**Etapa 4**
- [x] middlewares/apiResponse.js criado com as funções success e error

**Etapa 5**
- [x] routes/index.js criado com o nome do projeto
- [x] Campo data.status escrito exatamente como status

**Etapa 6**
- [x] .env criado com PORT=3000 e CORS_ORIGIN=http://localhost:5173

**Etapa 7**
- [x] app.js criado
- [x] bin/www criado
- [x] npm run dev sobe sem erros

**Etapa 8**
- [x] curl http://localhost:3000/api respondendo JSON com status online

### Parte B — Frontend

**Etapa 1**
- [x] npm install concluído
- [x] npm run dev abre em http://localhost:5173

**Etapa 2**
- [x] Estrutura de pastas criada
- [x] .env com VITE_API_URL apontando para a API
- [x] .gitignore configurado

**Etapa 3**
- [x] Tabela funcionalidade para tela preenchida
- [x] Uma tela placeholder criada para cada rota
- [x] src/router/index.js criado com todas as rotas
- [x] Router registrado no main.js

**Etapa 4**
- [x] TheNavbar.vue, TheSidebar.vue e TheFooter.vue criados
- [x] App.vue montado com router-view

**Etapa 5**
- [x] LandingView.vue consumindo a API
- [x] Landing Page exibindo Status da API: online
- [x] Erro de CORS reproduzido e corrigido

---

## Aula 02

### Parte A — Backend

**Etapa 1**
- [x] Pasta modules/search/ criada
- [x] searchService.js criado com recipes e users

**Etapa 2**
- [x] searchController.js criado com exports.search

**Etapa 3**
- [x] searchRoutes.js criado com router.get('/search', ...)

**Etapa 4**
- [x] searchRoutes importado no app.js
- [x] app.use('/api', searchRoutes) adicionado
- [x] API reiniciou sem erros

**Etapa 5**
- [x] curl .../api/search?q=teste responde no formato esperado
- [x] curl .../api/search sem q responde com query vazio
- [x] curl .../api continua funcionando

### Parte B — Frontend

**Etapa 1**
- [x] src/services/api.js criado com axios.create usando VITE_API_URL

**Etapa 2**
- [x] Interceptor de resposta adicionado ao api.js
- [x] Comentário no topo explicando os três ramos

**Etapa 3**
- [x] authService.js criado com register, login, logout
- [x] searchService.js criado com params q
- [x] systemService.js criado

**Etapa 4**
- [x] LandingView.vue usando getApiStatus em vez de fetch
- [x] Página ainda mostra Status da API: online

**Etapa 5**
- [x] Console mostrou Busca OK com o objeto esperado
- [x] Erro de rede provocado mostrou mensagem amigável do interceptor
- [x] Bloco de teste removido da Landing Page

---

## Aula 03

### Parte A — Backend

**Etapa 1**
- [x] sequelize, mysql2, bcryptjs, express-validator instalados

**Etapa 2**
- [x] Banco de dados recipe_master_db criado no MySQL
- [x] .env atualizado com DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
- [x] config/database.js criado

**Etapa 3**
- [x] config/constants.js criado

**Etapa 4**
- [x] userModel.js criado com recipesCount
- [x] userValidator.js criado
- [x] userService.js criado com recipesCount em getPublicProfile
- [x] Senha nunca devolvida em nenhuma resposta
- [x] asyncHandler.js criado
- [x] errorHandler.js criado
- [x] userController.js criado
- [x] userRoutes.js criado

**Etapa 5**
- [x] userRoutes e errorHandler registrados em app.js na ordem certa
- [x] Terminal exibe Banco de dados sincronizado!
- [x] Tabela users criada no MySQL com todas as colunas

**Etapa 6**
- [x] Cadastro com sucesso responde 201 com id, username, email
- [x] Senha curta responde 400 com mensagem correta
- [x] Cadastro duplicado responde 500
- [x] GET /profile/:username confirma dados persistidos

### Parte B — Frontend

**Etapa 2**
- [x] Link clicável para /register na Navbar

**Etapa 3**
- [x] Formulário controlado com v-model em cada campo
- [x] errors e apiErrorMessage preparados no script setup

**Etapa 4**
- [x] validate() replica os limites do userValidator.js
- [x] Mensagens de erro aparecem e desaparecem corretamente

**Etapa 5**
- [x] Envio vazio não dispara chamada de rede
- [x] Cadastro válido navega para /login
- [x] Cadastro duplicado exibe apiErrorMessage

**Etapa 6**
- [x] Cinco comportamentos testados
- [x] curl confirma cadastro persistido no banco

---

## Aula 04

### Parte A — Backend

- [x] jsonwebtoken instalado
- [x] .env atualizado com JWT_SECRET e JWT_EXPIRES_IN
- [x] config/jwt.js criado com generateToken e verifyToken
- [x] middlewares/auth.js criado com isAuthenticated
- [x] userService.js atualizado com loginUser e getUserProfile
- [x] userValidator.js atualizado com loginValidator
- [x] userController.js atualizado com login, logout, getMyProfile
- [x] userRoutes.js atualizado com /profile/me antes de /profile/:username
- [x] Login com sucesso devolve token e user (incluindo isAdmin)
- [x] Senha errada devolve 500 com mensagem genérica
- [x] GET /profile/me sem token devolve 401
- [x] GET /profile/me com token válido devolve dados do usuário
- [x] GET /profile/me com token inválido devolve 401

### Parte B — Frontend

- [x] createPinia() registrado em main.js antes de .use(router)
- [x] stores/auth.js criado com persistência via localStorage
- [x] Interceptor de requisição anexando Authorization quando existe token
- [x] Interceptor de resposta limpando sessão e redirecionando em qualquer 401
- [x] Bootstrap 5 incluído via CDN no index.html
- [x] src/assets/main.css criado com cor de marca #e25822
- [x] Tela de Login funcional chamando authStore.login()
- [x] Guarda de rota bloqueando acesso a rotas com requiresAuth: true
- [x] Guarda de rota atualizado para usar useAuth() — composable sem useRouter(), router.push fica na Navbar
- [x] Navbar mostra links diferentes conforme estado de login
- [x] Logout limpa sessão e redireciona ao Login
- [x] Login funcional → redireciona ao feed
- [x] F5 logado → sessão persiste via localStorage
- [x] Logout → rota protegida redireciona ao Login com ?redirect=...
- [x] Login a partir da tela redirecionada → volta à rota original
- [x] Token editado manualmente → redirecionamento automático ao Login

---

## Aula 05

### Parte A — Backend

- [x] Pasta public/uploads/profiles/ criada com default-profile.png
- [x] multer instalado
- [x] BIO_MAX adicionado a config/constants.js
- [x] middlewares/profileMulter.js criado
- [x] express.static adicionado ao app.js antes das rotas
- [x] profileUpdateValidator criado no userValidator.js
- [x] updateUserProfile criado no userService.js
- [x] updateProfile criado no userController.js
- [x] PUT /profile/me adicionado ao userRoutes.js
- [x] Atualização sem foto mantém a foto atual
- [x] Atualização com foto nova salva e remove a antiga
- [x] GET /uploads/profiles/ responde 200
- [x] Bio acima de 255 caracteres é recusada com 400

### Parte B — Frontend

- [x] Link Meu Perfil visível na Navbar quando logado
- [x] .env atualizado com VITE_UPLOADS_URL
- [x] src/utils/media.js criado com getProfilePictureUrl
- [x] updateProfile(formData) criado com Content-Type multipart/form-data
- [x] Tela carrega dados reais do usuário ao montar
- [x] Selecionar foto atualiza prévia sem chamada de rede
- [x] Salvar funciona com e sem trocar foto

---

## Aula 06

### Parte A — Backend (Checkpoint de Consistência)

- [x] checkpoint-01.md criado e respondido
- [x] Todos os endpoints já construídos continuam respondendo como esperado

### Parte B — Frontend

- [x] bootstrap-icons incluído via CDN no index.html
- [x] BaseInput.vue criado em src/components/base/
- [x] BaseButton.vue criado em src/components/base/
- [x] FormCard.vue criado em src/components/base/
- [x] RegisterView.vue refatorado para usar BaseInput / BaseButton / FormCard
- [x] LoginView.vue refatorado para usar BaseInput / BaseButton / FormCard
- [x] MyProfileView.vue refatorado para usar BaseInput e BaseButton (FormCard não aplicado — layout de perfil é diferente dos formulários de auth)
- [x] Tela de Registro visualmente consistente com Login/Perfil (cor de marca #e25822)
- [x] composables/useAuth.js criado
- [x] Guarda de rota atualizado para usar useAuth() — composable sem useRouter(), router.push fica na Navbar
- [x] TheNavbar.vue atualizada para usar useAuth()
- [x] TheSidebar.vue atualizada para usar useAuth(), com links condicionais ao estado de login
- [x] Nenhum link novo aponta para funcionalidade ainda não construída

### Checklist de testes

- [x] Cadastro → redireciona ao Login com tela estilizada
- [x] Login → redireciona à tela principal (/feed)
- [x] Navbar → troca correta entre estado logado/deslogado
- [x] Edição de Perfil → dados reais, edição, upload de foto continuam funcionando
- [x] Guarda de rota → deslogado, rota protegida redireciona ao Login
- [x] Console do DevTools sem erros novos

---

## Aula 07

### Parte A — Backend

- [x] Pasta public/uploads/recipes/ criada
- [x] TITLE_MAX, DESCRIPTION_MAX, INGREDIENTS_MAX, INSTRUCTIONS_MAX adicionados a constants.js
- [x] modules/recipe/recipeModel.js criado com todos os campos
- [x] config/associations.js criado (User hasMany Recipe / Recipe belongsTo User)
- [x] middlewares/recipeMulter.js criado (Grupo B — multer.single('image'))
- [x] modules/recipe/recipeValidator.js criado
- [x] modules/recipe/recipeService.js criado (createRecipe + incrementa recipesCount)
- [x] modules/recipe/recipeController.js criado
- [x] modules/recipe/recipeRoutes.js criado (auth → multer → validator → controller)
- [x] app.js atualizado com recipeRoutes e associations carregado antes do sync
- [x] Tabela recipes criada no banco com FK para users
- [x] Upload completo funciona e recipesCount do usuário sobe
- [x] Casos de erro recusados com status correto

### Parte B — Frontend

- [x] src/services/recipeService.js criado com onUploadProgress
- [x] UploadRecipeView.vue construído com formulário, preview e barra de progresso
- [x] Link "Nova Receita" visível na Sidebar apenas quando logado
- [x] Barra de progresso funcionando
- [x] Prévia de imagem funcionando (sem chamada de rede)
- [x] 01-Docs/atividade07/ficha-preparacao.md criado

### Checklist de testes

- [x] Login → clique em Nova Receita → URL muda sem recarregar
- [x] Envio vazio → erros de campo obrigatório aparecem
- [x] Imagem selecionada → prévia aparece sem chamada de rede
- [x] Envio → barra de progresso avança → mensagem de sucesso
- [x] Network mostra Content-Type: multipart/form-data
- [x] Banco confirma registro criado e recipesCount subiu

---

## Aula 08

### Parte A — Backend

- [x] middlewares/optionalAuth.js criado
## Aula 08

### Parte A — Backend

- [x] middlewares/optionalAuth.js criado
- [x] viewsCount adicionado ao recipeModel
- [x] getRecipeById adicionado ao recipeService.js (include do autor sem senha, incrementa viewsCount, isOwner)
- [x] getFeed adicionado ao userService.js (paginado, offset = (page-1)*limit) — feed é visão do usuário logado
- [x] getFeed adicionado ao userController.js
- [x] GET /api/recipes/:id criada em recipeRoutes.js (optionalAuth)
- [x] GET /api/feed criada em userRoutes.js (isAuthenticated, paginada)
- [x] Streaming: não se aplica (Grupo B)
- [x] Detalhe sem token → 200, isOwner: false, viewsCount: 1
- [x] Detalhe com token do dono → 200, isOwner: true, viewsCount: 2
- [x] Detalhe inexistente → 404
- [x] Feed sem token → 401
- [x] Feed page=1&limit=1 → 1 item
- [x] Feed page=2&limit=1 → próximo item

### Parte B — Frontend

- [x] getRecipeImageUrl adicionado a utils/media.js
- [x] getRecipeById adicionado a recipeService.js
- [x] getFeed criado em userService.js (frontend espelha decisão do backend)
- [x] RecipeCard.vue criado em components/recipe/
- [x] FeedView.vue com grade e "Carregar mais" (LIMIT=3)
- [x] RecipeDetailView.vue com imagem real (380px, maior que miniatura do card de 200px) e isOwner guardado no estado
- [x] MyProfileView.vue usa BaseInput e BaseButton (FormCard não aplicado — layout de perfil é diferente dos formulários de auth)

### Checklist de testes

- [x] Login → Feed → itens reais aparecem
- [x] Clique num card → detalhe sem recarregar
- [x] Grupo B: imagem carrega em resolução real
- [x] F5 no detalhe → viewsCount sobe (confirmado)
- [x] ID inexistente → mensagem de erro sem quebrar a tela

---

## Aula 09

### Parte A — Backend

- [x] reload() verificado no detalhe — duas chamadas consecutivas devolvem contagens consecutivas
- [x] Verificação 404 antes de 403 nas funções getRecipeForEdit, updateRecipe e deleteRecipe
- [x] Ordem banco → disco respeitada em updateRecipe e deleteRecipe
- [x] recipesCount decrementado na exclusão (User.decrement)
- [x] getMyRecipes adicionado ao recipeService.js
- [x] getRecipeForEdit adicionado ao recipeService.js
- [x] updateRecipe adicionado ao recipeService.js
- [x] deleteRecipe adicionado ao recipeService.js
- [x] Quatro handlers no recipeController.js (getMyRecipes, getRecipeForEdit, updateRecipe, deleteRecipe)
- [x] updateRecipeValidator criado no recipeValidator.js
- [x] GET /my-recipes adicionado ao recipeRoutes.js (isAuthenticated)
- [x] GET /recipes/:id/edit adicionado ao recipeRoutes.js (isAuthenticated) — antes de GET /recipes/:id
- [x] PUT /recipes/:id adicionado ao recipeRoutes.js (auth → multer → validator → controller)
- [x] DELETE /recipes/:id adicionado ao recipeRoutes.js (isAuthenticated)
- [x] getPublicProfile atualizado no userService.js com include de receitas e isOwner
- [x] getPublicProfile no userController.js passa requestingUserId
- [x] /profile/:username em userRoutes.js usa optionalAuth
- [x] errorHandler.js atualizado para limpeza de arquivos órfãos (req.file / req.files)
- [x] errorHandler ainda é o último app.use do app.js

### Parte B — Frontend

- [x] composables/useClickOutside.js criado
- [x] components/base/BaseModal.vue criado com Teleport to="body"
- [x] getMyRecipes, getRecipeForEdit, updateRecipe, deleteRecipe criados em recipeService.js
- [x] getPublicProfile criado em userService.js
- [x] RecipeCard refatorado — sem <a> gigante, autor clicável (router-link independente), slot actions
- [x] TheNavbar.vue atualizada com menu suspenso no avatar (useClickOutside, fecha com Esc)
- [x] TheSidebar.vue atualizada com link Minhas Receitas
- [x] MyRecipesView.vue criada com grade, botões Editar/Excluir no slot actions, modal fora do card
- [x] EditRecipeView.vue criada com formulário pré-preenchido, preview local, troca opcional de imagem
- [x] PublicProfileView.vue criada com isOwner, botão Editar Perfil / Seguir / nenhum conforme estado
- [x] RecipeDetailView.vue atualizada — autor clicável, botão Editar visível só para o dono
- [x] UploadRecipeView.vue atualizado — redireciona para /my-recipes após sucesso, link na mensagem

---

## Aula 10

### Parte A — Backend

- [x] COMMENT_MAX adicionado a config/constants.js
- [x] commentsCount adicionado ao recipeModel.js
- [x] Model Like criado com índice único composto (userId + recipeId)
- [x] Model Comment criado com índices em recipe_id e user_id
- [x] Associações nos dois sentidos (User↔Like, Recipe↔Like, User↔Comment, Recipe↔Comment) em associations.js
- [x] Módulo like completo: toggleLike, getLikeStatus, getLikedRecipes
- [x] Módulo comment completo: addComment, getComments com validador (trim antes de notEmpty)
- [x] Todas as escritas duplas (linha + contador) dentro de transação
- [x] Detalhe devolvendo isLiked
- [x] Exclusão em transação com limpeza de likes e comentários
- [x] trim() movido para o início nos campos obrigatórios dos validators

### Parte B — Frontend

- [x] likeService.js criado (toggleLike, getLikeStatus, getLikedRecipes)
- [x] commentService.js criado (addComment, getComments)
- [x] utils/format.js criado (formatCount, formatDate, timeAgo)
- [x] LikeButton.vue com atualização otimista e rollback
- [x] Visitante é redirecionado ao login ao clicar em curtir
- [x] CommentSection.vue com lista, formulário validado, novo comentário no topo
- [x] Texto do comentário com {{ }} nunca v-html
- [x] RecipeDetailView atualizado com LikeButton e CommentSection
- [x] Contadores (likesCount, commentsCount) adicionados ao RecipeCard
- [x] LikedRecipesView criado com rota /liked-recipes
- [x] Link "Receitas Curtidas" adicionado à Sidebar

---

## Aula 11

### Parte A — Backend

- [x] followModel.js criado com índice único composto (follower_id, following_id) e índice simples (following_id)
- [x] Associações com apelidos declaradas em config/associations.js (Follower / Following)
- [x] Tabela follows confirmada no banco com os dois índices
- [x] followService.js criado (toggleFollow com transação, getFollowStatus, getFollowers, getFollowing, getFollowingRecipes)
- [x] followController.js criado com parseUserId na borda
- [x] followRoutes.js criado (toggle-follow e follow-status autenticadas; followers e following públicas; /following-recipes autenticada)
- [x] followRoutes registrado no app.js antes do 404 e errorHandler
- [x] getFollowingRecipes com Op.in, paginado, retorna [] cedo se não segue ninguém
- [x] isFollowing devolvido no getPublicProfile (consultado só quando logado e não-dono)

### Parte B — Frontend

- [x] followService.js criado com toggleFollow, getFollowers, getFollowing, getFollowingRecipes
- [x] FollowButton com defineModel, atualização otimista, rollback e isBusy
- [x] PublicProfileView atualizado: FollowButton ativo, números de seguidores/seguindo viram links
- [x] FollowListView criado (uma tela, duas rotas: profile-followers e profile-following)
- [x] FollowingRecipesView criado com paginação "Carregar mais"
- [x] Rotas no router/index.js (following-recipes requiresAuth, profile-followers e profile-following públicas)
- [x] Link "Seguindo" na Sidebar aponta para /following-recipes (rota existente)
- [x] respostas.md criado com as 6 perguntas respondidas

### Checagem de alcançabilidade (ADR-012)

Caminhos de clique construídos, sem precisar digitar URL:

| Peça | Caminho de clique | Rota |
|------|-------------------|------|
| Seguir / deixar de seguir | Clicar no autor de um card (Feed, Detalhe, Comentários) ou em um nome nas listas de seguidores → Perfil Público → botão "Seguir". Visitante: clique leva ao Login (`?redirect=`) e volta ao perfil depois de entrar | `/profile/:username` |
| Listas de seguidores / seguindo | No Perfil Público ou no Meu Perfil, os números "seguidores" e "seguindo" são links. Dentro da lista, abas Seguidores/Seguindo e botão "← Perfil" | `/profile/:username/followers` e `/profile/:username/following` |
| Feed de quem eu sigo | Sidebar → "Seguindo" (um clique, logada) | `/following-recipes` |

Verificação do link da Sidebar: o item "Seguindo" aponta para `/following-recipes`, que existe no `router/index.js` (nome `following-recipes`, `requiresAuth: true`). Nenhum ajuste foi necessário no path.

Observação: a busca de usuários por nome não faz parte desta aula (a tela "Buscar" é placeholder). Perfis de outras pessoas são alcançados pelo autor dos cards e pelas listas de seguidores/seguindo.

### Checklist de testes

- [x] toggle-follow sem token 401; id abc 400; seguir a si mesmo 400; usuário 99999 404 (curl-1 a curl-4)
- [x] A segue B → 201; A de novo → 200; C segue B → followersCount: 2; B segue A (curl-5, otimista.jpg e curl-7)
- [x] Contadores dos dois lados conferidos (curl-6, curl-7 e curl-7b)
- [x] follow-status e isFollowing no perfil conferidos (visitante false; A vendo B true; B vendo o próprio perfil false com isOwner true)
- [x] followers e following conferidos sem password (curl-7 e curl-7b)
- [x] Feed filtrado: sem token 401; só mostra itens de quem se segue; lista vazia quando se segue só quem não tem receitas (curl-8, curl-8b e teste de clique 7)
- [x] Banco recusa linha repetida em follows (follows.jpg, erro 1062)
- [x] Teste de clique 1 a 7: visitante é levado ao login e volta ao perfil; seguir/deixar de seguir muda botão e contador na hora e F5 mantém; contador nunca fica negativo; no próprio perfil não há botão de seguir e os números são links; abas Seguidores/Seguindo trocam sem recarregar e usuário inexistente mostra erro sem quebrar a tela; o botão reflete a pessoa ao trocar de perfil; feed "Seguindo" pela Sidebar mostra só receitas de quem se segue
- [x] Slow 4G e Offline com rollback (otimista.jpg e rollback.jpg)
- [x] Regressão: Feed, Detalhe (curtir e comentar), Minhas Receitas, Receitas Curtidas, Meu Perfil (editar) e Login/Logout funcionando, sem erro novo no console

---
## Aula 12

### Parte A — Backend
- [x] checkpoint-02.md criado, com as respostas dos Blocos 2.1 a 2.6 e as três perguntas extras
- [x] Problema da paginação reproduzido antes da correção (limit=-3 e page=-2 deram 500; limit=100000 devolveu tudo)
- [x] PAGINATION em config/constants.js e utils/pagination.js criados e usados nos dois controllers de feed e nos dois services
- [x] Testes de paginação com o resultado esperado (limit=-3, abc e page=-2 usam o padrão; limit=100000 vira 50; limit=1 e page=2&limit=1 funcionam)
- [x] createRecipe dentro de sequelize.transaction com { transaction: t } nas duas escritas
- [x] Criação testada: 201 e recipesCount incrementado
- [x] Id inválido corrigido: utils/parseId.js usado em recipe, like e comment (400 em vez de 500)
- [x] Regressão da API com todas as chamadas respondendo como esperado (regressao-1 a regressao-10)

### Parte B — Frontend
- [x] src/config/constants.js criado (STORAGE_KEYS, LIMITS iguais aos da API, PAGE_SIZE, TOAST_DURATION, MESSAGES)
- [x] api.js, stores/auth.js e os services de feed usam as constantes
- [x] useToast e ToastContainer criados, container montado uma vez no App.vue (z-index acima do BaseModal)
- [x] Interceptor com notifyIfNeeded: ação que falha vira toast, leitura é da tela, 401 vai ao login
- [x] silent: true só nos formulários (login, cadastro, logout, editar perfil, criar e editar receita, comentar)
- [x] useAsyncData e usePaginatedList criados
- [x] Cada tela de leitura testada no navegador depois da troca (feita junto com a regressão completa)
- [x] Telas de leitura refatoradas: Detalhe, Perfil Público, Curtidas, Minhas Receitas, Listas de seguidores/seguindo, Comentários, Feed e Feed de quem sigo
- [x] Decisão registrada: MyProfileView, LoginView, RegisterView, UploadRecipeView e EditRecipeView ficaram de fora porque apenas preenchem um formulário e o erro pertence ao formulário
- [x] useAuthenticatedAction criado e usado em LikeButton e FollowButton, sem errorMessage local
- [x] Limites dos formulários trocados por LIMITS.* (RegisterView e MyProfileView)
- [x] respostas.md com as 7 perguntas
- [x] Prints de toast (toast-erro, toast-sucesso, toast-modal, uma-requisicao, formulario-sem-toast) e de paginação (antes e depois)
- [x] Teste de regressão completo no navegador com conta nova (cadastro, perfil, receita com foto, edição, feed com Carregar mais, curtir, comentar, curtidas, seguir, seguidores/seguindo, feed Seguindo, toast com Offline, toast de exclusão, visitante levado ao login e de volta à receita), sem erros vermelhos no Console além dos de Offline
- [x] Bug achado na regressão e corrigido: depois de editar o perfil, a foto não aparecia na navbar (MyProfileView agora atualiza o usuário da store com authStore.updateUser)
- [x] Toasts aumentados (fonte, padding e largura) depois do teste visual
- [x] Pendências da Seção 13 registradas no checkpoint-02.md com a aula nomeada (Aula 13)





---
## Aula 13

### Nomes no meu projeto
| Nome | Shortz-App | RecipeMaster |
|---|---|---|
| Coleção do usuário | Playlist | Lista (model `RecipeList`, tabela `recipe_lists`) |
| Model da junção | PlaylistVideo (`playlist_videos`) | `RecipeListItem` (`recipe_list_items`) |
| Contador de itens na coleção | videosCount | recipesCount |
| Rotas | /api/my-playlists, /api/playlists | /api/my-lists, /api/lists |
| Rota do status | /api/videos/:videoId/playlists-status | /api/recipes/:recipeId/lists-status |
| Campo de texto da busca | title | title (da receita) |
| Campo do status | hasVideo | hasRecipe |
| Telas | MyPlaylistsView, PlaylistDetailView | MyListsView, ListDetailView |

### Parte A — Backend
- [x] Constantes LIST_TITLE_MIN/MAX, LIST_DESCRIPTION_MAX e o bloco SEARCH criados
- [x] parseId com a mensagem "Identificador de <label> inválido." e usado pelo followController (parseUserId apagado). GET /users/abc/followers continua 400 (a mensagem mudou para "Identificador de usuário inválido.", o mesmo padrão dos outros módulos)
- [x] Dois models (listModel, listItemModel) e seis associações
- [x] Tabelas, índices (idx_recipe_lists_user_id, idx_unique_list_recipe, idx_list_items_recipe_id) e chaves estrangeiras com ON DELETE CASCADE conferidos com SHOW CREATE TABLE
- [x] Quatro arquivos do módulo list (validator, service, controller, routes), registrados no app.js
- [x] Duas escritas (linha + contador) numa só transação ao adicionar, remover e excluir
- [x] 403 para lista privada de outra pessoa; isOwner certo para dona, outra conta e visitante
- [x] Busca consultando o banco, com escapeLike, Promise.all e entrada tratada (typeof, trim, mínimo e máximo)
- [x] searchController async/await e rota com asyncHandler
- [x] Exclusão da receita limpa a junção e desconta o contador de cada lista, na mesma transação
- [x] Teste de controle feito e descrito: com o bloco comentado, a Rapida 2 ficou com recipesCount 2 tendo 1 linha na junção (contador-controle.jpg); com o bloco de volta, o contador caiu para 1 (contador-certo.jpg)
- [x] Os onze testes da Etapa 6 executados com sucesso (curl-1 a curl-11; o teste 10 é a linha repetida na junção, feito no MySQL: curl-10.jpg e colecoes-banco.jpg, com ERROR 1062)

### Parte B — Frontend

Checagem de alcançabilidade:

| Peça | Caminho de clique |
|---|---|
| Minhas Listas | Menu do avatar → "Minhas Listas" (novo) e Sidebar → "Minhas Listas" (novo) |
| Criar / excluir lista | Botão "Nova lista" na própria tela (modal); "Excluir" em cada cartão (confirmação) |
| Detalhe da lista | Clique no cartão, na tela Minhas Listas |
| Salvar uma receita | Botão "Salvar" no Detalhe da receita (visitante → login → volta à receita) |
| Remover uma receita da lista | Botão "Remover da lista" em cada cartão, no detalhe da lista (só para a dona) |
| Busca | Barra da Navbar (Enter) e item "Explorar" da Sidebar |

Verificação antes de programar: as três rotas já existiam no `router/index.js` desde a Aula 01 (`my-lists` com requiresAuth, `list-detail` pública, `search`). O nome `search` é o mesmo usado no `router.push`. Na Sidebar, troquei "Buscar Receitas" por "Explorar" (aponta para `/search`) e acrescentei "Minhas Listas" (aponta para `/my-lists`). Na Navbar, o link "Buscar" virou a barra de busca.

Observação: o Feed exige login desde a Aula 08, mas a busca é pública (o enunciado pede a barra visível também para visitante). Então o visitante não vê o Feed, mas acha as mesmas receitas pela busca. Mantive assim porque segue os dois enunciados. Deixar isso coerente fica para a Aula 16 (Polimento de UX/UI).

Decisão de escopo (lacuna conhecida): a lista pública de outra pessoa só é alcançável por link. Nenhuma tela mostra as listas públicas de alguém (por exemplo, no perfil público). Não resolvi de propósito, como o enunciado pede.

- [x] Constantes (LIST_TITLE_MIN/MAX, LIST_DESCRIPTION_MAX, SEARCH), listService com as sete funções. A Home não chamava search(), então não tinha nada para limpar
- [x] runOptimistic criado em utils/optimistic.js
- [x] Os dois botões refatorados e testados sem regressão (otimista, Offline com rollback e toast, visitante → login → volta)
- [x] Modal de criação, lista e detalhe funcionando, com 403/404 na própria tela
- [x] Cartão clicável com botão "Excluir" funcionando por cima do link esticado
- [x] Modal "Salvar" com caixas marcadas conforme o servidor, otimista, com rollback e uma cerca por linha (salvar-modal, otimista-modal e rollback-modal)
- [x] Botão "Salvar" no Detalhe, com o comportamento do visitante
- [x] Digitar uma palavra inteira sem pausa gera uma requisição (debounce.jpg)
- [x] Termo na URL: F5 e link funcionam; Navbar leva à busca já com o termo; Voltar não passa por cada pausa
- [x] Os seis passos do teste prático completo, a partir do login, sem digitar URL
- [x] respostas.md com as oito perguntas





---
## Aula 14

### Nomes no meu projeto
| Nome | Shortz-App | RecipeMaster |
|---|---|---|
| Model de notificação | Notification (`notifications`, módulo notification) | Notification (`notifications`, módulo notification) |
| Model de denúncia | Report (`reports`, módulo report) | Report (`reports`, módulo report) |
| Id do item nas duas tabelas | videoId | recipeId |
| Rota da denúncia | POST /api/videos/:videoId/report | POST /api/recipes/:recipeId/report |
| Texto de "curtiu" | curtiu o seu vídeo | curtiu a sua receita |
| Texto de "comentou" | comentou no seu vídeo | comentou na sua receita |
| Tela e componentes | NotificationsView, ReportVideoModal | NotificationsView, ReportRecipeModal |
| Os três gatilhos | toggleLike, addComment, toggleFollow | likeService.toggleLike, commentService.addComment, followService.toggleFollow |

### Parte A — Backend
- [x] Constantes (NOTIFICATION.TYPES e REPORT.REASONS), dois models e cinco associações
- [x] Tabelas, índices, ENUM e chaves estrangeiras conferidos no banco (reports: NO ACTION; notifications: SET NULL)
- [x] Quatro arquivos do módulo notification, registrados no app.js
- [x] GET /notifications sem token responde 401
- [x] Quatro arquivos do módulo report (validator, service, controller, routes), registrados no app.js
- [x] A ordem dos erros: 401 → 400 (motivo) → 400 (id) → 404 → 400 (própria receita) → 409
- [x] As três ações criam o aviso dentro da transação, com o t; curtir e seguir também o apagam ao desfazer
- [x] Exclusão da receita limpa denúncias e notificações, antes do destroy da receita
- [x] cors antes do express.json() no app.js
- [x] Teste de controle feito e descrito (as duas partes): sem o destroy das denúncias, 500 "Cannot delete or update a parent row: a foreign key constraint fails (reports...)" (controle-reports.jpg); sem o destroy das notificações, 200 e sobrou um aviso de like com recipe_id NULL (controle-orfa.jpg), que foi apagado depois
- [x] Os onze testes da Etapa 5 executados com sucesso (curl-1 a curl-11, com curl-2b, curl-7b e curl-9b; o teste 8 é no MySQL: curl-8.jpg e banco-notificacoes.jpg)

### Parte B — Frontend

Checagem de alcançabilidade:

| Peça | Caminho de clique |
|---|---|
| Notificações | Sino na Navbar (visível em todas as telas, só para quem está logado) |
| Marcar como lida | Botão "Marcar como lida" na linha e clique na própria notificação |
| Ir ao que gerou o aviso | Clique no texto: a receita (curtir/comentar) ou o perfil de quem seguiu (seguir) |
| Ver as mais antigas / as novas | "Carregar mais notificações" no fim / "Atualizar" no topo |
| Denunciar | Botão "Denunciar" no Detalhe da receita (visitante → login → volta; o dono não vê) |

Verificação antes de programar: a rota `/notifications` já existia no `router/index.js` desde a Aula 01, com `requiresAuth` e o nome `notifications`, o mesmo que a Navbar usa em `{ name: 'notifications' }`. O arquivo `NotificationsView.vue` existia como placeholder e foi substituído pela tela.

Decisão de escopo (lacuna conhecida): a lista de notificações não se atualiza sozinha; só o número do sino. Para ver avisos novos na lista, é preciso clicar em "Atualizar".

Observações:
- O toast passou a aparecer abaixo da Navbar (top: 5rem), para não cobrir o sino.
- A lista usa o mesmo tamanho de página dos feeds (`PAGE_SIZE`, 3), então o "Carregar mais notificações" já aparece a partir da 4ª notificação.
- O `usePaginatedList` ganhou a opção `itemsKey` (a API devolve `notifications` em vez de `recipes`), e o `BaseModal` ganhou a prop `busy` (não fecha enquanto envia). Os dois modais de formulário (lista e denúncia) usam o `busy`.

- [x] Constantes (NOTIFICATIONS.POLL_MS, NOTIFICATION_TEXT, REPORT_REASONS), os dois services e a store com as cinco funções
- [x] removeEventListener recebe a mesma referência do addEventListener (refreshIfVisible)
- [x] O sino aparece só para quem está logado; o selo só com não lidas
- [x] O número se atualiza sozinho; um só temporizador depois de logins e logouts repetidos; nenhuma requisição ao sair da conta
- [x] Lista paginada, estado vazio, "Atualizar" e "Carregar mais"
- [x] Marcar como lida: otimista, rollback com toast, uma requisição por clique duplo, e o sino certo mesmo com duas linhas falhando juntas
- [x] Modal com os cinco rádios; motivo obrigatório; erro dentro do modal e sem toast; toast de sucesso
- [x] O dono da receita não vê o botão "Denunciar"
- [x] Logout com o Console limpo
- [x] Os nove passos do teste prático completo, a partir do login
- [x] respostas.md com as dez perguntas


---
## Aula 15

### Nomes no meu projeto
| Nome | Shortz-App | RecipeMaster |
|---|---|---|
| Rota da lista de itens do painel | GET /api/admin/videos | GET /api/admin/recipes |
| Rota de excluir pelo painel | DELETE /api/admin/videos/:id | DELETE /api/admin/recipes/:id |
| Função de excluir (com isAdmin) | videoService.deleteVideo(id, userId, isAdmin) | recipeService.deleteRecipe(id, userId, isAdmin) |
| Campo de texto da busca de itens | title | title |
| Id do item nas denúncias | videoId | recipeId |
| Telas e rotas do front | AdminVideosView, admin-videos | AdminRecipesView, admin-recipes |
| Textos do painel | "Vídeos", "Excluir vídeo", "Denunciado por..." | "Receitas", "Excluir receita", "Denunciado por..." |
| Chave do token no localStorage | shortz_token / shortz_user | auth_token / auth_user |

Contas de teste: ADMIN = `admin` (admin@recipemaster.com, promovido com `node scripts/setAdmin.js admin`), A = `teste123` (dona da maioria das receitas), B = `barbara` (dona da "Teste toast 2"), C = `batata`. Senha de todas: 123456.

### Parte A — Backend
- [x] Constantes (REPORT.STATUS e ADMIN.REPORT_FILTERS), model de denúncia com status, reviewedAt e o índice idx_reports_status
- [x] Banco com status e reviewed_at; as 4 denúncias antigas ficaram pending (graças ao defaultValue)
- [x] isAuthenticated assíncrono, consultando o banco, e isAdmin exportados; as rotas antigas continuam funcionando sem alteração
- [x] Login de bloqueado → 403 (a checagem vem depois da senha; senha errada de um bloqueado continua com "Credenciais inválidas.")
- [x] escapeLike em utils/ (busca pública e painel); scripts/setAdmin.js promovendo e rebaixando
- [x] Quatro arquivos em modules/admin/, registrados no app.js depois das rotas de denúncia
- [x] GET /api/admin/dashboard sem token responde 401 (e não 404)
- [x] A exclusão do painel não tem uma linha nova de destroy: reaproveita o deleteRecipe com isAdmin = true
- [x] Os dois testes de controle feitos, desfeitos e descritos: sem o if (user.isBlocked), o token antigo da barbara bloqueada respondeu 200 (controle-bloqueio.jpg); sem o isAdmin no router.use, a teste123 (usuária comum) abriu o dashboard com 200 e todos os números (controle-isadmin.jpg)
- [x] Os nove testes da Etapa 5 executados com sucesso (curl-1 a curl-9, com curl-2b, curl-6b, curl-8b e curl-8c)

Observação: o login com senha errada respondia 500 (o erro não tinha status). Passou a responder 401, com a mesma mensagem "Credenciais inválidas.".

### Parte B — Frontend

Checagem de alcançabilidade:

| Peça | Caminho de clique |
|---|---|
| Painel de administração | Barra lateral → seção "Administração" (só para administrador) → "Painel" (aponta para /admin, que redireciona ao Dashboard) |
| Denúncias | Aba "Denúncias" e o cartão vermelho de denúncias pendentes do Dashboard |
| Usuários / Receitas | As abas do painel |
| Revisar / Bloquear / Excluir | Botões na linha (bloquear e excluir abrem confirmação; desbloquear é direto) |
| Filtrar / buscar | Grupo de botões (Denúncias); campo com debounce (Usuários e Receitas) |
| Ver o item / o perfil | Miniatura ou título (Denúncias e Receitas); @usuário (Usuários) |

Verificação antes de programar: as quatro rotas admin-* existiam desde a Aula 01 com requiresAdmin, e os quatro arquivos de views/admin/ existiam como placeholders. A barra lateral **não tinha** o link do administrador (ele tinha sido tirado porque o painel ainda não existia). Acrescentei a seção "Administração" com o link para /admin, visível só para administrador.

Limitação conhecida: a paginação por offset pula itens quando a lista muda entre uma página e a próxima (por exemplo, revisar uma denúncia antes do "Carregar mais"). O conserto (paginação por cursor) fica para a Aula 18.

Observação: no teste do pulo, com PAGE_SIZE = 2 (temporário), revisei a primeira pendente antes do "Carregar mais" e uma denúncia da @testes12345 (id 20) não apareceu na tela, embora estivesse na lista do servidor (pulo-paginacao.jpg). O "Atualizar" a trouxe de volta. O PAGE_SIZE voltou para 3.

Observação: o texto branco do cartão de pendentes e o título da página inicial precisaram de !important, porque o style.css global tem a { color: inherit !important }.

Observação: a guarda por papel do front lê o isAdmin salvo no login. Quem é promovido precisa sair e entrar de novo para ver a seção Administração.

- [x] Constantes (REPORT_FILTERS), adminService com as sete chamadas, usePaginatedList com a opção watch e a guarda contra resposta velha, e o ConfirmModal
- [x] Feed, Seguindo, Notificações e Listas continuam abrindo e carregando mais
- [x] /admin abre o Dashboard; as abas aparecem com a atual destacada; as telas vêm dentro do layout
- [x] Visitante → Login (?redirect=); usuário comum → Feed com aviso
- [x] Dashboard com os cartões e o link para as denúncias; erro 403 mostrado no lugar dos números
- [x] Denúncias: filtro que recarrega, motivo em português, revisar que espera a API
- [x] Busca com debounce (uma requisição depois da pausa) e sem perder o foco
- [x] Bloquear com confirmação (cancelar e falha mantêm o estado); desbloquear direto
- [x] Excluir receita com confirmação que descreve a consequência
- [x] Os nove passos do teste prático completo
- [x] respostas.md com as dez perguntas


