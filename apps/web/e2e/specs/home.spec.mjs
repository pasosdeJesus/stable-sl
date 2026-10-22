#!/usr/bin/env node

/**
 * Browser spec (Puppeteer + Chrome headless) para stable-sl.
 * Verifica que la página principal renderiza (título + botones Buy/Sell).
 *
 * Uso:
 *   SITE_URL=http://127.0.0.1:9002 node e2e/specs/home.spec.mjs
 */

const BASE = (process.env.SITE_URL || 'http://127.0.0.1:9002').replace(/\/+$/, '')
const CHROME_PATH = process.env.CHROME_PATH || '/usr/local/bin/chrome'

let failed = 0
function ok(msg) { console.log(`  [OK] ${msg}`) }
function fail(msg) { failed++; console.log(`  [FAIL] ${msg}`) }

async function main() {
  const puppeteer = await import('puppeteer-core')
  console.log(`Browser spec: home — ${BASE}\n`)

  let browser
  try {
    browser = await puppeteer.default.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    })
    const page = await browser.newPage()
    await page.goto(BASE, { waitUntil: 'networkidle0', timeout: 60000 })

    const title = await page.title()
    if (title.includes('stable-sl')) ok(`title = "${title}"`)
    else fail(`title = "${title}" (esperado que contenga "stable-sl")`)

    const body = await page.evaluate(() => document.body.innerText)
    if (body.includes('Buy') && body.includes('Sell')) ok('botones Buy y Sell presentes')
    else fail('no se encontraron los botones Buy/Sell')
  } catch (e) {
    fail(`error: ${e.message.slice(0, 200)}`)
  } finally {
    if (browser) await browser.close()
  }

  console.log(`\n${failed === 0 ? 'Browser spec PASS' : 'Browser spec FAIL'} (${failed} failed)`)
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1) })
