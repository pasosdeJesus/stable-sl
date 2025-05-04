import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'

import { purchaseQuote } from '@/db/schema';


export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.json(
        {error: 'Missing quote'},
        {status: 400}
      )
    } else if (token != 'sdk34ss123') {
      return NextResponse.json(
        {error: 'Unknown quote'},
        {status: 400}
      )
    } else {
      // Confirm that the values of the quote are deliverable
      // If they are succeed if not fail
      return NextResponse.json(
        {
          token: token,
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
