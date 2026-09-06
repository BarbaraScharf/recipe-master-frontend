# RecipeMaster Frontend

Front-end da aplicação **RecipeMaster**, uma plataforma para descobrir, compartilhar e favoritar receitas. Este projeto foi desenvolvido como atividade prática da disciplina de Programação Web, consumindo a API abaixo e seguindo boas práticas de organização em camadas (views, services, stores).

Back-end correspondente: [recipe-master-api](https://github.com/BarbaraScharf/recipe-master-api)

## Tecnologias

- **Vue 3** (Composition API) — biblioteca de interface
- **Vite** — build tool e servidor de desenvolvimento
- **Vue Router** — roteamento e proteção de rotas autenticadas
- **Pinia** — gerenciamento de estado (autenticação)
- **Axios** — cliente HTTP com interceptors de requisição/resposta
- **Bootstrap 5** — estilização base (via CDN)

## Estrutura do projeto

    recipe-master-frontend/
    ├── src/
    │   ├── assets/            # estilos e identidade visual (cor de marca)
    │   ├── components/
    │   │   └── layout/        # Navbar, Sidebar, Footer
    │   ├── router/            # rotas e guarda de autenticação
    │   ├── services/          # api.js (axios), authService, searchService, systemService
    │   ├── stores/            # store de autenticação (Pinia)
    │   ├── views/             # telas da aplicação (auth, admin, profile, lists...)
    │   ├── App.vue
    │   └── main.js
    ├── index.html
    └── package.json

## Como rodar o projeto

### Pré-requisitos
- Node.js 18+ e npm
- [recipe-master-api](https://github.com/BarbaraScharf/recipe-master-api) rodando localmente

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/BarbaraScharf/recipe-master-frontend.git
cd recipe-master-frontend

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com o seguinte conteúdo:
```

```env
VITE_API_URL=http://localhost:3000/api
```

```bash
# 4. Rode o servidor de desenvolvimento
npm run dev
```

A aplicação sobe em `http://localhost:5173`.

## Funcionalidades

- Cadastro e login de usuários com autenticação via JWT
- Sessão persistida em `localStorage`, com logout automático em caso de token inválido ou expirado
- Guarda de rotas: telas que exigem login redirecionam para `/login` preservando a rota de destino (`?redirect=...`)
- Busca global integrada à API
- Estrutura de rotas preparada para: feed, upload de receita, edição, "minhas receitas", perfis público/privado, listas, notificações e um painel administrativo

## Autenticação

O token JWT retornado pela API é armazenado no `localStorage` e anexado automaticamente pelo interceptor de requisição do Axios em toda chamada subsequente, no header `Authorization: Bearer <token>`. Qualquer resposta `401` da API limpa a sessão e redireciona o usuário para a tela de login.

## Licença

Projeto acadêmico, sem fins comerciais.
