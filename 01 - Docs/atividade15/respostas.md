# Respostas — Aula 15

## 1. Autenticação e autorização: quando é 401 e quando é 403?
Autenticação é saber quem é a pessoa; autorização é saber se ela pode fazer aquilo. O 401 é quando a API não sabe quem está pedindo: sem token, token inválido, conta apagada ou bloqueada. O 403 é quando ela sabe quem é, mas a pessoa não tem permissão. Na Aula 09, tentar excluir a receita de outra pessoa dava 403 porque eu não era a dona. Hoje, um usuário comum chamando /api/admin/dashboard recebe 403 porque não tem o papel de administrador.

## 2. Por que o isAuthenticated passou a consultar o banco?
Antes ele confiava no que estava dentro do token, e o token vale 7 dias. Sem a consulta, um usuário bloqueado continuaria usando a conta até o token vencer, um administrador rebaixado continuaria entrando no painel (o token ainda dizia isAdmin: true), e uma conta apagada continuaria funcionando. Consultando o banco a cada requisição, a mudança vale na hora. O custo é uma consulta a mais em toda rota autenticada, mas ela é pela chave primária, então é rápida. As outras duas saídas seriam deixar o token durar pouco (e renovar com frequência) ou guardar uma lista de tokens revogados.

## 3. Como se vira administrador?
Pelo script scripts/setAdmin.js, rodado no terminal do servidor: node scripts/setAdmin.js admin promove, e com "off" no final rebaixa. Não existe rota para isso porque qualquer rota pode ser chamada por qualquer pessoa: se existisse um "virar admin" na API, alguém acabaria achando um jeito de usar. Quem decide quem é administrador é quem tem acesso ao servidor e ao banco.

## 4. Por que a guarda é uma linha no router.use, e por que o isAdmin vem depois do isAuthenticated?
Com o router.use('/admin', isAuthenticated, isAdmin), todas as rotas do painel ficam protegidas de uma vez, inclusive as que eu criar depois e até uma rota que não existe (ela responde 401 ou 403, e não 404). Colocando um isAdmin em cada rota, bastaria esquecer um para abrir um buraco. A ordem importa porque o isAdmin olha o req.user, e quem monta o req.user é o isAuthenticated. Invertendo, o isAdmin não acha ninguém e todo mundo leva 403, até o administrador.

## 5. Como a coluna status entrou numa tabela que já tinha linhas?
A tabela reports já tinha 4 denúncias. Uma coluna NOT NULL nova precisa de um valor para essas linhas, e é o defaultValue: 'pending' que dá esse valor: o sync({ alter: true }) acrescentou a coluna e todas as denúncias antigas ficaram pendentes. Sem o padrão, o banco recusaria a alteração. Revisar é idempotente porque, se a denúncia já está revisada, o service não escreve de novo, então o reviewedAt continua o da primeira vez. O reload() serve para devolver o que o banco gravou, e não o que estava na memória: o banco guarda a data só até os segundos, e o reload garante que a resposta mostre a mesma data que a lista vai mostrar.

## 6. As duas checagens do bloqueio.
No login, o bloqueado recebe 403: a API sabe quem é (a senha estava certa), mas não deixa entrar. Nas outras rotas, o isAuthenticated responde 401 porque o token deixa de valer: a pessoa precisa sair da conta. A checagem do login vem depois da senha para não revelar nada: se viesse antes, qualquer um digitando um e-mail descobriria que aquela conta existe e está bloqueada. O bloqueio não apaga a conta nem as receitas: o perfil público e as receitas continuam no site. Ele só impede a pessoa de entrar e de agir.

## 7. Por que o escapeLike foi extraído agora, e como vem a contagem de denúncias?
Porque hoje ele passou a ter dois usos: a busca pública e a busca do painel. Copiar a função seria criar duas versões que podem ficar diferentes, e a regra dos três não vale para algo de segurança, em que um erro deixa o %% devolver tudo. A contagem de denúncias pendentes vem de uma segunda consulta: primeiro busco a página de receitas, depois faço um COUNT agrupado só com os ids dessa página e junto os dois com um Map. Assim a consulta principal continua simples e paginada certinho.

## 8. O que vi nos dois testes de controle.
No primeiro, comentei o if (user.isBlocked) do isAuthenticated, bloqueei a barbara e usei o token antigo dela: a rota respondeu 200, como se nada tivesse acontecido. Isso prova que, sem a checagem, o bloqueio só valeria no próximo login. No segundo, tirei o isAdmin do router.use e chamei o dashboard com o token do teste123, que é um usuário comum: veio 200 com todos os números do sistema. Isso prova que é essa linha que protege o painel, e não o front. Desfiz os dois e voltou a dar 401 e 403.

## 9. O que a guarda de rota do front protege e o que não protege.
A guarda do front só evita que um usuário comum veja um painel vazio e cheio de erro: ela manda para o Feed com um aviso. Ela não protege os dados. No experimento, como usuário comum, troquei o "isAdmin": false por true no auth_user do localStorage e apertei F5: a seção Administração apareceu e o painel abriu, mas cada tela mostrou "Acesso restrito a administradores." e a aba Network mostrou 403 em todas as chamadas. Quem protege é a API, que confere o papel no banco.

## 10. Por que as ações do administrador esperam o servidor, e o que é o "pulo" da paginação.
Bloquear uma pessoa ou excluir uma receita tem consequência séria e não dá para "desfazer na tela" se a API recusar. Por isso o selo e a linha só mudam com a resposta do servidor, e enquanto isso o botão fica travado (o de revisar mostra "Salvando..."). O pulo acontece porque a paginação por offset pede "a partir do item N". Com PAGE_SIZE = 2, carreguei a primeira página e revisei uma denúncia, que saiu da lista de pendentes. No "Carregar mais", a API pulou 2 itens de uma lista que agora tinha um a menos, e a denúncia 20 nunca apareceu. O "Atualizar" a trouxe de volta. O conserto é paginar por cursor, que fica para a Aula 18.
