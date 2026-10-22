#!/usr/bin/env node

/**
 * Smoke test (HTTP, sin navegador) para stable-sl.
 * Verifica páginas, rutas del API (validación) y que las consultas a la BD
 * (rutas que leen/escriben) responden correctamente.
 *
 * Uso:
 *   SITE_URL=http://127.0.0.1:9002 node e2e/smoke/api-routes.spec.mjs
 */

const BASE = (process.env.SITE_URL || 'http://127.0.0.1:9002').replace(/\/+$/, '')
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || '15000')

let failed = 0
let passed = 0
function ok(msg) { passed++; console.log(`  [OK] ${msg}`) }
function fail(msg) { failed++; console.log(`  [FAIL] ${msg}`) }

const WALLET = '0x2e2c4AC19c93d0984840cDD8E7f77500e2ef978e'

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  let body = null
  try { body = await res.json() } catch { /* non-JSON */ }
  return { status: res.status, body }
}

async function expectStatus(path, want) {
  const { status, body } = await get(path)
  if (status === want) ok(`GET ${path} → ${status}`)
  else fail(`GET ${path} → ${status} (esperado ${want}) ${JSON.stringify(body)}`)
}

async function expect400Error(path, errMsg) {
  const { status, body } = await get(path)
  if (status === 400 && body?.error === errMsg) ok(`GET ${path} → 400 "${errMsg}"`)
  else fail(`GET ${path} → ${status} ${JSON.stringify(body)} (esperado 400 "${errMsg}")`)
}

async function main() {
  console.log(`Smoke: stable-sl API + pages — ${BASE}\n`)

  // Frontend pages
  for (const path of ['/', '/buy', '/sell']) {
    const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    if (res.status === 200) ok(`GET ${path} → 200`)
    else fail(`GET ${path} → ${res.status}`)
  }

  // ping
  {
    const { status, body } = await get('/api/ping')
    if (status === 200 && body?.msg === 'pong') ok('GET /api/ping → 200 pong')
    else fail(`GET /api/ping → ${status} ${JSON.stringify(body)}`)
  }

  // purchase_quote: validación
  await expect400Error('/api/purchase_quote', 'Missing wallet')
  await expect400Error('/api/purchase_quote?wallet=0x123', 'Wallet with wrong format')
  await expect400Error(`/api/purchase_quote?wallet=${WALLET}`, 'Missing phone')
  await expect400Error(`/api/purchase_quote?wallet=${WALLET}&phone=bad`, 'Phone with wrong format')

  // sales_quote: validación
  await expect400Error('/api/sales_quote', 'Missing wallet')
  await expect400Error('/api/sales_quote?wallet=0x123', 'Wallet with wrong format')

  // purchase_order / purchase_order_state sin token
  await expect400Error('/api/purchase_order', 'Missing quote')
  await expect400Error('/api/purchase_order_state', 'Missing quote')
  await expect400Error('/api/sales_order', 'Missing quote')

  // anything_to_send: consulta la BD (debe devolver 200 action=rest si no hay pendientes)
  {
    const { status, body } = await get('/api/anything_to_send')
    if (status === 200 && body?.action === 'rest') ok('GET /api/anything_to_send → 200 action=rest (BD OK)')
    else fail(`GET /api/anything_to_send → ${status} ${JSON.stringify(body)}`)
  }

  console.log(`\n${failed === 0 ? 'Smoke PASS' : 'Smoke FAIL'} — ${passed} passed, ${failed} failed`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1) })
