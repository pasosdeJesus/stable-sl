/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface QuoteToBuy {
  /**
   * The ID of the quote.
   */
  id: string

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
  usdPriceInSle: number;

  /**
   * The maximum amount.
   */
  maximum: number;

  /**
   * The minimum amount.
   */
  minimum: number;
}

/**
 * Delays execution some milliseconds
 * Use to wait 1 second with `awati delay(1000)`
 */
export async function delay(ms: number): Promise<any> {
 return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Asynchronously retrieves a quote for SLE cryptocurrency.
 * @returns A promise that resolves to a QuoteToBuy object.
 */
export async function getQuoteToBuy(buyerName: string, wallet: string, phone: string): Promise<QuoteToBuy> {
  // TODO: Implement this by calling an API and saving the quote 
  // The name should be in the database as part of the KYC
  return {
    id: 'sdk34ss123', // Random. We could upate just timestamp if the rest doesn´ t change
    timestamp: Date.now(),
    usdPriceInSle: 22.64,
    maximum: 1000,
    minimum: 10,
    senderWallet: wallet,
    senderPhone: phone,
    senderName: buyerName,
  };
}

/**
 * Represents the status of an onramp process.
 */
export type OnrampStatus = 'processing' | 'failed' | 'success';

/**
 * Asynchronously retrieves the status of an onramp process.
 * @param quoteId The ID of the quote.
 * @returns A promise that resolves to an OnrampStatus.
 */
export async function getOnrampStatus(quoteId: string): Promise<OnrampStatus> {
  // TODO: Implement this by calling an API.
  return 'processing';
}

