import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'

import { purchaseQuote } from '@/db/schema';
import { 
  createPurchaseOrder, getExistingPurchaseOrder, getExistingPurchaseQuote 
} from '@/services/sle'

export async function GET(req: NextRequest) {

      try {
        const { searchParams } = req.nextUrl
        const token = searchParams.get("token")
        const amountSle = +String(searchParams.get("amountSle"))

        if (!token  || token == "") {
          return NextResponse.json(
            {error: 'Missing quote'},
            {status: 400}
          )
        }
        if (amountSle <= 0) {
          return NextResponse.json(
            {error: 'Wrong amount'},
            {status: 400}
          )
        }
        let order = getExistingPurchaseOrder(token)
        if (order != null) {
          return NextResponse.json(
            {error: "Order already exists"},
            {status: 200}
          )
        }
        let quote = await getExistingPurchaseQuote(token)
        if (quote == null) {
          return NextResponse.json(
            {error: "There is no quote with the given token"},
            {status: 200}
          )
        }
        if (quote.timestamp + 10 < Date.now()) {
          return NextResponse.json(
            {error: "Quote expired"},
            {status: 200}
          )
        }
        order = createPurchaseOrder(quote, token, amountSle)
        return NextResponse.json(
          order,
          {status: 200}
        )
      }
      catch (error) {
          return NextResponse.json(
            {error: error},
            {status: 400}
          )
      }
}
