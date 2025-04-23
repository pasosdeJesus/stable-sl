/**
 * Represents a quote for SLE cryptocurrency.
 */
export interface Quote {
  /**
   * The ID of the quote.
   */
  id: string;
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
 * @returns A promise that resolves to a Quote object.
 */
export async function getQuote(): Promise<Quote> {
  // TODO: Implement this by calling an API.
  return {
    id: '123',
    timestamp: Date.now(),
    usdPriceInSle: 22.64,
    maximum: 1000,
    minimum: 10
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

