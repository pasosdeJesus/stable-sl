#!/usr/bin/env node

/**
 * Smoke test (HTTP) de los flujos principales con RPC/billetera de testnet
 * (Celo Sepolia, valores de learn.tg apps/.env).
 *
 * Compra (buyer distinto → transferencia real):
 *   purchase_quote -> purchase_order -> purchase_order_state
 *   -> sms_received (transferencia) -> purchase_order_state (paid)
 *
 * Venta (seller = billetera del coordinator, con saldo):
 *   sales_quote -> sales_order -> crypto_transferred (received)
 *   -> anything_to_send (USSD) -> report_send (paid) -> sales_order_state (paid)
 *
 * Uso:
 *   SITE_URL=http://127.0.0.1:9002 node e2e/smoke/flows.spec.mjs
 */

const BASE = (process.env.SITE_URL || 'http://127.0.0.1:9002').replace(/\/+$/, '')
const TIMEOUT_MS = Number(process.env.SMOKE_TIMEOUT_MS || '60000')

const BUYER_WALLET = '0x0000000000000000000000000000000000000001'
const SELLER_WALLET = '0x84272a6dd0D5fE9ea2Ab28Cf96e72f4F7da00C5C'
const rndPhone = () => '0' + String(Math.floor(10000000 + Math.random() * 89999999))
const BUY_PHONE = rndPhone()
const SELL_PHONE = rndPhone()

let failed = 0
function ok(msg) { console.log(`  [OK] ${msg}`) }
function fail(msg) { failed++; console.log(`  [FAIL] ${msg}`) }

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { signal: AbortSignal.timeout(TIMEOUT_MS) })
  let body = null
  try { body = await res.json() } catch { /* non-JSON */ }
  return { status: res.status, body }
}

async function post(path, json) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(json),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  })
  let body = null
  try { body = await res.json() } catch { /* non-JSON */ }
  return { status: res.status, body }
}

async function main() {
  console.log(`Smoke flows (testnet) — ${BASE}\n`)

  // ── Flujo de compra (buyer distinto) ──
  let buyToken = null
  {
    const path = `/api/purchase_quote?buyerName=Comprador&wallet=${BUYER_WALLET}&phone=${BUY_PHONE}&crypto=usdt`
    const { status, body } = await get(path)
    if (status === 200 && body?.token) { ok(`purchase_quote → 200 token=${body.token}`); buyToken = body.token }
    else fail(`purchase_quote → ${status} ${JSON.stringify(body)}`)
  }

  if (buyToken) {
    const o = await get(`/api/purchase_order?token=${buyToken}&amountSle=23`)
    if (o.status === 200) ok(`purchase_order → 200 state=${o.body?.state}`)
    else fail(`purchase_order → ${o.status} ${JSON.stringify(o.body)}`)

    const st1 = await get(`/api/purchase_order_state?token=${buyToken}`)
    if (st1.status === 200 && st1.body?.state === 'pending') ok(`purchase_order_state → 200 state=pending`)
    else fail(`purchase_order_state → ${st1.status} ${JSON.stringify(st1.body)}`)

    const sms = await post('/api/sms_received', {
      sender: 'OrangeMoney',
      msg: `Transaction Id: 123456 from ${BUY_PHONE} Amount: 23`,
    })
    if (sms.status === 200) ok(`sms_received → 200 ${JSON.stringify(sms.body)}`)
    else fail(`sms_received → ${sms.status} ${JSON.stringify(sms.body)}`)

    const st2 = await get(`/api/purchase_order_state?token=${buyToken}`)
    if (st2.status === 200 && st2.body?.state === 'paid') ok(`purchase_order_state tras sms → 200 state=paid`)
    else fail(`purchase_order_state tras sms → ${st2.status} ${JSON.stringify(st2.body)}`)
  }

  // ── Flujo de venta ──
  let sellToken = null
  {
    const path = `/api/sales_quote?sellerName=Vendedor&wallet=${SELLER_WALLET}&phone=${SELL_PHONE}&crypto=usdt`
    const { status, body } = await get(path)
    if (status === 200 && body?.token) { ok(`sales_quote → 200 token=${body.token}`); sellToken = body.token }
    else fail(`sales_quote → ${status} ${JSON.stringify(body)}`)
  }

  if (sellToken) {
    const o = await get(`/api/sales_order?token=${sellToken}&amountCrypto=1`)
    if (o.status === 200) ok(`sales_order → 200 state=${o.body?.state}`)
    else fail(`sales_order → ${o.status} ${JSON.stringify(o.body)}`)

    const ct = await post('/api/crypto_transferred', { token: sellToken, tx: '0x' + 'cd'.repeat(32) })
    if (ct.status === 200) ok(`crypto_transferred → 200 ${JSON.stringify(ct.body).slice(0, 60)}`)
    else fail(`crypto_transferred → ${ct.status} ${JSON.stringify(ct.body)}`)

    const ats = await get('/api/anything_to_send')
    if (ats.status === 200 && ats.body?.action !== 'rest') ok(`anything_to_send → 200 amountSle=${ats.body?.amountSle} receiverPhone=${ats.body?.receiverPhone}`)
    else fail(`anything_to_send → ${ats.status} ${JSON.stringify(ats.body)}`)

    const rs = await post('/api/report_send', { receiverPhone: SELL_PHONE })
    if (rs.status === 200) ok(`report_send → 200 ${JSON.stringify(rs.body)}`)
    else fail(`report_send → ${rs.status} ${JSON.stringify(rs.body)}`)

    const st = await get(`/api/sales_order_state?token=${sellToken}`)
    if (st.status === 200 && st.body?.state === 'paid') ok(`sales_order_state → 200 state=paid`)
    else fail(`sales_order_state → ${st.status} ${JSON.stringify(st.body)}`)
  }

  console.log(`\n${failed === 0 ? 'Flows PASS' : 'Flows FAIL'} (${failed} failed)`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1) })
