import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'
import { testcountTable } from '@/db/schema';
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
      const db = drizzle(process.env.DATABASE_URL!);
      const regs = await db.select({ count: count() }).from(testcountTable);
      console.log('regs=', regs)
      if (regs[0].count == 0) {
        const count1: typeof testcountTable.$inferInsert = {
              count: 0
        }
        await db.insert(testcountTable).values(count1);
      }
      const counters = await db.select().from(testcountTable).where(eq(testcountTable.id, 1))
      let counter = counters[0]['count']
      counter++

      await db.update(testcountTable).set({
        count: counter
      }).where(eq(
        testcountTable.id, 1
      ));

      console.log("counter=", counter)
      // Confirm that the values of the quote are deliverable

      // If they are succeed if not fail
      return NextResponse.json(
        {
          state: counter == 0 ? "pending" : "paid",
          transactionUrl: counter == 0 ? "" : "x"
        },
        {status: 200}
      )
    }
}
