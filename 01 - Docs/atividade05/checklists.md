# Checklists — Aula 05

## Parte A — Backend

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

## Parte B — Frontend

- [x] Link Meu Perfil visível na Navbar quando logado
- [x] .env atualizado com VITE_UPLOADS_URL
- [x] src/utils/media.js criado com getProfilePictureUrl
- [x] updateProfile(formData) criado no authService.js com Content-Type multipart/form-data
- [x] Tela carrega dados reais do usuário ao montar
- [x] Selecionar foto atualiza prévia sem chamada de rede
- [x] Salvar funciona com e sem trocar foto
