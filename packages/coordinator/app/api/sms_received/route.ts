import 'dotenv/config'
import { ethers } from 'ethers'
import ERC20_ABI from 'erc-20-abi' assert { type: 'json' }
import { NextRequest, NextResponse } from 'next/server'

import {
  addSmsLog,
  extractInfoSms,
  getExistingPurchaseOrder,
  getExistingPurchaseQuote,
  searchPendingPurchaseOrderBySms,
  updatePurchaseOrder
} from '@/services/sle';


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
  console.log("OJO inicio GET inesperado")
}

export async function POST(req: NextRequest) {
  console.log("OJO inicio POST")
  try {
    const timestamp = Date.now()
    console.log("OJO timestamp=", timestamp)
    const requestJson = await req.json()
    console.log("OJO request.json()=", requestJson)
    const sender = requestJson['sender'] ?? ''
    const msg = requestJson['msg'] ?? ''
    console.log('OJO sender =', sender)
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
    if (isms != null && isms.from == sender) {
      let order = await searchPendingPurchaseOrderBySms(sender)
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
        let destAddress = quote.senderWallet

        console.log("RPC_URL=", process.env.RPC_URL)
        const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)
        if (process.env.PRIVATE_KEY == undefined) {
          return cancelAndRespond(order.id, "Missing private key", timestamp)
        }
        const signer =  new ethers.Wallet(process.env.PRIVATE_KEY, provider)

        if (process.env.USD_CONTRACT == undefined) {
          return cancelAndRespond(order.id, "Missing [USD] contract", timestamp)
        }
        const usdAddress = process.env.USD_CONTRACT
        if (process.env.USD_DECIMALS == undefined) {
          return cancelAndRespond(order.id, "Missing [USD] decimals", timestamp)
        }
        const usdDecimals = +process.env.USD_DECIMALS


        console.log("signer.address=", signer.address)

        const usdContract = new ethers.Contract(usdAddress, ERC20_ABI, signer)
        console.log("usdContract.target=", usdContract.target)
        const dataBalance = await usdContract.balanceOf(signer.address)
        console.log("dataBalance=", dataBalance)
        const formattedBalance = +ethers.formatUnits(dataBalance, usdDecimals)
        console.log("formattedBalance=", formattedBalance)

        if (formattedBalance < 0.2) {
          return cancelAndRespond(
            order.id, "Insufficiente [USD] balance", timestamp
          )
        }
        console.log(`The balance of the sender (${signer.address}) is: ${formattedBalance} USD`);

        const usdAmount = ethers.parseUnits('0.1', usdDecimals)

        const pop = await usdContract.transfer.populateTransaction(
          destAddress, usdAmount
        )

        const transactionResponse = await signer.sendTransaction(pop)
        console.log(`Approval Sent: ${transactionResponse.hash}`)
        const receipt = await transactionResponse.wait()
        const transactionUrl = `${process.env.EXPLORER_TX}${receipt?.hash}`
        console.log(`Approval Confirmed!$ ${transactionUrl}`)
        let state = await updatePurchaseOrder(order.id, "paid", transactionUrl, Date.now())
        console.log("OJO state=", state)

        return NextResponse.json(
          {thanks: "thanks, payment processed"},
          {status: 200}
        )
      }
      return NextResponse.json(
        {problem: "Problem. We couldn't identify the order. Please contact support team"},
        {status: 200}
      )

    }
    return NextResponse.json(
      {thanks: "Thanks"},
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
