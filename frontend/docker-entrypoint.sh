#!/bin/sh
set -eu

cd /app

if [ ! -d node_modules/next ]; then
  npm install
fi

# Production avoids Next 16 dev HMR/debugChannel hangs behind nginx (dead client buttons).
if [ "${FRONTEND_MODE:-dev}" = "production" ]; then
  if [ ! -f .next/BUILD_ID ] || [ "${FRONTEND_REBUILD:-0}" = "1" ]; then
    npm run build
  fi
  exec npx next start --hostname 0.0.0.0 --port 3000
fi

exec npx next dev --hostname 0.0.0.0 --port 3000
