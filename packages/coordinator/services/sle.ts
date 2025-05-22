import { drizzle } from 'drizzle-orm/node-postgres';
import { and, eq, inArray, sql, sum } from 'drizzle-orm';
import { createPublicClient, http } from 'viem'
import { celo, celoAlfajores } from 'viem/chains'

import {  purchaseOrder, purchaseQuote, smsLog } from '@/db/schema';
import { getUsdBalance, getCryptoParams } from '@/services/scrypto'

/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface PurchaseQuote {

  id?: number

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

export interface PurchaseOrder {
  id?: number

  quoteId: number

  /**
   * The ID of the quote.
   */
  token: string

  /**
   * State: pending, received, paid, cancelled, expired
   */
  state: string

  /**
   * Seconds to wait for payment of buyer
   */
  seconds: number

  /**
   * Buyer's name
   **/
  amountSle: number

  /**
   * Buyer's wallet
   **/
  amountUsd: number

  /**
   * phone where to pay
   */
  receiverPhone: string

  /**
   * Name of receiver
   */
  receiverName: string

  transactionUrl: string | null

  timestampTx: number | null

  timestampExpired: number | null

  timestampSms: number | null

  messageSms: string | null

}


/**
 * Delays execution some milliseconds
 * Use to wait 1 second with `await delay(1000)`
 */
export async function delay(ms: number): Promise<any> {
 return new Promise(resolve => setTimeout(resolve, ms))
}


/** 
 * Returns the existing order
 */
export async function getExistingPurchaseQuote(token: string): Promise<PurchaseQuote | null> {
  const db = await drizzle(process.env.DATABASE_URL!)
  console.log("Antes de select")
  const regs = await db.select().from(purchaseQuote).where(
    eq(purchaseQuote.token, token)
  )
  console.log("Después regs=", regs)
  if (regs.length == 0) {
    return null
  }
  if (regs.length > 1) {
    throw new Error(`More than one quote with same token ${token}`)
  }
  /* Call API to get new quote if it is newer update with new quote */
  return Object.assign(regs[0])
}

export async function getExistingPurchaseOrder(token: string): Promise<PurchaseOrder | null> {
  const db = await drizzle(process.env.DATABASE_URL!)
  const regs = await db.select().from(purchaseOrder).where(
    eq(purchaseOrder.token, token)
  )
  if (regs.length == 0) {
    return null
  }
  if (regs.length > 1) {
    throw new Error("More than one order with same token")
  }
  /* Call API to get new quote if it is newer update with new quote */
  return Object.assign(regs[0])
}

export async function addSmsLog(
  timestamp: number, ip:string, phoneNumber: string, message: string
) {
  const db = await drizzle(process.env.DATABASE_URL!)
  let reg =  {
      timestamp: timestamp,
      ip: ip,
      phoneNumber: phoneNumber,
      message: message
  }
  console.log("OJO reg=", reg)
  await db.insert(smsLog).values(reg)
}

export function extractInfoSms(message: string) {
  console.log(`OJO function extractInfoSms(${message})`)
  let e= /Transaction Id ([0-9A-Z.]*) Transfer Succesful from ([0-9]*) transaction amount SLE([0-9.]*) net credit amount SLE([0-9.]*) your new balance is SLE([0-9.])/.exec(message)
  if (e != null) {
    return {
      transactionId: e[1],
      from: e[2],
      amount: +e[3],
      balance: +e[4]
    }
  }
  return null
}

export async function searchPendingPurchaseOrderBySms(phoneNumber:string):Promise<PurchaseOrder | null> {

  const db = await drizzle(process.env.DATABASE_URL!)
  const regs = await db.select().from(purchaseOrder).
    innerJoin(purchaseQuote, eq(purchaseOrder.quoteId, purchaseQuote.id)).
    where(
      and(
        eq(purchaseQuote.senderPhone, phoneNumber),
        eq(purchaseOrder.state, "pending")
      )
  )
  console.log("OJO search regs=", regs)
  if (regs.length == 0) {
    return null
  }
  if (regs.length > 1) {
    throw new Error("More than one pending order from that phone")
  }
  return regs[0].purchaseorder
}


export async function updatePurchaseOrder(
  orderId:number, state: string, details: string, timestamp: number
):Promise<string> {
  const db = await drizzle(process.env.DATABASE_URL!)
  if (state == "received") {
    await db.update(purchaseOrder).set({
      state: state,
      messageSms: details,
      timestampSms: timestamp
    }).
      where(eq(purchaseOrder.id, orderId))
  } else if (state == "paid") {
    await db.update(purchaseOrder).set({
      state: state,
      transactionUrl: details,
      timestampTx: timestamp
    }).
      where(eq(purchaseOrder.id, orderId))
  } else { // "expired"
    await db.update(purchaseOrder).set({
      state: state,
      timestampExpired: timestamp
    }).
      where(eq(purchaseOrder.id, orderId))
  }
  return state
}


/**
 * Asynchronously retrieves a quote for SLE cryptocurrency.
 * @returns A promise that resolves to a PurchaseQuote object.
 */
export async function getPurchaseQuote(
  token: string, buyerName: string, wallet: string, phone: string
): Promise<PurchaseQuote> {
  // TODO: Implement this by calling an API and saving the quote 
  // The name should be in the database as part of the KYC

  let reg:PurchaseQuote
  let existing = null

  console.log("Function getPurchaseQuote")
  console.log("Antes de drizzle")
  const db = await drizzle(process.env.DATABASE_URL!)
  console.log("Después de drizzle")

  console.log("token es", token)
  if (token != null && token != "" && token != "null") {
    let existing = await getExistingPurchaseQuote(token)
    if (existing == null) {
      throw new Error("There is not a quote with the given token")
    }
    let order = await getExistingPurchaseOrder(token)
    if (order != null) {
      throw new Error("There is an order with the given token")
    }
  }

  if (process.env.MIN_LIMIT_ORDER == null) {
    throw new Error("Missing MIN_LIMIT_ORDER")
  }
  if (process.env.MAX_LIMIT_ORDER == null) {
    throw new Error("Missing MAX_LIMIT_ORDER")
  }

  let [
    myAddress, blockchain, rpcUrl, usdAddress, usdDecimals
  ] = await getCryptoParams()

   const publicClient = createPublicClient({
    chain: blockchain,
    transport: http(rpcUrl),
  })

  let balance = await getUsdBalance(
    usdAddress,
    usdDecimals,
    publicClient,
    myAddress
  )

  const regs = await db.select({value: sum(purchaseOrder.amountUsd)}).
    from(purchaseOrder).where(
      eq(purchaseOrder.state, 'pending')
  )
  console.log(`OJO regs=${JSON.stringify(regs[0])}`)
  const toPay = regs && regs[0] && regs[0].value ? +regs[0].value : 0
  console.log(`OJO toPay=${toPay}`)

  let price = 24.26
  let maxLimit = Math.min(+process.env.MAX_LIMIT_ORDER, balance - toPay)
  let minLimit = +process.env.MIN_LIMIT_ORDER
  if (existing == null) {
    let ntoken = ""
    do {
      ntoken = Math.random().toString(36).slice(2)
    } while (await getExistingPurchaseQuote(ntoken) != null)

      reg =  {
        token: ntoken,
        senderPhone: phone,
        senderName: buyerName,
        senderWallet: wallet,
        timestamp: Date.now(),
        usdPriceInSle: price,
        maximum: maxLimit,
        minimum: minLimit
      }
      let rid = await db.insert(purchaseQuote).values(reg).returning(
        { insertedId: purchaseQuote.id }
      )
      reg.id = rid[0].insertedId
  } else {
    reg = existing 
    reg["timestamp"] = Date.now()
    reg["usdPriceInSle"] = price
    reg["maximum"] = maxLimit
    reg["minimum"] = minLimit

    await db.update(purchaseQuote).set({timestamp: reg["timestamp"]}).
      where(eq(purchaseQuote.id, Number(reg.id)))
  }
  return reg
}


/**
 * Asynchronously creates a purchase order, token has a quote
 * @returns A promise that resolves to a PurchaseOrder object
 */
export async function createPurchaseOrder(
  quote: PurchaseQuote, token: string, amountSle: number
): Promise<PurchaseOrder> {
  const db = await drizzle(process.env.DATABASE_URL!)

  console.log("token=", token)
  let reg:PurchaseOrder =  {
    state: "pending",
    transactionUrl: "",
    timestampTx: 0,
    timestampExpired: 0 ,
    timestampSms: 0,
    messageSms: "",
    quoteId: Number(quote.id),
    token: token,
    seconds: 15*60,
    amountSle: amountSle,
    amountUsd: Math.round(amountSle * 100 / quote.usdPriceInSle) / 100,
    receiverPhone: String(process.env?.RECEIVER_PHONE_1),
    receiverName: String(process.env?.RECEIVER_NAME_1)
  }
  console.log("reg=", reg)
  let res = await db.insert(purchaseOrder).values(reg)
  console.log("res=", res)
  return reg
}


export async function updateExpiredPurchaseOrders() {
  console.log("OJO updateExpiredPurchaseOrders")
  const db = await drizzle(process.env.DATABASE_URL!)
  console.log("OJO db")
  const regs = await db.select({oid: purchaseOrder.id}).from(purchaseOrder).
    innerJoin(purchaseQuote, eq(purchaseOrder.quoteId, purchaseQuote.id)).
    where(
      and(
        sql`${purchaseOrder.state}='pending'`,
          sql`${purchaseQuote.timestamp}+${purchaseOrder.seconds}*1000 < ${Date.now()}`
      )
  )
  console.log("OJO search regs.length=", regs.length)
  console.log("OJO regs=", regs)
  if (regs.length > 0) {
    let ids = regs.map((r) => r.oid)
    console.log("OJO ids=", ids)
    let resu = await db.update(purchaseOrder).set({
      state: "expired",
      timestampExpired: Date.now() 
    }).where(inArray(
      purchaseOrder.id, ids
    ))
    console.log("OJO resu=", resu)
  }

}
