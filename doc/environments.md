# Entornos, billeteras y modos de ejecución

## Entornos

| Entorno | URL | Red | Billetera |
|---|---|---|---|
| Producción | `https://stable-sl.pdJ.app` | Celo mainnet | Una billetera por rol |
| Desarrollo | `https://stable-sl.pdJ.app:9001` | Celo Sepolia (testnet) | Una sola billetera |

En desarrollo, el frontend y la API corren en la **misma** aplicación Next.js
(`apps/stable-sl/`). No hay una aplicación `coordinator` aparte.

## Variables de entorno

El archivo compartido es `apps/.env` (plantilla en `apps/.env.example`).
Variables clave:

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_COORDINATOR` | Base del API (`/api` en este repo) |
| `NEXT_PUBLIC_NETWORK` | `celoSepolia` (dev) o `CELO` (prod) |
| `PORT` | Puerto del dev server (9002) |
| `PGHOST`/`PGDATABASE`/`PGUSER`/`PGPASSWORD` | Conexión PostgreSQL (kysely) |
| `PG_SUPERUSER`/`PG_SUPERUSER_PASSWORD` | Para `bin/m db:super:createuser` |
| `RPC_URL` | RPC de Celo (p. ej. `https://forno.celo-sepolia.celo-testnet.org`) |
| `PRIVATE_KEY`/`PUBLIC_ADDRESS` | Billetera del operador (coordinator) |
| `USD_CONTRACT`/`USD_DECIMALS` | Contrato del token estable USDT |
| `GOODDOLLAR_CONTRACT`/`GOODDOLLAR_DECIMALS` | Contrato de GoodDollar |
| `PHONE`/`PHONE_NAME`/`ORANGEPASS` | Cuenta Orange Money del operador |
| `MIN_SLE`/`MAX_SLE`/`MAX_SLE_WHITELISTED` | Límites de monto |
| `USD_IN_SLE_BUY`/`USD_IN_SLE_SELL` | Precios de compra/venta |

## Modos de ejecución

### Desarrollo

```sh
cd apps/stable-sl
make dev        # o ./bin/dev
```

- Levanta `next dev --webpack` en `PORT` (default 9002).
- Compila bajo demanda; el primer request es lento.
- `bin/dev` sube `ulimit -d` a 7G si puede (ver más abajo).

### Producción

```sh
cd apps/stable-sl
make all        # build (next build --webpack) con guardas
./bin/start     # sirve con next start en PORT
```

o `make prod` (build + start en background).

## Requisito de `ulimit -d` (OpenBSD)

Next.js 16 en OpenBSD no tiene bindings nativos de SWC; usa el fallback WASM
(`@next/swc-wasm-nodejs`), que necesita un data limit de al menos **7G**
(7340032 KB). Sin esto, `next build`/`dev` revienta con un crash nativo de V8.

```sh
ulimit -d 7340032     # o en el chroot: data-limit = 7340032
```

`bin/dev`, `make test` y el target `swc-wasm` del `Makefile` manejan esto.

## Billeteras

- **Operador/coordinator**: `PUBLIC_ADDRESS` (con `PRIVATE_KEY`) firma las
  transferencias de cripto (`transferErc20`) y recibe el cripto de los
  vendedores.
- **Usuarios**: sus billeteras (viem/wagmi). Las direcciones KYC
  (`KYC1`-`KYC4`) tienen límites más altos.

La seguridad de la billetera: no poner `PRIVATE_KEY` en un `.env` versionado;
`apps/.env` está en `.gitignore`.
