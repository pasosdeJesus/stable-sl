import { NextRequest, NextResponse } from 'next/server'

import { getQuoteToBuy } from '@/services/sle'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const buyerName = searchParams.get("buyerName")
    const wallet = searchParams.get("wallet")
    const phone = searchParams.get("phone")

    if (!wallet) {
      return NextResponse.json(
        {error: 'Missing wallet'},
        {status: 400}
      )
    } else if (!phone) {
      return NextResponse.json(
        {error: 'Missing phone'},
        {status: 400}
      )
    } else if (!buyerName) {
      return NextResponse.json(
        {error: 'Missing buyer\'s name'},
        {status: 400}
      )
    } else {
      //Validate wallet and phone should be of a KYC user
      const quote = await getQuoteToBuy(buyerName, wallet, phone)
      return NextResponse.json(
        quote,
        {status: 200}
      )
    }
}
