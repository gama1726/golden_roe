#!/bin/sh
set -eu

cd /app

if [ ! -d node_modules/vite ]; then
  npm install
fi

exec npx vite --host 0.0.0.0 --port 5173
