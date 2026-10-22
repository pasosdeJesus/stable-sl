# stable-sl

Facilitar la compra y venta de criptomonedas estables para las personas de
Sierra Leona.

Prototipo en producción en <https://stable-sl.pdJ.app> y en desarrollo en
<https://stable-sl.pdJ.app:9001>.

Ver también:
- [PRINCIPLES.md](PRINCIPLES.md) — principios que rigen el negocio.
- [ARCHITECTURE.md](ARCHITECTURE.md) — diseño, diagramas, flujos.
- [CONTRIBUTING.md](CONTRIBUTING.md) — guía de desarrollo.
- [doc/environments.md](doc/environments.md) — entornos, billeteras y modos de ejecución.
- [doc/e2e-testing.md](doc/e2e-testing.md) — pruebas E2E.

---

## Problema

En Sierra Leona pocas personas manejan una billetera cripto o un exchange y, al
momento de escribir esto, ni FonBnk ni MiniPay soportan Sierra Leona. En cuanto
a exchanges, solo Binance y OKX operan allí.

Hay opciones interesantes de ahorro e inversión en la web3, pero requieren
herramientas y educación. Queremos crear herramientas y promover la educación
sobre esto en Sierra Leona.

## Solución

- Una aplicación web que facilite la compra y venta de criptomonedas estables a
  las personas de Sierra Leona.
- Educación en el uso de criptomonedas estables y en opciones de ahorro e
  inversión.
- Motivados por la oferta inicial de Divvi de FonBnk como posible protocolo de
  backend, en marzo de 2025 propusimos a FonBnk ser sus socios en Sierra Leona.
  Luego nos dijeron que ya tenían equipo allí, pero hasta ahora no soportan la
  moneda ni los métodos de pago de Sierra Leona, ni siquiera en su sandbox.
- Por eso, mientras FonBnk u otro grupo ofrezca una solución de on-ramp/off-ramp,
  hemos empezado a construir una, operando con un equipo basado en la escuela
  Mission Hope School de Kabala (dirigida por el pastor Zechariah Conteh, que
  hace parte del equipo).

## Ubicación del impacto

Sierra Leona

## Contenido de este monorepositorio

```
stable-sl/
├── apps/
│   ├── stable-sl/        # Frontend (Next.js) + API integrada (submodule app/api)
│   │   ├── app/          # Páginas (buy, sell) y rutas API (app/api/*)
│   │   ├── components/   # UI (shadcn, etc.)
│   │   ├── lib/          # utilidades y hooks
│   │   ├── providers/    # RainbowKit, Wagmi
│   │   └── bin/          # scripts (dev, prod)
│   └── hardhat/          # Contratos inteligentes y scripts de despliegue
├── gatewaySmsUssd/       # APK del gateway (app-debug.apk)
└── doc/                  # Documentación (img/, etc.)
```

El backend (coordinator) está integrado como **submodule** en
`apps/stable-sl/app/api/` (rutas `app/api/*`, `db/`, `services/`). No es una
aplicación Next.js aparte: las rutas del API se sirven desde el mismo frontend,
y las dependencias se declaran en **un único** `apps/stable-sl/package.json`
(igual que `learn.tg`).

## Variables de entorno

Ver `apps/.env.example` para la lista completa. Variables clave:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_COORDINATOR` | URL base del API (en este repo es `/api`) |
| `NEXT_PUBLIC_NETWORK` | `celoSepolia` (testnet) o `CELO` (mainnet) |
| `PORT` | Puerto del servidor dev (default 9002) |
| `PGHOST` / `PGDATABASE` / `PGUSER` / `PGPASSWORD` | Conexión a PostgreSQL (kysely) |
| `RPC_URL` / `PRIVATE_KEY` / `PUBLIC_ADDRESS` | Blockchain (Celo) |
| `USD_CONTRACT` / `GOODDOLLAR_CONTRACT` | Contratos de los tokens estables |
| `PHONE` / `PHONE_NAME` / `ORANGEPASS` | Cuenta Orange Money del operador |

## Ejecutar en modo desarrollo

```sh
cd apps/stable-sl
make dev            # o ./bin/dev  (levanta next dev --webpack en PORT)
```

Requiere `ulimit -d` ≥ 7G (OpenBSD) — ver `doc/environments.md`.

## Ejecutar en modo producción

```sh
cd apps/stable-sl
make all            # build (next build --webpack) con guardas
./bin/start         # sirve con next start en PORT
```

o, en una sola línea:

```sh
cd apps/stable-sl && make prod
```

## Pruebas

```sh
cd apps/stable-sl
make test           # unit tests (vitest)
make test-smoke     # smoke tests HTTP (necesita la app corriendo)
```

Ver [doc/e2e-testing.md](doc/e2e-testing.md).

## Base de datos

PostgreSQL con **Kysely** (antes Drizzle). El esquema vive en
`apps/stable-sl/app/api/db/` (tipo `DB` en `db.d.ts`, migraciones en
`db/migrations/`). Ver `ARCHITECTURE.md` §Database.

## Estado de implementación

Es un prototipo que:

1. Tiene on-ramp funcional con USDT y GoodDollar.
2. Muestra cómo funciona el off-ramp con USDT y GoodDollar.
3. Aún no usa una API de cotizaciones; los precios de compra y venta se fijan
   manualmente y se ajustan periódicamente (razonable dada la estabilidad del SLE).
4. Interactúa con el gateway recibiendo los SMS con notificaciones de Orange
   Money (método a mejorar).
5. La versión de producción puede pagar en mainnet en USDT o GoodDollar,
   limitada a montos pequeños. La versión de desarrollo corre en Celo Sepolia
   (Celo Sepolia) y paga en Mock USDT y Mock GoodDollar.
