# Respostas — Aula 13

## 1. Por que muitos-para-muitos precisa de uma tabela de junção, e por que ela tem dois índices?
Uma lista tem várias receitas e uma receita pode estar em várias listas. Não dá para guardar isso numa coluna só da lista ou da receita, então criei a tabela recipe_list_items, onde cada linha é um par (lista, receita). O índice único (list_id, recipe_id) impede a mesma receita de entrar duas vezes na mesma lista e deixa rápido abrir uma lista e ver se ela tem uma receita. O índice só em recipe_id serve para o caminho contrário: descobrir em quais listas uma receita está, que é o que o modal "Salvar" e a exclusão da receita fazem.

## 2. O que é uma ação idempotente, e por que adicionar duas vezes dá 200 e remover duas vezes dá 404?
Idempotente é quando repetir a ação deixa tudo igual à primeira vez. Adicionar uma receita que já está na lista não muda nada (o contador continua igual), então a API responde 200 dizendo que ela já estava lá, e não 201 porque nada foi criado. Remover é diferente: na segunda vez a receita não está mais lá, e eu não tenho o que apagar, então respondo 404 "Esta receita não está na lista." para quem chamou saber que pediu algo que não existe.

## 3. Por que, mesmo com ON DELETE CASCADE, excluir uma receita deixa o contador das listas errado se o código não descontar?
O CASCADE só apaga as linhas da junção. O recipesCount da lista é um número guardado na própria lista (um dado duplicado, que existe para não precisar contar as linhas toda vez), e o banco não sabe que ele depende da junção. No teste de controle eu comentei o bloco novo do deleteRecipe e excluí uma receita que estava numa lista: a receita sumiu e a linha da junção também, mas no GET /my-lists a lista continuou com o contador antigo, contando uma receita que não existe mais. Com o bloco de volta, o contador cai junto na mesma transação.

## 4. A ordem 400 → 404 → 403, e as duas opções para uma lista privada de outra pessoa.
Primeiro confiro se o id é um número válido (400), porque não adianta procurar algo com id "abc". Depois procuro a lista (404 se não existe). Só depois de achar dá para saber de quem ela é, e aí vem o 403 se não for da pessoa. Para ler uma lista privada de outra pessoa dá para responder 403 (existe, mas você não pode ver) ou 404 (fingir que não existe, para não revelar que ela existe). Eu usei 403, como no roteiro, e a tela mostra "Esta lista é privada."

## 5. Por que %% devolvia tudo, como o escape resolve, e por que conferir req.query.q com typeof?
No LIKE, % quer dizer "qualquer coisa", então buscar %% virava LIKE '%%%%', que bate com todas as receitas. O escapeLike coloca uma barra antes de %, _ e \, e aí o banco procura o caractere de verdade (e não acha nada). O typeof é porque o Express monta o req.query a partir da URL: ?q=ab&q=cd vira um array e ?q[x]=1 vira um objeto, e chamar .trim() nisso quebraria com erro 500. Por isso, se não for texto, eu trato como busca vazia.

## 6. O que muda e o que não muda entre curtir, seguir e marcar lista, e por que o apply devolve a função de desfazer?
O que se repete nos três é o caminho: muda a tela na hora, chama a API, acerta com a resposta e desfaz se der erro. Isso virou o runOptimistic. O que muda é o que cada um mexe na tela (o coração e o número de curtidas, o botão e os seguidores, a caixa e o contador da lista) e qual rota é chamada. O apply devolve o desfazer porque é ele que sabe o valor de antes. Assim o valor antigo fica guardado junto com quem mudou, e o runOptimistic não precisa saber nada de curtida, seguidor ou lista.

## 7. A diferença entre o debounce e o lastCallId na busca.
O debounce evita mandar uma requisição a cada letra: ele espera 400 ms sem digitar para buscar, então uma palavra digitada de uma vez vira uma requisição só. O lastCallId resolve outro problema: mesmo com poucas requisições, uma resposta mais antiga pode chegar depois de uma mais nova, e a tela mostraria o resultado de um termo que eu já apaguei. Com o lastCallId, só a resposta da última busca é usada.

## 8. Por que "Remover da lista" espera a API e a caixa do modal não?
Na caixa do modal, desfazer é fácil e não dá para errar: se a API falhar, a caixa volta e o toast avisa. Já o "Remover da lista" tira o cartão da tela. Se eu tirasse antes e a API falhasse, o cartão teria que voltar do nada, e a pessoa poderia achar que removeu. Então ali eu espero a resposta e só depois tiro o cartão e atualizo o contador com o número que a API devolveu.
