#!/usr/bin/env bash
# =============================================================================
# vps-setup.sh — Setup inicial da VPS para deploy automático de voeops.com
#
# Execute UMA ÚNICA VEZ diretamente na VPS como root ou com sudo:
#   bash vps-setup.sh
#
# O que este script faz:
#   1. Cria o usuário de deploy com permissões mínimas
#   2. Cria a estrutura de diretórios esperada pelo workflow
#   3. Faz um primeiro deploy manual (popula o release inicial)
#   4. Atualiza o Nginx para apontar para o symlink 'current'
# =============================================================================

set -euo pipefail

# ── Configuração — ajuste conforme sua VPS ────────────────────────────────────
DEPLOY_USER="deploy"
BASE_PATH="/var/www/voeops.com"
NGINX_CONF="/etc/nginx/sites-available/voeops.com"
DOMAIN="voeops.com"
# ─────────────────────────────────────────────────────────────────────────────

echo "=== [1/5] Criando usuário de deploy ==================================="

if id "$DEPLOY_USER" &>/dev/null; then
  echo "Usuário '$DEPLOY_USER' já existe. Pulando."
else
  useradd --system --shell /bin/bash --create-home "$DEPLOY_USER"
  echo "Usuário '$DEPLOY_USER' criado."
fi

# Cria o diretório .ssh para a chave de deploy
mkdir -p "/home/$DEPLOY_USER/.ssh"
chmod 700 "/home/$DEPLOY_USER/.ssh"
touch "/home/$DEPLOY_USER/.ssh/authorized_keys"
chmod 600 "/home/$DEPLOY_USER/.ssh/authorized_keys"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "/home/$DEPLOY_USER/.ssh"

echo ""
echo ">>> AÇÃO NECESSÁRIA: cole a chave pública gerada localmente abaixo:"
echo "    (conteúdo do arquivo voeops_deploy_key.pub)"
echo "    Pressione Enter duas vezes ao terminar."
echo ""

PUB_KEY=""
while IFS= read -r line; do
  [[ -z "$line" ]] && break
  PUB_KEY+="$line"$'\n'
done

if [[ -n "$PUB_KEY" ]]; then
  echo "$PUB_KEY" >> "/home/$DEPLOY_USER/.ssh/authorized_keys"
  echo "Chave pública adicionada."
else
  echo "AVISO: nenhuma chave pública foi fornecida. Adicione manualmente em:"
  echo "  /home/$DEPLOY_USER/.ssh/authorized_keys"
fi

echo ""
echo "=== [2/5] Criando estrutura de diretórios =============================="

mkdir -p "$BASE_PATH/releases"
chown -R "$DEPLOY_USER:$DEPLOY_USER" "$BASE_PATH"

# O Nginx precisa atravessar o diretório — www-data precisa de execute
chmod 755 "$BASE_PATH"
chmod 755 "$BASE_PATH/releases"

echo "Estrutura criada em $BASE_PATH"
echo ""
echo "Estrutura esperada:"
echo "  $BASE_PATH/"
echo "  ├── current -> releases/<timestamp_sha>/   (criado pelo primeiro deploy)"
echo "  └── releases/"
echo "      └── <timestamp_sha>/"
echo "          ├── index.html"
echo "          └── _astro/"

echo ""
echo "=== [3/5] Configurando Nginx ==========================================="

if [ ! -f "$NGINX_CONF" ]; then
  echo "Criando configuração do Nginx em $NGINX_CONF"
  cat > "$NGINX_CONF" <<NGINX
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Redireciona HTTP → HTTPS (descomente após configurar o certificado SSL)
    # return 301 https://\$host\$request_uri;

    root $BASE_PATH/current;
    index index.html;

    # Assets com hash gerados pelo Astro — cache de 1 ano
    location /_astro/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Fontes locais
    location /fonts/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Imagens
    location /images/ {
        add_header Cache-Control "public, max-age=2592000";
        access_log off;
    }

    # SPA fallback: qualquer rota não encontrada como arquivo serve o index.html
    location / {
        try_files \$uri \$uri/ \$uri.html /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Compressão
    gzip on;
    gzip_types text/html text/css application/javascript application/json image/svg+xml;
    gzip_min_length 1024;
}
NGINX
  echo "Arquivo de configuração criado."
else
  echo "Configuração de Nginx já existe em $NGINX_CONF"
  echo "Verifique se o 'root' aponta para: $BASE_PATH/current"
  echo "  Linha esperada: root $BASE_PATH/current;"
fi

# Habilita o site se não estiver habilitado
NGINX_ENABLED="/etc/nginx/sites-enabled/voeops.com"
if [ ! -L "$NGINX_ENABLED" ]; then
  ln -s "$NGINX_CONF" "$NGINX_ENABLED"
  echo "Site habilitado em sites-enabled."
fi

echo ""
echo "=== [4/5] Testando configuração do Nginx ==============================="

nginx -t && echo "Configuração do Nginx OK." || {
  echo "ERRO na configuração do Nginx. Revise $NGINX_CONF"
  exit 1
}

echo ""
echo "=== [5/5] Reload do Nginx =============================================="

systemctl reload nginx
echo "Nginx recarregado."

echo ""
echo "========================================================================"
echo " Setup concluído!"
echo ""
echo " PRÓXIMOS PASSOS:"
echo " 1. Cadastre os 5 secrets no GitHub (veja docs/deploy-secrets.md)"
echo " 2. Rode o primeiro deploy manualmente:"
echo "    gh workflow run deploy.yml"
echo " 3. Após o primeiro deploy, o symlink será criado automaticamente."
echo " 4. Configure SSL com: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "========================================================================"
