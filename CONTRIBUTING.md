# Contributing

## Configuración de desarrollo

Ver [README.md](README.md) y [doc/environments.md](doc/environments.md) para la
configuración de entorno y los comandos de ejecución.

Requisitos: Node.js 20+, pnpm 10.6.2, PostgreSQL, y en OpenBSD `ulimit -d` ≥ 7G
(por el fallback WASM de SWC — ver `doc/environments.md`).

## Calidad de código

TypeScript (typecheck):

```sh
cd apps/stable-sl
pnpm typecheck
```

> **Nota:** hay errores de tipo preexistentes en componentes `shadcn/ui`
> (dependencias opcionales como `recharts`, `react-hook-form`, etc.). El
> `next.config.ts` tiene `ignoreBuildErrors: true` por eso. El código del API
> (`app/api/`) y la capa de datos (`app/api/db/`) deben quedar sin errores.

## Pruebas

Unit tests (Vitest, con mocks de `kysely`/`pg`/`viem`):

```sh
cd apps/stable-sl
make test          # suite completa (sube ulimit -d)
```

Smoke tests HTTP (requieren la app corriendo):

```sh
cd apps/stable-sl
make dev           # en otra terminal
make test-smoke    # api-routes + flows (testnet)
```

Ver [doc/e2e-testing.md](doc/e2e-testing.md).

## Build

```sh
cd apps/stable-sl
make all           # build-guard → swc-wasm → next build --webpack
```

## Base de datos

La capa de datos usa **Kysely**. Para aplicar migraciones:

```sh
cd apps/stable-sl
bin/m db:migrate          # o kysely migrate con .config/kysely.config.ts
```

El esquema está en `apps/stable-sl/app/api/db/` (`db.d.ts`, `migrations/`).

## Estructura del proyecto

```
stable-sl/
├── apps/
│   ├── stable-sl/            # Frontend (Next.js) + API integrada
│   │   ├── app/              # Páginas (buy, sell) y rutas API (app/api/*)
│   │   ├── components/       # UI (shadcn, etc.)
│   │   ├── lib/              # utilidades y hooks
│   │   ├── providers/        # RainbowKit, Wagmi
│   │   ├── e2e/              # smoke tests HTTP + browser specs
│   │   ├── test-utils/       # mocks compartidos (db, viem)
│   │   ├── bin/              # scripts (dev, prod, start)
│   │   └── .config/          # kysely.config.ts
│   └── hardhat/              # Contratos y scripts de despliegue
├── gatewaySmsUssd/           # APK del gateway
├── doc/                      # Documentación
└── ARCHITECTURE.md
```

El backend (coordinator) es un **submodule** en `apps/stable-sl/app/api/`
(rutas `app/api/*`, `db/`, `services/`). No tiene `package.json` propio: sus
dependencias se declaran en `apps/stable-sl/package.json`.

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
