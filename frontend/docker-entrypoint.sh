#!/bin/sh
set -eu

cd /app

if [ ! -d node_modules/next ]; then
  npm install
fi

exec npx next dev --hostname 0.0.0.0 --port 3000
