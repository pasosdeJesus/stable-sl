'use client'

import axios from 'axios'
import {ArrowLeft, RefreshCw} from "lucide-react"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';

import { useWeb3 } from "@/contexts/useWeb3";

interface WaitingUserPaymentProps {
    searchParams: { 
      quoteId: string
      secondsToWait: integer
      amountSle: number
      phoneNumberToPay: string
      nameOfReceiver: string
      amountUsd: number
      wallet: string
    };
}

const WaitingUserPaymentPage: FC<WaitingUserPaymentProps> = ({ searchParams }) => {
  const { 
    quoteId, 
    secondsToWait, 
    amountSle, 
    phoneNumberToPay, 
    nameOfReceiver,
    amountUsd,
    wallet,
  } = searchParams;

  const [countdown, setCountdown] = useState(secondsToWait)

  useEffect(() => {
    getUserAddress()
    if (countdown > 0) {
      console.log("useEffect maybe after countdown decreased?")
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      debugger
    }
  }, [countdown])


  const fetchQuoteToBuy = async () => {
    try {
     if (address && phoneNumber) {
       const apiQuoteToBuyUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/status_buy?id=${quoteId}`
        axios.get(apiQuoteToBuyUrl)
        .then(response => {
          if (response.data) {
            let data = response.data
            debugger
          }
        })
      }
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Stable-SL</CardTitle>
          <CardDescription>
            <p>Buying USD in Sierra Leone</p>
            <p>Waiting for your payment {countdown} seconds</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        </CardContent>
      </Card>
    </div>
  )
}
