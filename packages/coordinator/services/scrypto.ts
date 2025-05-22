import { stableTokenABI }  from '@celo/abis'
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk'
import {
  Address,
  encodeFunctionData,
  getContract,
  formatUnits,
  parseUnits,
} from "viem";
import { celo, celoAlfajores } from 'viem/chains'


// Returns USD balance
export async function getUsdBalance(
  usdAddress: Address, usdDecimals: number, client:any, address: Address
) {

  const preBalance = Number(
    await client.readContract({
      abi: stableTokenABI,
      address: usdAddress,
      functionName: 'balanceOf',
      args: [address],
    })
  )
  const balance = formatUnits(BigInt(preBalance), usdDecimals)

  return +balance
}

// Initialization
export async function getCryptoParams() {
  if (process.env.PUBLIC_ADDRESS == undefined) {
    throw new Error("Missing env. var PUBLIC_ADDRESS")
  }
  const myAddress = process.env.PUBLIC_ADDRESS as Address
  console.log("myAddress=", myAddress)

  if (process.env.RPC_URL == undefined) {
    throw new Error("Missing env. var RPC_URL")
  }
  const rpcUrl = process.env.RPC_URL
  let blockchain:any = celo
  if (process.env.RPC_URL.includes('alfajores')) {
    blockchain = celoAlfajores
  }
  if (process.env.USD_CONTRACT == undefined || 
      process.env.USD_CONTRACT.slice(0,2) != '0x') {
    throw new Error("Missing env. var USD_CONTRACT")
  }
  const usdAddress = process.env.USD_CONTRACT as Address
  if (process.env.USD_DECIMALS == undefined) {
    throw new Error("Missing env. var USD_DECIMALS")
  }
  const usdDecimals = +process.env.USD_DECIMALS
  return [myAddress, blockchain, rpcUrl, usdAddress, usdDecimals]
}


// 
export async function transferUsd(
  myAddress: Address,
  account:any,
  usdAddress: Address,
  usdDecimals: number,
  walletClient:any,
  address: Address,
  amount: number
) {
  const usdContract = getContract({
    address: usdAddress,
    abi: stableTokenABI,
    client: walletClient,
  });
  console.log("usdContract=", usdContract)

  const usdAmount = parseUnits(amount.toString(), usdDecimals)
  console.log("usdAmount in units=", usdAmount)

  const encodedData = encodeFunctionData({
    abi: stableTokenABI,
    functionName: 'transfer',
    args: [address, usdAmount],
  })
  console.log("encodedData=", encodedData)

  const dataSuffix = getDataSuffix({
    consumer: myAddress,
    providers: [
      '0x0423189886d7966f0dd7e7d256898daeee625dca',
      '0xc95876688026be9d6fa7a7c33328bd013effa2bb',
      '0x5f0a55fad9424ac99429f635dfb9bf20c3360ab8'
    ],
  })
  console.log("dataSuffix=", dataSuffix)

  let txData = encodedData
  if (txData && txData.length >= 10) {
    txData += dataSuffix
  }
  console.log("txData=", txData)
  const hash = await walletClient.sendTransaction({
    account,
    to: usdContract.address,
    data: txData,
  });
  console.log("hash=", hash)

  const receipt = await walletClient.waitForTransactionReceipt({hash});
  console.log("receipt=", receipt)
  const transactionUrl = `${process.env.EXPLORER_TX}${receipt?.transactionHash}`;

  console.log(transactionUrl)

  const chainId = await walletClient.getChainId()
  console.log("chainId=", chainId)

  if (chainId == 42220) { // Celo mainnet
    const sr = await submitReferral({
      txHash: hash,
      chainId: chainId,
    })

    console.log("sr=", sr)
  }

  return transactionUrl
}

