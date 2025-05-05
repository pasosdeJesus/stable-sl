import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'

import { 
  getExistingPurchaseOrder, getExistingPurchaseQuote, updatePurchaseOrder 
} from '@/services/sle';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const token = searchParams.get("token")
    let secondsRemaining = NaN

    if (!token) {
      return NextResponse.json(
        {error: 'Missing quote'},
        {status: 400}
      )
    }
    let order = await getExistingPurchaseOrder(token)
    if (order == null  || order.id == null) {
      return NextResponse.json(
        {error: "Non existing order"},
        {status: 200}
      )
    }
    let quote = await getExistingPurchaseQuote(token)
    if (quote == null) {
      return NextResponse.json(
        {error: "Non existing quote"},
        {status: 200}
      )
    }
    let state = order.state
    secondsRemaining = Date.now() - (quote.timestamp + order.seconds)
    if (secondsRemaining > 0) {
      secondsRemaining = NaN
      state = await updatePurchaseOrder(
        order.id, "expired", "", Date.now()
      )
    }

    return NextResponse.json(
      {state: state, secondsRemaining: seconds},
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
