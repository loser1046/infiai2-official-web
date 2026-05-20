#!/bin/sh
set -e
cd /app
if [ ! -d node_modules/vite ]; then
  echo "[infiai2-official-web-dev] installing dependencies (first run)..."
  npm ci
fi
exec "$@"
