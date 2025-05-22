import { stableTokenABI }  from '@celo/abis'
import { getDataSuffix, submitReferral } from '@divvi/referral-sdk'
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
  writeContract,
} from "viem";


// Function to check the USDT balance
export async function getUsdBalance(
  usdAddress: Address, usdDecimals: number, walletClient, address: Address
) {

  const preBalance = Number(
    await walletClient.readContract({
      abi: stableTokenABI,
      address: usdAddress,
      functionName: 'balanceOf',
      args: [address],
    })
  )
  const balance = formatUnits(BigInt(preBalance), usdDecimals)

  return +balance
}


export async function transferUsd(
  myAddress: Address,
  usdAddress: Address,
  usdDecimals: number,
  walletClient,
  address:String,
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

  const receipt = await walletClient.waitForTransactionReceipt({hash});
  console.log("receipt=", receipt)
  const transactionUrl = `${process.env.EXPLORER_TX}${receipt?.transactionHash}`;

  console.log(transactionUrl)

  const chainId = await walletClient.getChainId()
  console.log("hash=", hash)
  console.log("chainId=", chainId)

  const sr = await submitReferral({
    txHash: hash,
    chainId: chainId,
  })

  console.log("sr=", sr)

  return transactionUrl
}

