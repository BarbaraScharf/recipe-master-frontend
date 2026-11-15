# Respostas — Aula 12

## 1. Por que o useAsyncData recebe () => minhaChamada() e não minhaChamada()?
Se eu escrevo minhaChamada(), a requisição já sai na hora e o composable só recebe o resultado. Ele não tem como chamar de novo depois. Com () => minhaChamada() eu passo a função em si, e o useAsyncData escolhe quando rodar: quando a tela abre e toda vez que o parâmetro da rota muda. Assim ele sempre pega o id ou o username atual da rota.

## 2. O que é a corrida entre respostas e como o lastCallId evita isso?
Acontece quando saem duas requisições seguidas e a primeira demora mais e chega depois da segunda. Por exemplo, eu abro um perfil e logo troco para outro: se a resposta do primeiro chegar por último, a tela fica mostrando a pessoa errada. No useAsyncData cada chamada ganha um número (lastCallId). Quando a resposta chega, eu vejo se o número dela ainda é o último. Se não for, eu ignoro.

## 3. Quem avisa o usuário quando uma ação, uma leitura ou um formulário falha?
Quando uma ação falha (curtir, seguir, excluir), quem avisa é o interceptor do Axios, com um toast. Quando é uma leitura, a própria tela mostra o erro no lugar do conteúdo, porque se fosse um toast ele sumiria e a tela ficaria vazia sem explicação. No formulário o erro aparece no próprio formulário, por isso marquei silent: true nos services de login, cadastro, editar perfil, criar e editar receita. Se todo erro virasse toast, no login com senha errada a mensagem ia aparecer duas vezes. O 401 não mostra toast, só manda para o login.

## 4. Por que a lista de toasts fica fora da função useToast()?
Se a lista ficasse dentro da função, cada lugar que chamasse useToast() ia ter uma lista própria, e o ToastContainer não ia ver os toasts criados pelo api.js ou pelas telas. Deixando fora, a lista é criada uma vez só e todo mundo usa a mesma. Para isso eu não precisei de uma store do Pinia, que daria mais trabalho sem trazer nada a mais, e o api.js (que não é um componente) consegue chamar o toast direto.

## 5. Por que ?limit=-3 era um problema, por que Number.parseInt('abc') >= 1 dá false e por que existe um teto?
Antes o limit ia direto para o banco. Com limit=-3 o MySQL recebia LIMIT -3 e a API dava erro 500, mostrando um pedaço do SQL na mensagem. Com page=-2 também dava 500, e com limit=100000 ela devolvia tudo. Number.parseInt('abc') dá NaN, e NaN >= 1 é false, então a mesma condição que barra número negativo e zero também barra texto, e ele cai no padrão. Usei >= 1 e não > 1 porque senão limit=1 não ia funcionar. O teto de 50 é para ninguém pedir milhares de receitas de uma vez e pesar o banco.

## 6. Por que o miolo da atualização otimista não foi extraído hoje, e o que é a regra dos três?
A regra dos três diz que só vale criar uma função comum quando o mesmo código aparece três vezes. Eu tenho só dois botões, curtir e seguir, e eles mudam coisas diferentes. Se eu juntasse agora, ia estar chutando como seria um terceiro botão. O que era igual nos dois (mandar o visitante para o login e travar o botão enquanto espera) eu tirei para o useAuthenticatedAction.

## 7. O que pode dar errado quando o Service grava o registro e o contador sem transação?
Se a receita for salva e a atualização do recipesCount falhar no meio (erro no banco, servidor caindo), o contador do perfil fica errado e ninguém percebe. Com a transação, as duas coisas são salvas juntas, e se uma falhar a outra é desfeita.
