import { DataTypes, Model, Op, Sequelize } from 'sequelize';

import 'dotenv/config'
import '../sequelize/models/buyquote'

/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface QuoteToBuy {
  /**
   * The ID of the quote.
   */
  quoteId: string

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
export async function getQuoteToBuy(quote: string, buyerName: string, wallet: string, phone: string): Promise<QuoteToBuy> {
  // TODO: Implement this by calling an API and saving the quote 
  // The name should be in the database as part of the KYC

  try {
    console.log("Antes se, DB_URL=", process.env.DB_URL)
    const sequelize = new Sequelize(process.env.DB_URL, {
      define: {
        freezeTableName: true, // model and table with same name
      },
    });
    console.log("Despues se=", sequelize)


    let reg = {}
    if (quote === "") {
      reg =  {
        quoteId: Math.random().toString(36).slice(2),
        timestamp: Date.now(),
        usdPriceInSle: 22.64,
        maximum: 1000,
        minimum: 10,
        senderWallet: wallet,
        senderPhone: phone,
        senderName: buyerName,
      }
      const newQuote = await Buyquote.create(reg);
      //await db.insert(quotesToBuy).values(reg)
    } else {
      console.log("Antes de select")
      /*const regs = await db.select({ quoteId: quote }).from(quotesToBuy)
        console.log(regs)
        if (regs == 0) {
        throw new Error("Quote not found")
        } else {
        reg = regs
        } */
    }

    return reg
  } catch (error) {
    console.error(error)
  }
}

