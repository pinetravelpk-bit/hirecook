#!/usr/bin/env bash
# Redeploy HireCook.pk on the VPS (run as root):  bash /var/www/hirecook/current/deploy/deploy.sh
# Layout: code /var/www/hirecook/current · env /etc/hirecook/hirecook.env · leads /var/lib/hirecook
#         systemd hirecook.service on 127.0.0.1:3104 · nginx /etc/nginx/sites-available/hirecook.pk
set -euo pipefail
cd /var/www/hirecook/current
runuser -u hirecook -- git pull --ff-only
runuser -u hirecook -- bash -c 'set -a; . /etc/hirecook/hirecook.env; set +a; export HOME=/var/www/hirecook NEXT_TELEMETRY_DISABLED=1; npm ci --no-audit --no-fund && npm run build'
systemctl restart hirecook
sleep 3
curl -fsS -o /dev/null -w "hirecook: HTTP %{http_code}\n" http://127.0.0.1:3104/
node scripts/indexnow.mjs || echo "IndexNow ping failed (non-fatal)"
echo "Deployed $(runuser -u hirecook -- git rev-parse --short HEAD)"
