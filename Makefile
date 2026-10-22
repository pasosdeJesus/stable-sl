.PHONY: all install env-check build test type check update-skills

# `all` vive en la raíz del workspace: una sola instalación para todas las apps.
all: install env-check build

install:
	sh -c 'ulimit -d 7340032 && pnpm i'

# Avisos de variables de entorno renombradas (informativo, no falla).
env-check:
	@./apps/web/bin/m env:check || true

# El build de la app web ya maneja `build-guard`, SWC wasm, `.next` y NODE_OPTIONS.
build:
	@(cd apps/web && $(MAKE) all)

test:
	@echo "Running tests in apps/web..."
	@(cd apps/web && $(MAKE) test)
	@echo "Running tests in apps/contracts..."
	@(cd apps/contracts && $(MAKE) test)

type:
	@echo "Type-checking in apps/web..."
	@(cd apps/web && $(MAKE) type)
	@echo "Type-checking in apps/contracts..."
	@(cd apps/contracts && $(MAKE) type)

# Estructura y direcciones de despliegue.
check:
	@./apps/web/bin/m m:check
	@if [ -d apps/contracts/deployments ]; then \
		./apps/web/bin/m contract:checkdeploy; \
	else \
		echo "[SKIP] contract:checkdeploy: falta apps/contracts/deployments"; \
	fi

update-skills:
	npx skills add celo-org/celopedia-skills
