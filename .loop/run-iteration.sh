#!/usr/bin/env bash
set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT=4317
URL="http://localhost:${PORT}/"
cd "$PROJECT_DIR"

cleanup() { fuser -k ${PORT}/tcp 2>/dev/null || true; }
trap cleanup EXIT

echo "=== [1/3] next build ==="
if ! pnpm build > .loop/build.log 2>&1; then
  echo "BUILD_FAIL"
  tail -25 .loop/build.log
  node -e 'const f=".loop/state.json";const s=JSON.parse(require("fs").readFileSync(f));s.condiciones.build=false;require("fs").writeFileSync(f,JSON.stringify(s,null,2))'
  exit 2
fi
node -e 'const f=".loop/state.json";const s=JSON.parse(require("fs").readFileSync(f));s.condiciones.build=true;require("fs").writeFileSync(f,JSON.stringify(s,null,2))'
echo "build OK"

echo "=== [2/3] next start :${PORT} ==="
cleanup
pnpm start -p ${PORT} > .loop/server.log 2>&1 &
for i in $(seq 1 30); do
  if curl -sf -o /dev/null "$URL"; then break; fi
  sleep 1
done
if ! curl -sf -o /dev/null "$URL"; then
  echo "SERVER_FAIL"; tail -15 .loop/server.log; exit 3
fi
echo "server listo"

echo "=== [3/3] ${LOOP_SCRIPT:-.loop/measure.mjs} ==="
node "${LOOP_SCRIPT:-.loop/measure.mjs}" "$URL"
