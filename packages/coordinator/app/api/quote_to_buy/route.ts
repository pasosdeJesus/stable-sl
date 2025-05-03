import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'

import { testcountTable } from '@/db/schema';
import { getQuoteToBuy } from '@/services/sle'

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl
    const quoteId = searchParams.get("quoteId")
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
    } else {
      try {
        //Validate wallet and phone should be of a KYC user
        const quote = await getQuoteToBuy(String(quoteId), buyerName, wallet, phone)
        console.log(quote)

        const db = drizzle(process.env.DATABASE_URL!);
        const regs = await db.select({ count: count() }).from(testcountTable);
        console.log('regs=', regs)
        if (regs[0].count == 0) {
          const count1: typeof testcountTable.$inferInsert = {
            count: 0
          }
          await db.insert(testcountTable).values(count1);
        }

        await db.update(testcountTable).set({
          lastAddress: wallet
        }).where(eq(
          testcountTable.id, 1
        ));

        return NextResponse.json(
          quote,
          {status: 200}
        )
      } catch (error) {
        return NextResponse.json(
          {error: error},
          {status: 500}
        )
      }
    }
}
