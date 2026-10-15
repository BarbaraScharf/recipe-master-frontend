# Respostas — Atividade 10

## 1. Por que o índice único composto deve estar no banco e não só no código

Colocar a restrição "uma pessoa só curte uma vez" apenas no service (código) não é suficiente porque qualquer chamada direta à API — via Postman, curl ou um script malicioso — pularia o service e iria direto ao banco. O índice único composto no banco (`userId + recipeId`) garante que a restrição seja aplicada independentemente de quem fez a chamada, mesmo em cenários de concorrência (duas requisições simultâneas do mesmo usuário também seriam barradas pelo banco).

## 2. Contador guardado vs. calculado, e como a transação elimina o risco

Contador guardado (`likesCount` salvo como coluna na tabela) é mais rápido de ler — não precisa de um `COUNT(*)` a cada consulta. O risco é a inconsistência: se a linha do like é criada mas o contador não é incrementado (por um erro no meio), o número fica errado sem dar erro visível. A transação elimina esse risco: ou os dois comandos (criar o like + incrementar o contador) acontecem juntos, ou nenhum acontece — o rollback garante isso.

## 3. O que acontece se esquecer `{ transaction: t }` num comando

O comando esquecido roda fora da transação, em autocommit. Isso significa que, se um erro ocorrer depois dele, o `t.rollback()` não o desfaz — ele já foi persistido. O resultado é exatamente o problema do item 2: dados inconsistentes (like criado sem contador incrementado, ou vice-versa).

## 4. Atualização otimista — três passos e quando não usar

Os três passos são:
1. Atualizar a UI imediatamente (antes da resposta da API)
2. Chamar a API em segundo plano
3. Se a API falhar, desfazer (rollback) a mudança visual e mostrar o erro

Quando **não usar**: ações destrutivas (excluir receita, cancelar pagamento), ações que não são facilmente reversíveis na interface, ou quando a resposta da API contém dados que a UI não consegue calcular com antecedência.

## 5. Por que usar `{{ }}` e nunca `v-html` para texto de comentário

O `v-html` interpreta o conteúdo como HTML e executa qualquer código dentro dele. Um comentário com `<script>alert(1)</script>` ou `<img src=x onerror="roubarSenha()">` seria executado pelo navegador. O `{{ }}` (interpolação) escapa automaticamente todos os caracteres HTML, exibindo o texto como texto puro — `<b>` aparece como o texto `<b>`, não como negrito.

## 6. Por que `.trim()` precisa vir antes de `.notEmpty()`

O `.notEmpty()` verifica se o campo tem pelo menos um caractere. Um campo preenchido só com espaços (`"   "`) passa por `.notEmpty()` porque tem caracteres. Se `.trim()` vier depois, o espaço já foi aceito. Com `.trim()` primeiro, os espaços são removidos antes da verificação — aí `"   "` vira `""` e `.notEmpty()` recusa corretamente.
