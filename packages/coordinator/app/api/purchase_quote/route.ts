import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'

import { 
  getPurchaseQuote,
  searchPendingPurchaseOrderBySms,
  updateExpiredPurchaseOrders
} from '@/services/sle'

export async function GET(req: NextRequest) {

  try {
    await updateExpiredPurchaseOrders()
    const { searchParams } = req.nextUrl
    const token= searchParams.get("token")
    const buyerName = searchParams.get("buyerName")
    const wallet = searchParams.get("wallet")
    const phone = searchParams.get("phone")

    if (!wallet) {
      return NextResponse.json(
        {error: 'Missing wallet'},
        {status: 400}
      )
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      return NextResponse.json(
        {error: 'Wallet with wrong format'},
        {status: 400}
      )
    } else if (!phone) {
      return NextResponse.json(
        {error: 'Missing phone'},
        {status: 400}
      )
    } else if (!/^0[0-9]{8}$/.test(phone)) {
      return NextResponse.json(
        {error: 'Phone with wrong format'},
        {status: 400}
      )
    } else if (!buyerName || buyerName == "") {
      return NextResponse.json(
        {error: 'Missing buyer\'s name'},
        {status: 400}
      )
    } else if  (await searchPendingPurchaseOrderBySms(phone) != null) {
      return NextResponse.json(
        {error: `There is a pending order from the phone number ${phone}`},
        {status: 400}
      )
    } else {
      //Validate wallet and phone should be of a KYC user
      const q = await getPurchaseQuote(String(token), buyerName, wallet, phone)
      console.log(q)

      delete q.id
      return NextResponse.json(
        q,
        {status: 200}
      )
    }
  } catch (error) {
    console.error("Excepción error=", error)
    return NextResponse.json(
      {error: error},
      {status: 500}
    )
  }

}
