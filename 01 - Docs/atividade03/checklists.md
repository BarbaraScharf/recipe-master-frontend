# Checklists — Aula 03

## Parte A — Backend

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

---

## Parte B — Frontend

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
