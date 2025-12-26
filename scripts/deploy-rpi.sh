#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOY_TARGET="${DEPLOY_TARGET:-/mnt/sql/api/pocketbase/pb_public}"

cd "$REPO_ROOT"

if [ -f package-lock.json ]; then
    npm ci || npm install
else
    npm install
fi

npm run build

mkdir -p "$DEPLOY_TARGET"

if command -v rsync >/dev/null 2>&1; then
    if [ "${DEPLOY_CLEAN:-0}" = "1" ]; then
        rsync -a --delete dist/ "$DEPLOY_TARGET"/
    else
        rsync -a dist/ "$DEPLOY_TARGET"/
    fi
else
    cp -a dist/. "$DEPLOY_TARGET"/
fi

echo "Deployed to ${DEPLOY_TARGET}"
