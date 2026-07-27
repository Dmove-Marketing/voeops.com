---
titulo: "Importando seus contatos de uma planilha"
descricao: "Como trazer sua base de contatos para a Voe sem perder informação e sem duplicar."
categoria: primeiros-passos
rotas: ["/contacts", "/settings", "/companies"]
sinonimos: ["importar", "planilha", "csv", "excel", "base de contatos", "migrar contatos"]
ordem: 2
atualizado: 2026-07-20
revisado: true
---

Se você já tem uma base de clientes em planilha, dá para trazer tudo para a Voe
de uma vez.

## Antes de começar

Prepare a planilha com **uma linha por contato** e a primeira linha com o nome
das colunas. O essencial:

| Coluna | Obrigatório | Formato |
|---|---|---|
| Nome | Sim | Texto |
| Telefone | Sim | Com DDD, ex: `11999999999` |
| E-mail | Não | Texto |
| Empresa | Não | Texto |

> **O telefone é a parte crítica.** É por ele que a Voe liga o contato às
> conversas do WhatsApp. Número errado significa contato que nunca casa com a
> conversa.

## Como importar

1. Vá em **Configurações → Importação**
2. Envie o arquivo da planilha
3. **Relacione as colunas**: diga qual coluna da sua planilha corresponde a cada
   campo da Voe
4. Confira a prévia
5. Confirme a importação

## Dicas que evitam retrabalho

- **Teste com poucos primeiro.** Importe 10 linhas, confira o resultado, e só
  então mande a base inteira. Corrigir 10 registros é fácil; 5.000, não.
- **Padronize o telefone antes.** Tire parênteses, traços e espaços na planilha —
  é mais rápido que corrigir depois.
- **Remova duplicados** na planilha antes de subir.
- **Crie os campos personalizados antes** de importar, se sua base tem
  informação que a Voe não tem por padrão. Em **Configurações → Campos
  personalizados**.

## Não funcionou?

- **A importação falhou inteira** — geralmente é formato do arquivo ou a primeira
  linha sem nome de coluna.
- **Contatos vieram sem telefone** — a coluna provavelmente não foi relacionada
  ao campo certo no passo 3.
- **Criou contatos duplicados** — a base já tinha o mesmo número em linhas
  diferentes, ou o número estava escrito em formatos diferentes.
- **Os contatos não casam com as conversas** — quase sempre é o formato do
  telefone. Confira se estão com DDD.

---

Ainda com dúvida? [Fale com o suporte](/suporte)
