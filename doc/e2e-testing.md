# Pruebas E2E

Las pruebas E2E de stable-sl siguen el patrón de `learn.tg`: **smoke tests
HTTP** (sin navegador) y **browser specs** (Puppeteer + Chrome). Los scripts
están en `apps/stable-sl/e2e/`.

## Referencia rápida

| Comando | Qué | ¿Chrome? | Objetivo |
|---|---|---|---|
| `make test-smoke` | Smoke tests HTTP | No | `http://127.0.0.1:9002` |
| `node e2e/smoke/api-routes.spec.mjs` | Páginas + validación de API | No | `SITE_URL` |
| `node e2e/smoke/flows.spec.mjs` | Flujos completos (testnet) | No | `SITE_URL` |
| `node e2e/specs/home.spec.mjs` | Browser spec (título + botones) | Sí | `SITE_URL` |

Override del objetivo: `SITE_URL=http://127.0.0.1:9002 node e2e/smoke/....mjs`.

## Smoke tests HTTP

Scripts Node standalone (`.mjs`) con `fetch`/`axios`. No requieren navegador.

- `api-routes.spec.mjs`: páginas (`/`, `/buy`, `/sell`) y validación de rutas
  (400 para parámetros faltantes/inválidos), más `anything_to_send` (verifica
  conectividad con la BD).
- `flows.spec.mjs`: flujos completos con RPC/billetera de testnet —
  compra (`purchase_quote → purchase_order → purchase_order_state → sms_received
  → paid`) y venta (`sales_quote → sales_order → crypto_transferred →
  anything_to_send → report_send → paid`). Usa teléfono aleatorio por corrida
  para evitar "pending order from that phone" entre runs.

Requieren la app corriendo:

```sh
cd apps/stable-sl
make dev            # terminal 1
make test-smoke     # terminal 2
```

## Browser specs

Puppeteer (`puppeteer-core`) + Chrome. Requieren `CHROME_PATH` (por defecto
`/usr/local/bin/chrome`).

```sh
CHROME_PATH=/usr/local/bin/chrome node e2e/specs/home.spec.mjs
```

> **Nota (OpenBSD/chroot):** Chromium puede no arrancar en entornos sin display
> o con sandbox restringido. En la máquina real (como en `learn.tg`) sí corre.
> Los smoke tests HTTP no dependen de Chrome.

## `bin/m test:e2e`

`learn.tg` usa el runner de `@pasosdejesus/m` (`bin/m test:e2e`). En stable-sl
los smoke tests son scripts standalone (por simplicidad), pero se pueden invocar
igual que en `learn.tg` con `node e2e/smoke/....mjs`.
