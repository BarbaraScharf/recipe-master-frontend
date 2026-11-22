# Respostas — Aula 14

## 1. Por que a notificação é criada dentro da mesma transação, e o que acontece se eu esquecer de repassar a transação?
A notificação faz parte da ação: se a curtida não for salva, o aviso não pode existir, e se o aviso falhar, a curtida também volta atrás. Por isso o createNotification recebe o t e grava junto. Se eu esquecer o t, a notificação vai por fora da transação e fica esperando a transação aberta liberar a receita, que só termina depois dela. Uma espera pela outra, a requisição trava e, uns 50 segundos depois, responde 500 com "Lock wait timeout exceeded".

## 2. As regras de uma notificação verdadeira.
Ninguém precisa ser avisado do que ele mesmo fez, então o createNotification não faz nada quando quem recebe é a mesma pessoa que agiu (o dono curtindo ou comentando a própria receita). Descurtir apaga o aviso porque a curtida deixou de existir, e o dono veria um aviso falso. Com deixar de seguir é igual. Comentar não tem desfazer porque a API não tem rota para excluir comentário: o comentário continua lá, então o aviso também continua.

## 3. Por que existe a rota unread-count separada, e o que cada índice acelera?
O sino pergunta a cada 30 segundos. Se ele pedisse a lista inteira, viriam os avisos com usuário e receita, só para mostrar um número. O unread-count devolve só { unreadCount }, que é um COUNT rápido. O índice (user_id, is_read) acelera exatamente isso: "as minhas não lidas" e também "as minhas", que é a lista. O índice em recipe_id serve para apagar os avisos de uma receita quando ela é excluída, sem ler a tabela toda.

## 4. Por que denunciar de novo responde 409, e o que garante isso com dois cliques ao mesmo tempo?
Adicionar uma receita que já está na lista não muda nada e o resultado é o mesmo, então lá o 200 faz sentido. Já uma segunda denúncia é um pedido que não pode ser atendido: a pessoa já denunciou, e a denúncia não vai mudar. Por isso é 409 (conflito), com a mensagem "Você já denunciou esta receita." Quem garante é o índice único (user_id, recipe_id) no banco. Mesmo que dois cliques cheguem juntos e os dois passem pelo findOrCreate, o banco só aceita uma linha, e o segundo erro também vira 409.

## 5. As duas defesas do motivo, e por que o banco guarda chaves e a tela mostra rótulos.
A primeira defesa é o validator, que só deixa passar as cinco chaves e responde 400 "Escolha um motivo válido para a denúncia." A segunda é o ENUM da coluna reason: mesmo que alguém grave direto no banco, um valor de fora dá "Data truncated for column 'reason'". O banco guarda a chave (spam, harassment...) porque ela não muda. O rótulo ("Spam ou golpes") é só texto da tela e pode mudar sem mexer nos dados. Por isso mandar o rótulo para a API também dá 400.

## 6. Os três comportamentos de chave estrangeira ao excluir, e o que eu vi no teste de controle.
CASCADE apaga junto as linhas filhas (é o caso das listas, na Aula 13). NO ACTION não deixa apagar o pai enquanto houver filhas: é a chave de reports. SET NULL apaga o pai e deixa as filhas com a coluna vazia: é a chave de notifications. No teste de controle, sem o destroy das denúncias, excluir uma receita denunciada deu 500 com a mensagem da chave estrangeira de reports ("Cannot delete or update a parent row: a foreign key constraint fails"). Sem o destroy das notificações, a exclusão deu 200, mas sobrou no banco um aviso de curtida com recipe_id NULL, apontando para nada. Por isso o deleteRecipe apaga as duas antes da receita.

## 7. Como o polling se mantém correto.
30 segundos é um meio-termo: o número parece atualizado sem a API receber uma pergunta por segundo de cada pessoa logada. Quem liga é a Navbar, quando a pessoa entra na conta (o watch no isAuthenticated), e quem desliga é a mesma Navbar, ao sair da conta. O if (timerId !== null) impede um segundo temporizador se o startPolling for chamado de novo (vários logins, a Navbar montando outra vez). Sem ele, cada login somaria mais uma pergunta a cada 30 s. Com a aba escondida ninguém está vendo o sino, então o refreshIfVisible não pergunta. Quando a pessoa volta, o visibilitychange pergunta na hora.

## 8. A corrida do contador.
O polling pergunta "quantas não lidas?" e a resposta demora. Nesse meio-tempo eu marco uma como lida e o sino desce de 3 para 2. Aí chega a resposta velha, que ainda dizia 3, e o sino volta para 3, errado. O refresh já ignora respostas que não são a última (lastRefreshId). O setUnreadCount também sobe o lastRefreshId: quando a tela muda o número, qualquer pergunta que ainda estava no caminho deixa de ser a última e é descartada.

## 9. O quarto caso do runOptimistic.
O que não muda é o runOptimistic em si (utils/optimistic.js ficou igual): apply muda na hora e devolve o desfazer, request chama a API, confirm acerta com a resposta, e o erro desfaz. O que muda é o que cada caso mexe: aqui, a linha (isRead) e o sino, com o confirm usando o unreadCount que a API devolveu. O desfazer do sino é relativo (+1) porque pode haver mais de uma linha marcada ao mesmo tempo. Se duas falharem, cada uma devolve o seu 1 e o sino volta ao número do começo. Se cada uma voltasse "ao número que viu", a segunda poria um número que já não vale.

## 10. Por que um 400 do logout aparecia como erro de CORS.
O logout mandava null como corpo. O Axios enviava o texto "null" com Content-Type JSON, e o express.json() recusava com 400. Como o cors vinha depois dos parsers no app.js, a resposta de erro saía sem o cabeçalho Access-Control-Allow-Origin, e o navegador, sem esse cabeçalho, mostrava "erro de CORS" no lugar do 400. Corrigi as duas coisas: o cors agora vem antes do express.json() (o 400 sai com o cabeçalho, como vi no curl), e o logout manda undefined, então nem há corpo para recusar.
