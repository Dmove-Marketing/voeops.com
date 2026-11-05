# Diagnóstico SOMENTE LEITURA (roda na VPS como o usuário de deploy).
# Não altera, não reinicia nada. "sudo -n" falha na hora se não houver permissão.
B="${B:-/var/www/voeops.com}"
r(){ sudo -n "$@" 2>/dev/null || "$@" 2>&1; }
s(){ echo; echo "=================== $*"; }
s "quem sou / host / uptime"; id; hostname; uptime; sudo -n -l 2>&1 | head -15
s "nginx -t"; r nginx -t
s "systemctl status nginx"; systemctl status nginx --no-pager 2>&1 | head -15
s "sites-enabled"; ls -la /etc/nginx/sites-enabled/ /etc/nginx/sites-available/ 2>&1
s "bloco server voeops.com"; for f in /etc/nginx/sites-enabled/*voeops*; do echo "--- $f"; r cat "$f"; done
s "raiz do site"; ls -la "$B" "$B/releases" 2>&1
s "symlink current"; ls -la "$B/current" 2>&1; readlink -f "$B/current"; ls -la "$B/current/" 2>&1 | head -20
s "index.html: caminho e permissões"; namei -l "$B/current/index.html" 2>&1; stat "$B/current/index.html" 2>&1
s "error.log (últimas 100)"; r tail -n 100 /var/log/nginx/error.log
s "error.log: tipos de erro"; r cat /var/log/nginx/error.log | grep -oE '\[(error|crit|alert|emerg)\].{0,140}' | sed -E 's/[0-9]+#[0-9]+: \*[0-9]+ //' | cut -c1-130 | sort | uniq -c | sort -rn | head -15
s "access.log (não-200, últimas 100)"; r tail -n 600 /var/log/nginx/access.log | grep -vE '" (200|304) ' | tail -n 100
s "primeiros 500 nos logs"; for f in /var/log/nginx/access.log*; do r zcat -f "$f"; done 2>/dev/null | grep '" 500 ' | awk '{print $4}' | sort | head -3
s "disco / memória"; df -h; df -i | head -5; free -m
s "mudanças recentes (10 dias) em nginx e no site"; find /etc/nginx "$B" -maxdepth 3 -newermt '-10 days' -printf '%TY-%Tm-%Td %TH:%TM %u %p\n' 2>/dev/null | sort | tail -50
s "apt (últimas atualizações)"; r grep -E '^(Start-Date|Commandline|Upgrade)' /var/log/apt/history.log | tail -15
s "certbot"; r ls -l /etc/letsencrypt/renewal/; r grep -E 'Renewing|deploy-hook|Running|rror' /var/log/letsencrypt/letsencrypt.log | tail -10
s "journal nginx (10 dias)"; r journalctl -u nginx --since '10 days ago' --no-pager | tail -25
s "cron / logins recentes"; ls -la /etc/cron.d 2>&1; crontab -l 2>&1 | grep -v '^#'; r last -n 10 -F | head -12
s "teste local"; for p in / /politica-de-privacidade/ /exclusao-de-conta/ /suporte/; do curl -sk -o /dev/null -w "$p %{http_code}\n" --resolve voeops.com:443:127.0.0.1 "https://voeops.com$p"; done
