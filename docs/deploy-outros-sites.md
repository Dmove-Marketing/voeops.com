# Deploy Automático — Guia de Replicação para Outros Sites

Este documento descreve o que foi configurado no voeops.com e como replicar
o mesmo processo para os outros sites da VPS.

---

## O que foi feito no voeops.com

### 1. Par de chaves SSH
Um par de chaves ed25519 foi gerado. A chave pública foi adicionada em:
```
/home/deploy/.ssh/authorized_keys
```
A chave privada foi cadastrada no GitHub como secret `VPS_SSH_KEY`.

### 2. Estrutura de pastas na VPS
Os arquivos que ficavam direto em `/var/www/voeops.com/` foram reorganizados:
```
/var/www/voeops.com/
├── current -> releases/inicial/   ← symlink que o Nginx lê
└── releases/
    ├── inicial/                   ← release de partida
    └── 20260522_185423_abc1234/   ← cada deploy cria uma pasta assim
```
Cada `git push` cria uma nova pasta em `releases/` e troca o symlink `current`
de forma atômica (zero downtime). Os 5 releases mais recentes ficam guardados
para rollback manual.

### 3. Nginx atualizado
A linha `root` no arquivo `/etc/nginx/sites-available/voeops.com` foi alterada de:
```nginx
root /var/www/voeops.com;
```
para:
```nginx
root /var/www/voeops.com/current;
```

### 4. GitHub Secrets cadastrados
No repositório voeops.com foram cadastrados:
| Secret | Valor |
|--------|-------|
| `VPS_HOST` | IP da VPS |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | chave privada ed25519 completa |
| `VPS_PORT` | `22` |
| `VPS_PATH` | `/var/www/voeops.com` |

### 5. Workflow `.github/workflows/deploy.yml`
Roda automaticamente a cada `git push` na branch `main`.
Fluxo: build Astro → rsync dist/ para novo release → troca symlink → remove releases antigas.

---

## Como replicar nos outros sites

> A chave SSH já está na VPS. Não precisa gerar uma nova — use a mesma chave privada
> que foi cadastrada no voeops.com.

### Passo 1 — Copiar o workflow para o repositório do site

No repositório do outro site, crie o arquivo `.github/workflows/deploy.yml`
com o mesmo conteúdo do voeops.com. Ele é idêntico para todos os sites.

Você pode copiar direto do repositório voeops.com:
```
.github/workflows/deploy.yml
```

### Passo 2 — Cadastrar os Secrets no GitHub do outro repositório

Acesse: **GitHub → repositório do site → Settings → Secrets and variables → Actions**

Cadastre os mesmos 5 secrets. Apenas `VPS_PATH` muda:

| Site | VPS_PATH |
|------|----------|
| eventos.dmove.com.br | `/var/www/eventos.dmove.com.br` |
| eventos.casavoss.com.br | `/var/www/eventos.casavoss.com.br` |
| eventos.agapeconvention.com.br | `/var/www/eventos.agapeconvention.com.br` |
| eventos.pockethouse.com.br | `/var/www/eventos.pockethouse.com.br` |
| lp.espacofiteventos.com.br | `/var/www/lp.espacofiteventos.com.br` |

Os outros 4 secrets (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`, `VPS_PORT`) são
**idênticos** para todos os sites.

### Passo 3 — Preparar a estrutura de pastas na VPS

Conecte na VPS como root e execute para cada site (substitua `DOMINIO`):

```bash
DOMINIO="eventos.casavoss.com.br"
BASE="/var/www/$DOMINIO"

# Criar estrutura
mkdir -p "$BASE/releases/inicial"

# Mover arquivos atuais para o release inicial
find "$BASE/" -maxdepth 1 -mindepth 1 ! -name 'releases' -exec mv {} "$BASE/releases/inicial/" \;

# Criar symlink
ln -sfn "$BASE/releases/inicial" "$BASE/current"

# Permissões
chown -R deploy:deploy "$BASE/releases"
chmod 755 "$BASE"
chmod 755 "$BASE/releases"

# Confirmar
ls -la "$BASE/"
readlink -f "$BASE/current"
```

### Passo 4 — Atualizar o Nginx do site

No arquivo `/etc/nginx/sites-available/<dominio>`, troque a linha `root`:

```bash
# Substitua DOMINIO pelo nome do site
DOMINIO="eventos.casavoss.com.br"
sed -i "s|root /var/www/$DOMINIO;|root /var/www/$DOMINIO/current;|" /etc/nginx/sites-available/$DOMINIO

# Testar e recarregar
nginx -t && systemctl reload nginx
```

### Passo 5 — Disparar o primeiro deploy

Faça qualquer `git push` na branch `main` do repositório do site, ou dispare
manualmente pelo painel do GitHub:

**GitHub → repositório → Actions → Deploy → Run workflow**

---

## Rollback manual (qualquer site)

```bash
# Listar releases disponíveis
ls -lt /var/www/<dominio>/releases/

# Ativar um release anterior
ln -sfn /var/www/<dominio>/releases/<release_id> /var/www/<dominio>/current

# Confirmar
readlink -f /var/www/<dominio>/current
```

---

## Resumo visual

```
Repositório A (voeops.com)          push → deploy só em /var/www/voeops.com/
Repositório B (eventos.casavoss)    push → deploy só em /var/www/eventos.casavoss.com.br/
Repositório C (eventos.dmove)       push → deploy só em /var/www/eventos.dmove.com.br/

                  ↕ mesma VPS, mesma chave SSH, pastas completamente isoladas
```

Cada site é independente. Um deploy nunca interfere nos outros.
