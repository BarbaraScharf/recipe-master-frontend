# RecipeMaster Frontend

Front-end da aplicação **RecipeMaster**, uma plataforma para descobrir, compartilhar e favoritar receitas culinárias. Desenvolvido como atividade prática da disciplina de Programação Web, consumindo a API REST abaixo e seguindo boas práticas de organização em camadas (views, services, stores, composables).

Back-end correspondente: [recipe-master-api](https://github.com/BarbaraScharf/recipe-master-api)

## Tecnologias

- **Vue 3** (Composition API) — biblioteca de interface
- **Vite** — build tool e servidor de desenvolvimento
- **Vue Router 4** — roteamento e proteção de rotas autenticadas
- **Pinia** — gerenciamento de estado (autenticação)
- **Axios** — cliente HTTP com interceptors de requisição/resposta
- **Bootstrap 5** + **Bootstrap Icons** — estilização e ícones (via CDN)

## Estrutura do projeto

```
recipe-master-frontend/
├── src/
│   ├── assets/            # estilos globais e cor de marca (#e25822)
│   ├── components/
│   │   ├── base/          # BaseInput, BaseButton, FormCard, BaseModal
│   │   ├── layout/        # TheNavbar, TheSidebar, TheFooter
│   │   └── recipe/        # RecipeCard
│   ├── composables/       # useAuth(), useClickOutside()
│   ├── router/            # rotas e guarda de autenticação
│   ├── services/          # api.js (axios), authService, recipeService, userService, searchService, systemService
│   ├── stores/            # store de autenticação (Pinia + localStorage)
│   ├── utils/             # media.js (URLs de upload)
│   ├── views/             # telas: auth, profile, admin, lists...
│   ├── App.vue
│   └── main.js
├── index.html
└── package.json
```

## Como rodar o projeto

### Pré-requisitos

- Node.js 18+ e npm
- [recipe-master-api](https://github.com/BarbaraScharf/recipe-master-api) rodando localmente
- MySQL rodando com o banco `recipe_master_db` criado

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/BarbaraScharf/recipe-master-frontend.git
cd recipe-master-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz com o conteúdo abaixo:
```

```env
VITE_API_URL=http://localhost:3000/api
VITE_UPLOADS_URL=http://localhost:3000/uploads
```

```bash
# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Funcionalidades implementadas

### Autenticação
- Cadastro e login com autenticação JWT
- Sessão persistida em `localStorage`, logout automático em caso de token inválido (401)
- Guarda de rotas: telas protegidas redirecionam para `/login?redirect=...`

### Perfil
- Edição de perfil: nome, bio e foto de perfil (upload multipart com preview local)
- Perfil público de outros usuários com lista de receitas publicadas
- Menu suspenso no avatar da navbar: Editar Perfil, Ver Perfil, Minhas Receitas, Sair

### Receitas
- Feed paginado com botão "Carregar mais"
- Upload de receita com preview de imagem e barra de progresso
- Detalhe de receita com visualizações, curtidas e autor clicável
- Minhas Receitas: listagem com botões Editar e Excluir (com confirmação em modal)
- Edição de receita: formulário pré-preenchido com troca opcional de imagem
- Botão "Editar" visível apenas para o dono da receita

### Componentes e arquitetura
- Componentes-base reutilizáveis: `BaseInput`, `BaseButton`, `FormCard`, `BaseModal`
- Composables: `useAuth()` e `useClickOutside()`
- `RecipeCard` com slot de ações, autor clicável e sem âncora gigante
- Sidebar condicional: links de funcionalidades protegidas visíveis apenas quando logado
- Busca global integrada à API

## Autenticação

Token JWT armazenado no `localStorage` e anexado automaticamente pelo interceptor do Axios em toda requisição (`Authorization: Bearer <token>`). Qualquer `401` limpa a sessão e redireciona para o login.

## Licença

Projeto acadêmico, sem fins comerciais.
