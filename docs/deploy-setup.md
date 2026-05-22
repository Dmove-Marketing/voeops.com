# Deploy Automático — voeops.com

Pipeline: GitHub Actions → rsync → VPS (Nginx, site estático)

---

## Como funciona

```
git push main
      │
      ▼
GitHub Actions Runner (ubuntu-latest)
  ├── npm ci
  ├── npm run build          ← se falhar aqui, para. Site antigo continua no ar.
  └── rsync dist/ → VPS:/var/www/voeops.com/releases/<timestamp_sha>/
                                    │
                                    ▼
                           ln -sfn releases/<novo> current
                           (troca atômica — zero downtime)
                                    │
                                    ▼
                           Nginx serve: /var/www/voeops.com/current/
```

Os últimos 5 releases ficam disponíveis para rollback manual.

---

## Passo 1 — Gerar o par de chaves SSH de deploy

Execute isso **na sua máquina local** (não na VPS):

```bash
ssh-keygen -t ed25519 -C "github-actions-voeops" -f ~/.ssh/voeops_deploy_key -N ""
```

Isso gera dois arquivos:
- `~/.ssh/voeops_deploy_key` → **chave privada** (vai para o GitHub Secret)
- `~/.ssh/voeops_deploy_key.pub` → **chave pública** (vai para a VPS)

> Nunca compartilhe a chave privada. Ela será usada apenas no GitHub Secrets.

---

## Passo 2 — Adicionar a chave pública na VPS

Conecte na VPS com seu usuário atual e execute:

```bash
# Crie o usuário de deploy (se ainda não existe)
sudo useradd --system --shell /bin/bash --create-home deploy

# Autorize a chave pública
sudo mkdir -p /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Cole o conteúdo de ~/.ssh/voeops_deploy_key.pub:
echo "ssh-ed25519 AAAA...sua-chave-publica... github-actions-voeops" \
  | sudo tee -a /home/deploy/.ssh/authorized_keys

sudo chmod 600 /home/deploy/.ssh/authorized_keys
sudo chown -R deploy:deploy /home/deploy/.ssh
```

Teste a conexão localmente antes de continuar:

```bash
ssh -i ~/.ssh/voeops_deploy_key deploy@SEU_IP_DA_VPS -p 22 "echo conexão ok"
```

---

## Passo 3 — Cadastrar os GitHub Secrets

Acesse: **GitHub → seu repositório → Settings → Secrets and variables → Actions → New repository secret**

| Nome do Secret | Valor | Exemplo |
|---|---|---|
| `VPS_HOST` | IP ou hostname da VPS | `203.0.113.42` |
| `VPS_USER` | Usuário SSH criado no Passo 2 | `deploy` |
| `VPS_SSH_KEY` | Conteúdo **completo** da chave privada | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `VPS_PORT` | Porta SSH da VPS | `22` |
| `VPS_PATH` | Caminho base na VPS | `/var/www/voeops.com` |

### Como copiar a chave privada corretamente

```bash
# macOS / Linux
cat ~/.ssh/voeops_deploy_key | pbcopy   # macOS
cat ~/.ssh/voeops_deploy_key            # Linux — copie o output inteiro
```

Cole o conteúdo inteiro no campo do Secret, incluindo as linhas:
```
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

---

## Passo 4 — Preparar a VPS (primeira vez)

Conecte na VPS como root ou sudo e execute o script de setup:

```bash
# Opção A: enviar e rodar o script
scp scripts/vps-setup.sh deploy@SEU_IP:/tmp/
ssh deploy@SEU_IP "sudo bash /tmp/vps-setup.sh"

# Opção B: rodar manualmente os comandos essenciais
sudo mkdir -p /var/www/voeops.com/releases
sudo chown -R deploy:deploy /var/www/voeops.com
sudo chmod 755 /var/www/voeops.com /var/www/voeops.com/releases
```

### Configuração mínima do Nginx

Se você já tem um `nginx.conf` ou arquivo em `sites-available`, garanta que o `root` aponte para o **symlink** `current`:

```nginx
server {
    listen 80;
    server_name voeops.com www.voeops.com;

    root /var/www/voeops.com/current;   # ← aponta para o symlink
    index index.html;

    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location / {
        try_files $uri $uri/ $uri.html /index.html;
    }
}
```

Após editar:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

> O arquivo `docs/nginx-cache.conf` tem os blocos de cache completos para copiar.

---

## Passo 5 — Disparar o primeiro deploy manualmente

```bash
# Via GitHub CLI (recomendado para testar antes do primeiro push)
gh workflow run deploy.yml

# Acompanhar em tempo real
gh run watch

# Ou ver no painel:
# https://github.com/SEU_USUARIO/SEU_REPO/actions
```

---

## Rollback manual

Para voltar para um release anterior:

```bash
# Listar releases disponíveis (mais recente primeiro)
ls -lt /var/www/voeops.com/releases/

# Ativar um release anterior (substitua <release_id> pelo nome desejado)
ln -sfn /var/www/voeops.com/releases/<release_id> /var/www/voeops.com/current

# Confirmar
readlink -f /var/www/voeops.com/current
```

---

## Verificação pós-deploy

```bash
# Ver o link ativo
ssh deploy@SEU_IP "readlink -f /var/www/voeops.com/current"

# Ver os 5 releases guardados
ssh deploy@SEU_IP "ls -lt /var/www/voeops.com/releases/"

# Ver o último deploy no Actions
gh run list --workflow=deploy.yml --limit=5
```
