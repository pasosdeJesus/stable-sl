# Makefile para stable-sl (frontend + API, un solo package.json).
# Adaptado de learn.tg/apps/nextjs/Makefile (sin motores/abis/assets).

# ── Build ──────────────────────────────────────────────────────────────
# OpenBSD: 8 workers × 2048 MB es lo seguro (máquina compartida). No compilar
# mientras el dev server sirve requests o corre la suite E2E.
build-guard:
	@if pgrep -f '[n]ext d''ev' >/dev/null 2>&1; then \
	  echo "ERROR: el dev server está activo. Deténlo antes de compilar." ; \
	  exit 1 ; \
	fi

# Next.js 16 SWC wasm fallback: OpenBSD no tiene bindings nativos y la descarga
# on-demand deja node_modules/next/wasm vacío (learn.tg issue #205).
.PHONY: swc-wasm
swc-wasm:
	mkdir -p node_modules/next/wasm/@next/swc-wasm-nodejs
	cp node_modules/@next/swc-wasm-nodejs/wasm.js node_modules/@next/swc-wasm-nodejs/wasm_bg.wasm node_modules/next/wasm/@next/swc-wasm-nodejs/

all: build-guard swc-wasm
	rm -rf .next
	pnpm i
	NODE_OPTIONS="--max-old-space-size=2048" WEBPACK_PARALLELISM=8 pnpm exec next build --webpack

# ── Types ──────────────────────────────────────────────────────────────

type:
	pnpm typecheck

# ── Tests ──────────────────────────────────────────────────────────────

# La suite completa necesita más memoria (V8/WASM en OpenBSD supera el
# ulimit -d por defecto). Sube el límite de datos antes de correr.
test:
	@ulimit -d 7340032 2>/dev/null || true; \
	pnpm vitest run

test-api:
	pnpm vitest run app/api

test-db:
	pnpm vitest run app/api/db/__tests__

test-smoke:
	SITE_URL=$${SITE_URL:-http://127.0.0.1:9002} node e2e/smoke/api-routes.spec.mjs
	SITE_URL=$${SITE_URL:-http://127.0.0.1:9002} node e2e/smoke/flows.spec.mjs

# ── Dev / Prod ──────────────────────────────────────────────────────────

dev:
	./bin/dev

prod: swc-wasm
	NODE_OPTIONS="--max-old-space-size=2048" WEBPACK_PARALLELISM=8 pnpm exec next build --webpack
	./bin/start > prod.log 2>&1 &

.PHONY: all type test test-api test-db test-smoke dev prod build-guard
