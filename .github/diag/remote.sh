# Diagnóstico 2 (SOMENTE LEITURA): o que apagou /var/www/voeops.com em 03/11 ~18:21 CET.
s(){ echo; echo "=================== $*"; }
s "date / tz"; date; timedatectl 2>/dev/null | grep -i zone
s "/var/www"; ls -la --time-style=full-iso /var/www/
s "auth.log 03/11 16:00-19:59 (sessões / comandos)"; zcat -f /var/log/auth.log* 2>/dev/null | grep -E '^2026-11-03T1[6-9]|^Nov  3 1[6-9]' | grep -E 'Accepted|session opened|sudo|COMMAND' | sed -E 's/from [0-9.]+ port [0-9]+/from <ip>/' | head -80
s "journal 03/11 18:10-18:30"; journalctl --since '2026-11-03 18:10' --until '2026-11-03 18:30' --no-pager 2>&1 | grep -vE 'nginx\[' | head -80
s "access.log voeops 03/11 18:00-18:22 (status)"; zcat -f /var/log/nginx/access.log* | grep -E '03/Nov/2026:18:(0|1|2[0-2])' | awk '{print $4, $9, $7}' | grep -E ' (500|200) /($| )' | head -20
s "históricos de shell"; for h in /root/.bash_history /home/*/.bash_history; do echo "--- $h"; grep -nE 'rm |voeops|/var/www' "$h" 2>/dev/null | tail -30; done
s "deploy keys autorizadas (só comentários)"; awk '{print $NF}' /root/.ssh/authorized_keys 2>/dev/null
s "outros diretórios /var/www com releases"; for d in /var/www/*/; do [ -d "$d/releases" ] && echo "$d -> $(readlink "$d/current")  $(ls "$d/releases" | tail -1)"; done
