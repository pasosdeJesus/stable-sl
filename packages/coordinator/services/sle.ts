import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';

import { quotesToBuy } from '@/db/schema';

/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface QuoteToBuy {
  /**
   * The ID of the quote.
   */
  token: string

  /**
   * Phone of buyer
   */
  senderPhone: string

  /**
   * Buyer's name
   **/
  senderName: string

  /**
   * Buyer's wallet
   **/
  senderWallet: string

  /**
   * The timestamp of the quote.
   */
  timestamp: number

  /**
   * Price to buy USD in SLE.
   */
  usdPriceInSle: number

  /**
   * The maximum amount.
   */
  maximum: number

  /**
   * The minimum amount.
   */
  minimum: number
}

/**
 * Delays execution some milliseconds
 * Use to wait 1 second with `await delay(1000)`
 */
export async function delay(ms: number): Promise<any> {
 return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Asynchronously retrieves a quote for SLE cryptocurrency.
 * @returns A promise that resolves to a QuoteToBuy object.
 */
export async function getQuoteToBuy(token: string, buyerName: string, wallet: string, phone: string): Promise<QuoteToBuy> {
  // TODO: Implement this by calling an API and saving the quote 
  // The name should be in the database as part of the KYC

  console.log("Antes de drizzle")
  const db = await drizzle(process.env.DATABASE_URL!)
  console.log("Después de drizzle")

  console.log("token es", token)
  let reg =  {
    token: "",
    timestamp: 0,
    usdPriceInSle: 0,
    maximum: 0,
    minimum: 0,
    senderWallet: "",
    senderPhone: "",
    senderName: ""
  }
  if (token === "" || token === "null") {
    reg =  {
      token: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      usdPriceInSle: 22.64,
      maximum: 1000,
      minimum: 10,
      senderWallet: wallet,
      senderPhone: phone,
      senderName: buyerName,
    }
    await db.insert(quotesToBuy).values(reg)
  } else {
    console.log("Antes de select")
    debugger
    const regs = await db.select().from(quotesToBuy).where(eq(quotesToBuy.token, token))
    console.log("Después regs=", regs)
    delete regs[0]["id"]
    /* Call API to get new quote if it is newer update with new quote */
    reg = Object.assign(regs[0])
    reg["timestamp"] = Date.now()
  }

  return reg
}

