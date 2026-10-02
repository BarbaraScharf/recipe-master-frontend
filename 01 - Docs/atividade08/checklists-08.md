# Checklists — Aula 08

## Parte A — Backend

- [x] middlewares/optionalAuth.js criado
- [x] viewsCount adicionado ao recipeModel (coluna de visualizações)
- [x] getRecipeById adicionado ao recipeService.js (com include do autor, sem senha, isOwner)
- [x] getFeed adicionado ao userService.js (paginado por page/limit, offset = (page-1)*limit) — feed é visão do usuário logado, por isso está em userModule e não em recipeModule
- [x] getFeed adicionado ao userController.js
- [x] GET /api/feed adicionado ao userRoutes.js (isAuthenticated)
- [x] GET /api/recipes/:id adicionado ao recipeRoutes.js (optionalAuth)
- [x] Streaming: não se aplica (Grupo B — imagem)

## Parte B — Frontend

- [x] getRecipeImageUrl adicionado a utils/media.js
- [x] getRecipeById adicionado a recipeService.js
- [x] getFeed criado em userService.js (espelha decisão do backend)
- [x] RecipeCard.vue criado em components/recipe/
- [x] FeedView.vue construído com grade e "Carregar mais" (LIMIT=3 para demonstrar paginação)
- [x] RecipeDetailView.vue construído com imagem em resolução real (380px, maior que miniatura do card) e isOwner guardado no estado

## Ajustes de consistência aplicados nesta entrega (revisão pós-Aula 06/07)

- [x] } sobrando no main.css removido (quebrava .btn-brand)
- [x] useAuth() corrigido — useRouter() removido do composable, router.push fica na Navbar
- [x] Guarda de rota atualizado para usar useAuth() (composable sem useRouter)
- [x] getFeed movido de recipeModule para userModule no backend e frontend
- [x] MyProfileView usa BaseInput e BaseButton; FormCard não aplicado — layout de perfil é diferente dos formulários de auth (Register/Login)
- [x] Sidebar sem links de placeholders não construídos (Minhas Receitas → Aula 09, Minhas Listas → Aula 13, Notificações → Aula 14)

## Checklist de testes

- [x] Login → Feed → itens reais aparecem (3 por página)
- [x] Botão "Carregar mais" aparece e carrega próxima página
- [x] Clique num card → detalhe sem recarregar
- [x] Grupo B: imagem carrega em resolução real (380px, maior que miniatura do card)
- [x] F5 no detalhe → viewsCount sobe (confirmado via Postman)
- [x] ID inexistente → mensagem de erro sem quebrar a tela
- [x] GET /api/feed sem token → 401
- [x] GET /api/feed?page=1&limit=1 com token → 1 item
- [x] GET /api/feed?page=2&limit=1 com token → próximo item
