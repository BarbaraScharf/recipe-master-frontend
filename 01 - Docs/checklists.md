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
- [x] useAuthStore() chamado dentro do callback do guard, não no topo
- [x] Navbar mostra links diferentes conforme estado de login
- [x] Logout limpa sessão e redireciona ao Login
- [x] Login funcional → redireciona ao feed
- [x] F5 logado → sessão persiste via localStorage
- [x] Logout → rota protegida redireciona ao Login com ?redirect=...
- [x] Login a partir da tela redirecionada → volta à rota original
- [x] Token editado manualmente → redirecionamento automático ao Login
