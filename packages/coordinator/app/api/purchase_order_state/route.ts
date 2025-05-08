import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'

import { 
  getExistingPurchaseOrder,
  getExistingPurchaseQuote,
  updateExpiredPurchaseOrders,
  updatePurchaseOrder,
} from '@/services/sle';

export async function GET(req: NextRequest) {
  try {
    console.log("OJO GET of purchase_order_state")
    await updateExpiredPurchaseOrders()
    const { searchParams } = req.nextUrl
    const token = searchParams.get("token")
    console.log("OJO token=", token)
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
    console.log("OJO order.id=", order.id)
    let quote = await getExistingPurchaseQuote(token)
    if (quote == null) {
      return NextResponse.json(
        {error: "Non existing quote"},
        {status: 200}
      )
    }
    console.log("OJO quote.id=", quote.id)
    let state = order.state
    console.log("OJO state", state)
    secondsRemaining = (quote.timestamp + order.seconds*1000) - Date.now()
    console.log("OJO secondsRemaining", secondsRemaining)
    let transactionUrl = order.transactionUrl

    console.log(
      "OJO retornando state=", state, 
      " seconsRemainging=", secondsRemaining,
      " transactionUrl=", transactionUrl
    )
    return NextResponse.json(
      {
        state: state, 
        transactionUrl: transactionUrl, 
        secondsRemaining: secondsRemaining
      },
      {status: 200}
    )
  }
  catch (error) {
    console.log("OJO error=", error)
    return NextResponse.json(
      {error: error},
      {status: 400}
    )
  }

}
