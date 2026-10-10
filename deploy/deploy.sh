#!/usr/bin/env bash
# Pull latest code, rebuild and restart with zero config changes.
set -euo pipefail
cd /var/www/hirecook
git pull --ff-only
npm ci
npm run build
pm2 reload hirecook || pm2 start ecosystem.config.cjs
pm2 save
echo "Deployed $(git rev-parse --short HEAD)"
