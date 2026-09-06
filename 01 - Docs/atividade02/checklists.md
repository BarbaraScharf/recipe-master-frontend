# Checklists — Aula 02

## Parte A — Backend

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

---

## Parte B — Frontend

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
