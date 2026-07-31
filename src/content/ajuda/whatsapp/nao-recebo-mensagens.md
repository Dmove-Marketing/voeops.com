---
titulo: "Não estou recebendo mensagens no inbox"
descricao: "Diferente de 'não consegui enviar' — aqui o problema é mensagem que chega no celular mas não aparece na Voe."
categoria: whatsapp
rotas: ["/inbox", "/settings"]
sinonimos: ["nao recebo mensagem", "nao chega no inbox", "conversa nao aparece", "sumiu mensagem", "nao esta chegando"]
ordem: 11
atualizado: 2026-07-29
revisado: true
---

Isso é diferente de "minha mensagem não foi enviada" (quando é você que não
consegue mandar). Aqui o problema é: o cliente te escreveu, e essa mensagem
não aparece no inbox da Voe.

## 1. O canal está desconectado

Se o canal caiu, nada novo chega. Confira o status em
**Configurações → Canais** — veja
[Meu WhatsApp desconectou](/ajuda/whatsapp/whatsapp-desconectou).

## 2. Um filtro está escondendo a conversa

A conversa pode estar chegando normalmente, só que fora do que você está
vendo: um filtro de responsável, canal ou status ativo pode escondê-la, ou
ela pode ter caído em **Não atribuídas** em vez de aparecer para você. Veja
[Como usar os filtros de conversas](/ajuda/whatsapp/filtros-do-inbox) e
confira também se a conversa não foi arquivada.

## 3. WhatsApp Api Oficial: webhook mal configurado

Se você usa a conexão oficial da Meta, o recebimento depende do **webhook**
estar corretamente configurado no painel da Meta, com o campo **`messages`**
inscrito. Sem isso, a Meta simplesmente não avisa a Voe que chegou mensagem —
mesmo que o número esteja "conectado". Veja o passo a passo em
[Como conectar seu WhatsApp à Voe](/ajuda/whatsapp/conectar-whatsapp).

## 4. O número está conectado em outro lugar também

Um número de WhatsApp só entrega mensagens de verdade para um destino por vez.
Se ele estiver conectado em outra ferramenta ao mesmo tempo, a entrega pode ir
para lá em vez de para a Voe.

## Não funcionou?

- **Só algumas conversas não chegam, o resto normal** — confira se não é
  coincidência de filtro (responsável/etiqueta) escondendo justamente essas.
- **Parou de chegar tudo, de repente** — comece pelo status do canal em
  Configurações → Canais.
- **Mensagens antigas (antes de conectar) não aparecem** — isso é esperado,
  veja [Histórico de conversas não apareceu](/ajuda/whatsapp/historico-nao-apareceu) —
  é um caso diferente deste artigo (aqui é sobre mensagens novas).

---

Ainda com dúvida? [Fale com o suporte](/suporte)
