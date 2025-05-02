import { drizzle } from 'drizzle-orm/node-postgres';
import { count, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server'
import { testcountTable } from '@/db/schema';

import { ethers } from 'ethers'
import 'dotenv/config'
import ERC20_ABI from 'erc-20-abi' assert { type: 'json' }

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

    if (counter > 0) {
      // Transfer to wallet of user
      let destAddress = counters[0]['lastAddress']

      console.log("RPC_URL=", process.env.RPC_URL)
      const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
      if (process.env.PRIVATE_KEY == undefined) {
        process.exit(1);
      }
      const signer =  new ethers.Wallet(process.env.PRIVATE_KEY, provider)

      const usdcAddress = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B" // https://jordanmuthemba.medium.com/a-step-by-step-guide-to-t usdcAddress = "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B"ransferring-circles-usdc-tokens-on-celo-s-alfajores-testnet-8098e8f8f54c

      console.log("signer.address=", signer.address)

      const usdcContract = new ethers.Contract(usdcAddress, ERC20_ABI, signer)
      console.log("usdcContract.target=", usdcContract.target)
      const dataBalance = await usdcContract.balanceOf(signer.address)
      console.log("dataBalance=", dataBalance)
      const formattedBalance = +ethers.formatUnits(dataBalance, 6)
      console.log("formattedBalance=", formattedBalance)

      if (formattedBalance < 0.2) {
        throw new Error("Insufficient USDC balance.");
      }
      console.log(`The balance of the sender (${signer.address}) is: ${formattedBalance} USDC`);

      const usdcAmount = ethers.parseUnits('0.1', 6)

      const pop = await usdcContract.transfer.populateTransaction(
        destAddress, usdcAmount
      )

      const transactionResponse = await signer.sendTransaction(pop)
      console.log(`Approval Sent: ${transactionResponse.hash}`) 
      const receipt = await transactionResponse.wait() 
      const transactionUrl = `${process.env.EXPLORER_TX}${receipt?.hash}`
      console.log(`Approval Confirmed!$ ${transactionUrl}`)


      // If they are succeed if not fail
      return NextResponse.json(
        {
          state: counter == 0 ? "pending" : "paid",
          transactionUrl: counter == 0 ? "" : transactionUrl
        },
        {status: 200}
      )
    }
  }
}
