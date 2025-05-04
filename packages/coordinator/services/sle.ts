import "reflect-metadata"
import { BuyQuote } from "../entity/BuyQuote"
import { AppDataSource } from "../data-source"

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
  buyerPhone: string

  /**
   * Buyer's name
   **/
  buyerName: string

  /**
   * Buyer's wallet
   **/
  buyerWallet: string

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

  console.log("Antes de getRepository")
  const buyQuoteRepository = AppDataSource.getRepository(BuyQuote)
  console.log("Después de getRepository")

  let reg = {
    quoteId: "",
    timestamp: 0,
    usdPriceInSle: 0,
    maximum: 0,
    minimum: 0,
    buyerWallet: "",
    buyerPhone: "",
    buyerName: "",
  }

  console.log("Ojo quote es ", String(quote))
  if (String(quote) === "") {
    reg =  {
      quoteId: Math.random().toString(36).slice(2),
      timestamp: Date.now(),
      usdPriceInSle: 22.64,
      maximum: 1000,
      minimum: 10,
      buyerWallet: wallet,
      buyerPhone: phone,
      buyerName: buyerName,
    }
    console.log("Antes de create")
    await buyQuoteRepository.create(reg)
    console.log("Después de create")
  } else {
    console.log("Antes de select")
    const buyQuotes = await buyQuoteRepository.findBy({ quoteId: quote })
    console.log(buyQuotes)
    if (buyQuotes.length == 0) {
      throw new Error("Quote not found")
    } else {
      reg = {
        quoteId: buyQuotes[0].quoteId ,
        timestamp: buyQuotes[0].timestamp ,
        usdPriceInSle: buyQuotes[0].usdPriceInSle ,
        maximum: buyQuotes[0].maximum ,
        minimum: buyQuotes[0].minimum ,
        buyerWallet: buyQuotes[0].buyerWallet ,
        buyerPhone: buyQuotes[0].buyerPhone ,
        buyerName: buyQuotes[0].buyerName ,
      }
    }
  }

  return reg
}

