import { NextRequest, NextResponse } from 'next/server'

import { delay } from '@/services/sle'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const quoteId = searchParams.get("quoteId")

    if (!quoteId) {
      return NextResponse.json(
        {error: 'Missing quote'},
        {status: 400}
      )
    } else if (quoteId != 'sdk34ss123') {
      return NextResponse.json(
        {error: 'Unknown quote'},
        {status: 400}
      )
    } else {
      // Confirm that the values of the quote are deliverable
      delay(1000)
      // If they are succeed if not fail
      return NextResponse.json(
        {
          quoteId: quoteId,
          seconds: 15*60,
          amountSle: 10,
          amountUsd: 0.1,
          phoneNumberToPay: "075343641",
          nameOfReceiver: "Vladimir Tamara Patino"
        },
        {status: 200}
      )
    }
}
