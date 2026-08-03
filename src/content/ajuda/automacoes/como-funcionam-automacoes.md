---
titulo: "Como utilizar automações"
descricao: "Monte fluxos de gatilho → condição → ação para automatizar respostas, tags e movimentação do funil."
categoria: automacoes
rotas: ["/automations"]
sinonimos: ["automacao", "workflow", "fluxo automatico", "gatilho", "trigger", "acao automatica"]
ordem: 1
atualizado: 2026-07-29
revisado: true
---

Automações são fluxos visuais: algo acontece (**gatilho**), a Voe confere uma
condição, se fizer sentido, e executa uma ou mais **ações** — sem intervenção
manual.

## Onde ficam

Menu lateral → **Automações**. A tela lista os fluxos (workflows) já criados.
Clique em **Novo workflow** para começar um do zero, ou abra um existente para
editar.

## Como montar um fluxo

1. Escolha o **gatilho** — o que vai disparar o fluxo. Alguns exemplos:
   mensagem recebida, palavra-chave específica, contato criado, tag
   adicionada, oportunidade mudou de etapa, atividade concluída
2. Arraste **ações** para depois do gatilho — por exemplo: enviar uma mensagem
   de WhatsApp, adicionar uma tag, mover a oportunidade de etapa, criar uma
   atividade, notificar alguém do time
3. Se precisar de lógica condicional, use um bloco de **Condição** (se/então),
   um **Aguardar** (espera um tempo antes de continuar) ou uma checagem de
   **horário comercial**
4. Conecte os blocos arrastando entre eles e salve

## Exemplos comuns

- **Mensagem de boas-vindas automática** — gatilho "primeira mensagem" → ação
  "enviar texto"
- **Distribuir por palavra-chave** — gatilho "palavra-chave" → ação "mover
  etapa" ou "atribuir responsável"
- **Cobrar lead parado** — gatilho de tempo/inatividade → ação "enviar
  mensagem" ou "criar atividade"

## Não funcionou?

- **O fluxo não disparou** — confira se o workflow está ativo (não só salvo) e
  se o gatilho escolhido realmente aconteceu do jeito esperado (ex: a palavra-
  chave precisa bater exatamente com a configurada).
- **A ação errada foi executada** — revise a ordem dos blocos; condições
  avaliadas fora de ordem costumam ser a causa.
- **Quero automatizar o atendimento por IA, não só regras** — isso é o agente
  de IA, não automações — veja
  [Configurando o agente de IA para atender](/ajuda/agentes/configurar-agente-sdr).

---

Ainda com dúvida? [Fale com o suporte](/suporte)
