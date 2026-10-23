# Contributing

## Configuración de desarrollo

Ver [README.md](README.md) y [doc/environments.md](doc/environments.md) para la
configuración de entorno y los comandos de ejecución.

Requisitos: Node.js 20+, pnpm 11.28.6, PostgreSQL, y en OpenBSD `ulimit -d` ≥ 7G
(por el fallback WASM de SWC — ver `doc/environments.md`).

Instalar y compilar desde la **raíz** del workspace (un solo lockfile):

```sh
ulimit -d 7340032
pnpm install
make check          # m:check + contract:checkdeploy
make type test
make build
```

## Calidad de código

TypeScript (typecheck):

```sh
cd apps/web
pnpm typecheck
```

> **Nota:** la deuda de tipos de `shadcn/ui` (dependencias opcionales como
> `recharts`, `react-hook-form`, `react-day-picker`) quedó saldada declarando los
> paquetes, así que `make type` es verde y `next.config.ts` conserva
> `ignoreBuildErrors: true` sólo como red de seguridad. El código del API
> (`app/api/`) y la capa de datos (`app/api/db/`) deben quedar sin errores.

## Pruebas

Unit tests (Vitest, con mocks de `kysely`/`pg`/`viem`):

```sh
cd apps/web
make test          # suite completa (sube ulimit -d)
```

Smoke tests HTTP (requieren la app corriendo):

```sh
cd apps/web
make dev           # en otra terminal
make test-smoke    # api-routes + flows (testnet)
```

Ver [doc/e2e-testing.md](doc/e2e-testing.md).

## Build

```sh
cd apps/web
make all           # build-guard → swc-wasm → next build --webpack
```

## Base de datos

La capa de datos usa **Kysely**. Preparar una base local desde cero:

```sh
cd apps/web
bin/m db:super:createuser   # rol de PostgreSQL (PGUSER de apps/.env)
bin/m db:create             # createdb (sólo crea la base vacía)
bin/m db:structure:load     # ¡dropea la base! carga apps/web/db/structure.sql
```

`db:structure:load` es el camino canónico: `apps/web/db/structure.sql` es el
esquema (volcado de producción sin `COPY`, o sea sin datos de clientes). Para
regenerarlo desde una base que sí tenga los datos:
`bin/m db:structure:dump` (escribe `db/structure.sql`). Para un respaldo
completo con datos: `bin/m db:dump` y `bin/m db:restore`.

Migraciones (sólo para bases creadas antes de `structure.sql`, la config de
Kysely vive en el submódulo `app/api/.config/`):

```sh
cd apps/web/app/api
../../bin/m db:migrate
```

El esquema tipado está en `apps/web/app/api/db/` (`db.d.ts`, `migrations/`).

## Estructura del proyecto

```
stable-sl/
├── apps/
│   ├── web/                  # Frontend (Next.js) + API integrada
│   │   ├── app/              # Páginas (buy, sell) y rutas API (app/api/*)
│   │   ├── components/       # UI (shadcn, etc.)
│   │   ├── lib/              # utilidades y hooks
│   │   ├── providers/        # RainbowKit, Wagmi
│   │   ├── e2e/              # smoke tests HTTP + browser specs
│   │   ├── test-utils/       # mocks compartidos (db, viem)
│   │   ├── abis/             # ABIs sincronizadas desde apps/contracts
│   │   ├── bin/              # scripts (dev, prod, start)
│   │   └── .config/          # kysely.config.ts
│   └── contracts/            # Hardhat: contratos y scripts de despliegue
├── gatewaySmsUssd/           # APK del gateway
├── doc/                      # Documentación
├── Makefile                  # install/env-check/build/test/type/check
├── pnpm-workspace.yaml       # apps/*, packages/*, catálogo y allowBuilds
└── ARCHITECTURE.md
```

El backend (coordinator) es un **submodule** en `apps/web/app/api/`
(rutas `app/api/*`, `db/`, `services/`). No tiene `package.json` propio: sus
dependencias se declaran en `apps/web/package.json`.

## Convenciones

- TypeScript en modo estricto.
- Seguir el estilo existente (ESLint + Prettier).
- Contratos con convenciones de Hardhat.
- Frontend con Next.js App Router.
- Sin emojis en la terminal (OpenBSD no los renderiza): usar `[OK]`, `[FAIL]`,
  `[WARN]`, etc.
- Sin operaciones de escritura en Git desde el agente (ver AGENTS.md §7).

## Soporte

Para preguntas o soporte, contáctanos en Telegram:
[@soporte_pdJ_bot](https://t.me/soporte_pdJ_bot)
