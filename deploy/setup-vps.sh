#!/usr/bin/env bash
# One-time setup on a fresh Ubuntu 22.04/24.04 VPS (run as root):
#   curl -fsSL https://raw.githubusercontent.com/pinetravelpk-bit/hirecook/main/deploy/setup-vps.sh | bash
set -euo pipefail
APP_DIR=/var/www/hirecook
DATA_DIR=/var/www/hirecook-data
REPO=https://github.com/pinetravelpk-bit/hirecook.git

apt-get update
apt-get install -y curl git nginx ufw
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y nodejs
npm install -g pm2

mkdir -p "$DATA_DIR"
if [ ! -d "$APP_DIR/.git" ]; then git clone "$REPO" "$APP_DIR"; fi
cd "$APP_DIR"
if [ ! -f .env ]; then
  cp .env.example .env
  sed -i "s|^ADMIN_KEY=.*|ADMIN_KEY=$(openssl rand -hex 16)|; s|^LEADS_DIR=.*|LEADS_DIR=$DATA_DIR|" .env
  echo ">> Edit $APP_DIR/.env (phone, WhatsApp, email) then re-run: bash deploy/deploy.sh"
fi

npm ci
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

cp deploy/nginx-hirecook.conf /etc/nginx/sites-available/hirecook
ln -sf /etc/nginx/sites-available/hirecook /etc/nginx/sites-enabled/hirecook
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw --force enable

# SSL (run after DNS A records for hirecook.pk and www.hirecook.pk point to this server)
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d hirecook.pk -d www.hirecook.pk --redirect --agree-tos -m admin@hirecook.pk -n || echo ">> SSL failed: check DNS, then run: certbot --nginx -d hirecook.pk -d www.hirecook.pk --redirect"

echo "Done. Site running on http://$(curl -s ifconfig.me)"
