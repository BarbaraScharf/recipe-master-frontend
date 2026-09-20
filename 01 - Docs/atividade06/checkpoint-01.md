# Checkpoint 01 — Revisão de Consistência dos Módulos da API

**Projeto:** RecipeMaster API  
**Data:** Aula 06

---

## 1. Alguma rota (`*Routes.js`) contém lógica de negócio?

**Não.** Ambos os arquivos de rotas (`searchRoutes.js` e `userRoutes.js`) declaram exclusivamente verbo + caminho + middlewares + referência ao controller, sem nenhuma lógica de negócio embutida.

Exemplos confirmados:
- `router.get('/search', searchController.search)` — só declaração
- `router.post('/register', registerValidator, asyncHandler(userController.register))` — só declaração com middlewares

---

## 2. Algum Controller consulta o Model diretamente?

**Não.** `userController.js` delega tudo para `userService.js`. O `searchController.js` delega para `searchService.js`. Nenhum controller importa o Model diretamente.

---

## 3. Algum Service faz referência a `req` / `res`?

**Não.** `userService.js` e `searchService.js` trabalham exclusivamente com parâmetros primitivos (strings, números, ids) e retornam objetos JavaScript puros. Nenhuma referência a `req` ou `res` existe em nenhum service.

---

## 4. Todo Controller usa `success()` / `error()` de `apiResponse.js`?

**Sim.** `userController.js` importa `success` de `../../middlewares/apiResponse` e a usa em todos os handlers (`register`, `login`, `logout`, `getMyProfile`, `updateProfile`, `getPublicProfile`).

O `searchController.js` também usa `success` de `../../middlewares/apiResponse`.

Nenhum controller usa `res.json()` diretamente.

---

## 5. Toda rota que chama função `async` está envolvida em `asyncHandler`?

**Sim, com uma observação.**

Em `userRoutes.js`, todas as rotas com funções async estão corretamente envolvidas:
- `asyncHandler(userController.register)`
- `asyncHandler(userController.login)`
- `asyncHandler(userController.getMyProfile)`
- `asyncHandler(userController.updateProfile)`
- `asyncHandler(userController.getPublicProfile)`

Em `searchRoutes.js`, o `searchController.search` **não** está envolvido em `asyncHandler`. Isso é seguro hoje porque `searchService.globalSearch` é síncrono, mas será uma pendência quando o módulo de busca for conectado ao banco de dados (previsto para aulas futuras). Esse ponto será corrigido quando o service se tornar assíncrono.

---

## 6. Toda validação de entrada usa `express-validator`?

**Sim.** `userValidator.js` usa exclusivamente cadeias do `express-validator` (`body(...).isLength(...)`, `.isEmail()`, `.notEmpty()`, `.custom(...)`) para os três validators (`registerValidator`, `loginValidator`, `profileUpdateValidator`). Nenhum `if` manual de validação existe em nenhum controller ou service.

---

## 7. `config/constants.js` não tem constante sem uso nem valor de validação fora dela?

**Sim, está consistente.** O arquivo define:

```js
VALIDATION: {
  USERNAME_MIN: 3,
  USERNAME_MAX: 20,
  PASSWORD_MIN: 6,
  BIO_MAX: 255
}
```

Todas as quatro constantes são usadas em `userValidator.js`. Não há valor de validação "solto" em nenhum outro arquivo.

---

## 8. A constante de limite da bio (`BIO_MAX`) é usada exatamente uma vez, no lugar certo?

**Sim.** `BIO_MAX: 255` é definida em `config/constants.js` e usada exatamente uma vez em `userValidator.js`, no `profileUpdateValidator`:

```js
body('bio')
  .optional()
  .isLength({ max: VALIDATION.BIO_MAX })
  .withMessage(`A bio deve ter no máximo ${VALIDATION.BIO_MAX} caracteres.`)
```

O Model (`userModel.js`) define `bio: DataTypes.STRING(255)` mas isso é a definição de tipo do banco, não uma constante de validação — é correto que não use `BIO_MAX` ali, pois esse limite é a coluna do banco, e a validação declarativa em `express-validator` é quem usa a constante.

---

## Resumo

| Item | Status |
|------|--------|
| Rotas sem lógica de negócio | ✅ |
| Controllers não consultam Model diretamente | ✅ |
| Services sem referências a req/res | ✅ |
| Controllers usam success()/error() de apiResponse | ✅ |
| Rotas async envolvidas em asyncHandler | ✅ (pendência conhecida em searchRoutes — segura por ora) |
| Validação exclusivamente via express-validator | ✅ |
| constants.js sem constantes soltas ou sem uso | ✅ |
| BIO_MAX usada exatamente uma vez, no lugar certo | ✅ |

O padrão Route → Controller → Service se manteve firme desde a Aula 01. Nenhuma violação de camadas foi encontrada.
