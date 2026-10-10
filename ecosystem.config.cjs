module.exports = {
  apps: [
    {
      name: 'hirecook',
      cwd: '/var/www/hirecook',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000 -H 127.0.0.1',
      instances: 1,
      autorestart: true,
      max_memory_restart: '600M',
      env: { NODE_ENV: 'production' },
    },
  ],
};
