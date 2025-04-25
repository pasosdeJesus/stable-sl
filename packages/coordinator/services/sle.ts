/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface QuoteToBuy {
  /**
   * The ID of the quote.
   */
  id: string

  /**
   * Wallet of buyer
   */
  wallet: string

  /**
   * Phone of buyer
   */
   phone: string

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
 * Asynchronously retrieves a quote for SLE cryptocurrency.
 * @returns A promise that resolves to a QuoteToBuy object.
 */
export async function getQuoteToBuy(wallet: string, phone: string): Promise<QuoteToBuy> {
  // TODO: Implement this by calling an API and saving the quote 
  return {
    id: 'sdk34ss123', // Random. We don't need to change the id if the information, doesn´t change, only timestamp
    timestamp: Date.now(),
    usdPriceInSle: 22.64,
    maximum: 1000,
    minimum: 10,
    wallet: wallet,
    phone: phone
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

