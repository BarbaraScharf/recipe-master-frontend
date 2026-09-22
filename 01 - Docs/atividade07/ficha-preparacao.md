# Ficha de Preparação — Aula 07

## Dados do projeto

| Dado | Valor |
|------|-------|
| Nome do projeto | RecipeMaster |
| Nome do model (PascalCase) | `Recipe` |
| Nome da tabela (snake_case) | `recipes` |
| Grupo | **B** — um arquivo só (imagem) |
| Nome do campo do arquivo principal | `image` |
| Nome do campo da capa | — (Grupo B, não se aplica) |
| Coluna de contagem no User | `recipesCount` |
| Campos de texto | `title`, `description`, `ingredients`, `instructions`, `category`, `prepTime`, `servings` |
| Constantes de validação adicionadas | `TITLE_MAX: 150`, `DESCRIPTION_MAX: 2000`, `INGREDIENTS_MAX: 3000`, `INSTRUCTIONS_MAX: 5000` |

## Por que Grupo B?

A lista de projetos descreve: *"Upload de novas receitas com imagens"* — um tipo de mídia só.
A imagem enviada representa tanto o conteúdo quanto a identidade visual da receita.
Não existe arquivo "principal" separado de uma "capa", como seria num podcast (áudio + capa) ou num vídeo (vídeo + thumbnail).
