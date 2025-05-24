import {
  Address,
  encodeFunctionData,
  getContract,
  createWalletClient,
  formatEther,
  formatUnits,
  http,
  parseEther,
  parseUnits,
  publicActions,
} from "viem";
import { privateKeyToAccount } from "viem/accounts"; 
import { celo, celoAlfajores } from "viem/chains";
import 'dotenv/config'
import { NextRequest, NextResponse } from 'next/server'

import {
  addSmsLog,
  extractInfoSms,
  getExistingPurchaseOrder,
  getExistingPurchaseQuote,
  searchPendingPurchaseOrderBySms,
  updatePurchaseOrder
} from '@/services/sle';

import {
  getUsdBalance,
  getCryptoParams,
  transferUsd
} from '@/services/scrypto';


async function cancelAndRespond(
  orderId: number, reason: string, timestamp: number
) {
  await updatePurchaseOrder(orderId, "cancelled", reason, timestamp)
  return NextResponse.json(
    {error: reason},
    {status: 400}
  )
}

export async function GET(req: NextRequest) {
  return NextResponse.json(
    {error: "Expecting POST request"},
    {status: 400}
  )
}

export async function POST(req: NextRequest) {
  console.log("OJO starting POST")
  try {
    const timestamp = Date.now()
    console.log("OJO timestamp=", timestamp)
    const requestJson = await req.json()
    console.log("OJO request.json()=", requestJson)
    const sender = requestJson['sender'] ?? ''
    console.log('OJO sender =', sender)
    const msg = requestJson['msg'] ?? ''
    console.log('OJO msg =', msg)

    /*if (!sender) {
      return NextResponse.json(
        {error: 'Missing number'},
        {status: 400}
      )
    } */
    if (!msg || msg == "") {
      return NextResponse.json(
        {error: 'Missing message'},
        {status: 400}
      )
    }
    let ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    if (!ip && req.headers.get('x-forwarded-for')) {
      ip = String(req.headers.get('x-forwarded-for')?.split(',').at(0));
    }
    console.log('OJO ip=', ip)
    await addSmsLog(timestamp, String(ip), sender, msg)
    let isms = extractInfoSms(msg)
    console.log('OJO isms=', isms)
    if (isms != null && sender == "OrangeMoney") {
      console.log(`OJO buscando from ${isms['from']}`)
      let order = await searchPendingPurchaseOrderBySms(isms['from'])
      console.log('OJO order=', order)
      if (order && order.id) {
        if (isms.amount >= order.amountSle) {
          updatePurchaseOrder(order.id, "received", String(msg), timestamp)
        } else {
          return cancelAndRespond(
            order.id, `Received ${isms.amount} that is` + 
              `less than expected ${order.amountSle}`, 
            timestamp
          )
        }
        // Transfer to wallet of user
        let quote = await getExistingPurchaseQuote(order.token)
        if (quote == null) {
          return cancelAndRespond(order.id, "Quote not found", timestamp)
        }
        let destAddress = quote.senderWallet as Address


        // Convert the private key to an account object
        if (process.env.PRIVATE_KEY == undefined || 
           process.env.PRIVATE_KEY.slice(0,2) != '0x') {
          return cancelAndRespond(order.id, "Missing private key", timestamp)
        }
        const account = privateKeyToAccount(process.env.PRIVATE_KEY as Address)
        let myAddress, blockchain, rpcUrl, usdAddress, usdDecimals
 
        try {
          [ 
            myAddress, blockchain, rpcUrl, usdAddress, usdDecimals 
          ] = await getCryptoParams()
        } catch (error: any) {
          return cancelAndRespond(order.id, error.toString(), timestamp)
        }

        // Create a wallet client with the specified account, chain, and HTTP transport
        const walletClient = createWalletClient({
          account,
          chain: blockchain,
          transport: http(rpcUrl),
        }).extend(publicActions);

        const balance = await getUsdBalance(
          usdAddress, usdDecimals, walletClient, myAddress
        )

        if (balance < order.amountUsd) {
          return cancelAndRespond(
            order.id, 
            `Insufficient USD balance: ${balance}, needed: ${order.amountUsd}`,
            timestamp
          )
        }
        console.log(`My balance is: ${balance} USD`);

        const transactionUrl = await transferUsd(
          myAddress, account, 
          usdAddress, usdDecimals, 
          walletClient, destAddress,
          order.amountUsd
        )
        console.log(`Transfer confirmed: ${transactionUrl}`)
        let state = await updatePurchaseOrder(
          order.id, "paid", transactionUrl, Date.now()
        )
        console.log("OJO state=", state)

        return NextResponse.json(
          {thanks: "Thanks. Payment processed"},
          {status: 200}
        )
      }
      return NextResponse.json(
        {problem: "Couldn't identify the order. Please contact support team"},
        {status: 200}
      )
    }
    return NextResponse.json(
      {thanks: "Thanks. Order not completed"},
      {status: 200}
    )
  } catch (error:any) {
    let ret:string = "error"
    if (typeof error == "string") {
      ret = error
    } else if (error != null && error.hasOwnProperty("message")) {
      console.log("OJO error.message")
      ret = error.message ?? "error"
    } else {
      console.log("OJO typeof error=", typeof error)
      console.log("OJO error=", error)
      ret = JSON.stringify(error)
    }
    console.log("OJO sms_received enviando error:", ret, typeof ret)
    return NextResponse.json(
      {error: ret},
      {status: 400}
    )
  }
}
