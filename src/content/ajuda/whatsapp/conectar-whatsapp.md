---
titulo: "Como conectar seu WhatsApp à Voe"
descricao: "Passo a passo para ligar seu número do WhatsApp à Voe e começar a receber conversas no inbox."
categoria: whatsapp
rotas: ["/settings", "/inbox", "/onboarding"]
sinonimos: ["conectar whatsapp", "ligar whatsapp", "adicionar numero", "qr code", "primeira conexao"]
ordem: 1
atualizado: 2026-07-20
revisado: false
---

Conectar seu WhatsApp é o primeiro passo para usar a Voe. Depois disso, todas as
conversas do seu número passam a aparecer no inbox, e sua equipe atende de um
lugar só.

## Antes de começar

- Você precisa ser **administrador** do workspace.
- Decida qual tipo de conexão vai usar. Se ainda não sabe, leia
  [WhatsApp Api Voe ou Api Oficial: qual escolher](/ajuda/whatsapp/api-voe-ou-oficial).

## Onde fica

No menu lateral, vá em **Configurações → Canais**.

Você verá as opções de conexão disponíveis:

| Opção | Quando usar |
|---|---|
| **WhatsApp Api Voe** | Conexão rápida, pelo QR Code do seu celular |
| **WhatsApp Api Oficial** | Conexão oficial da Meta, exige conta de negócios verificada |

## Conectando pela WhatsApp Api Voe

1. Em **Configurações → Canais**, escolha **WhatsApp Api Voe**
2. Clique em **Adicionar canal**
3. Dê um nome ao canal (ex: `Comercial`) e informe o número
4. Um **QR Code** aparece na tela
5. No celular, abra o WhatsApp → **Aparelhos conectados** → **Conectar aparelho**
6. Aponte a câmera para o QR Code da tela

Pronto. Em alguns segundos o status muda para **Conectado**.

> **Dica:** ao criar o canal você pode ativar o **sincronizar histórico**, que
> traz as conversas anteriores do aparelho para o inbox. Isso pode levar alguns
> minutos.

## Conectando pela WhatsApp Api Oficial

Esse caminho exige configuração na Meta e é mais longo, mas entrega um número
oficial, sem risco de bloqueio por uso de aparelho.

Você vai precisar de quatro informações do painel da Meta:

- **Token de Acesso** (permanente)
- **Phone Number ID**
- **App Secret**
- **Verify Token** (você mesmo escolhe um valor aleatório)

1. Em **Configurações → Canais**, escolha **WhatsApp Api Oficial**
2. Preencha os quatro campos acima
3. Clique em **Salvar**
4. No painel da Meta, configure o **webhook** apontando para a Voe, usando o
   mesmo **Verify Token** que você digitou aqui
5. Ainda na Meta, inscreva-se no campo de webhook **`messages`** — sem isso
   nenhuma mensagem chega

> **Atenção:** o token que a Meta mostra por padrão é temporário e expira em
> 24 horas. Para uso real, gere um token permanente a partir de um System User.

## Não funcionou?

- **O QR Code expira antes de eu escanear** — o código tem validade curta.
  Clique em gerar novamente e escaneie em seguida.
- **Conectou e caiu logo depois** — geralmente é o mesmo número já conectado em
  outra ferramenta. Um número só pode estar em um lugar por vez.
- **Salvei a Api Oficial mas nada chega** — quase sempre é o webhook: ou o
  Verify Token está diferente entre a Meta e a Voe, ou o campo `messages` não
  foi marcado.
- **Aparece "desconectado" depois de um tempo** — veja
  [WhatsApp desconectou](/ajuda/whatsapp/whatsapp-desconectou).

---

Ainda com dúvida? [Fale com o suporte](/suporte)
