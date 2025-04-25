import { NextResponse } from 'next/server'

import { getQuoteToBuy } from '@/services/sle'

export async function GET(req: NextApiRequest, res: NextApiResponse) {
    const { searchParams } = req.nextUrl
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
    } else {
      //Validate wallet and phone should be of a KYC user
      const quote = await getQuoteToBuy(wallet, phone)
      return NextResponse.json(
        quote,
        {status: 200}
      )
    }
}
