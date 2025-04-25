'use client'

import axios from 'axios'
import {ArrowLeft, RefreshCw} from "lucide-react"
import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWeb3 } from "@/contexts/useWeb3";

export default function Home() {
  const {
    address,
    getShortAddress,
    getUserAddress,
    sendCUSD,
    mintMinipayNFT,
    getNFTs,
    signTransaction,
  } = useWeb3();
  const [quoteId, setQuoteId] = useState("")
  const [quoteTimestamp, setQuoteTimestamp] = useState(0)
  const [quoteUsdPriceInSle, setQuoteUsdPriceInSle] = useState(0.0)
  const [quoteMinimum, setQuoteMinimum] = useState(0)
  const [quoteMaximum, setQuoteMaximum] = useState(0)
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [amountUsd, setAmountUsd] = useState(0.0)
  const [countdown, setCountdown] = useState(0)

  useEffect(() => {
    getUserAddress()
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)

      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      // Reset the timer after a short delay
      setTimeout(() => {
        fetchQuoteToBuy()
        setCountdown(10)
      }, 1000) // 1 second delay before resetting
    }
  }, [countdown])


  const fetchQuoteToBuy = async () => {
    try {
     if (address && phoneNumber) {
       const apiQuoteToBuyUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/quote_to_buy?wallet=${address}&phone=${phoneNumber}`
        axios.get(apiQuoteToBuyUrl)
        .then(response => {
          if (response.data) {
            let data = response.data
            if (data.id !== undefined &&
                data.timestamp !== undefined &&
                  data.usdPriceInSle !== undefined &&
                    data.minimum !== undefined &&
                      data.maximum !== undefined
               ) {
                 setQuoteId(data.id)
                 setQuoteTimestamp(data.timestamp)
                 setQuoteUsdPriceInSle(data.usdPriceInSle)
                 setQuoteMinimum(data.minimum)
                 setQuoteMaximum(data.maximum)
  
                 if (amount && parseFloat(amount)>0) {
                   setAmountUsd(
                     calculateAmountUsd(parseFloat(amount), data.usdPriceInSle)
                   )
                 }
               } else {
                 console.error('Invalid data format from API:', data)
               }
  
               let rcurso = response.data[0]
               console.log(rcurso)
          }
        })
      }
    } catch (error) {
      console.error('Error fetching quote:', error)
    }
  }

  const calculateAmountUsd = (sle: number, slePerUsd: number) => {
    return slePerUsd && slePerUsd > 0 && sle && sle > 0 ?
      Math.round(sle*100.0/slePerUsd)/100.0 : 0
  }

  const handleNext = () => {
    switch (step) {
      case 1:
        if (phoneNumber && /^0\d{8}$/.test(phoneNumber) && address) {
          setStep(2)
        } else if (!address) {
          alert('Please connect your wallet')
        } else {
          alert('Phone number should have 9 digits and start with 0')
        }
      break
      case 2:
        if (+amount < quoteMinimum) {
          alert('Amount should be greather than lower limit')
        } else if (+quoteMaximum == 0) {
          alert('Seems there is a problem with backend, try again later')
        } else if (+amount > quoteMaximum) {
          alert('Amount should be less than upper limit')
        } else if (amount && parseFloat(amount) > 0) {
          setStep(3)
        } else {
          alert('Please enter valid values.')
        }
        break
      default:
        alert('Please enter valid values.')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleConfirm = () => {
    
    alert(`Collecting $${amount}SLE from ${phoneNumber}`)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Stable-SL</CardTitle>
          <CardDescription>
            <p>Buying USD in Sierra Leone</p>
            <p>Step {step} of 3</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Phone Number with Orange Money</label>
              <Input
                id="phoneNumber"
                type="tel"
                placeholder="Sierra Leone number e.g 075232442"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-label="Phone Number"
              />
              <p>Your wallet address: {address ? getShortAddress() : "Please connect your wallet"}</p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount of SLE ot pay</label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                min={quoteMinimum}
                max={quoteMaximum}
                onChange={(e) => {
                  setAmount(e.target.value)
                  setAmountUsd(
                    calculateAmountUsd(parseFloat(e.target.value),
                                       quoteUsdPriceInSle)
                  )
                } }
                aria-label="Amount of SLE"
              />
              <p className="text-sm text-gray-500">
                Amount of USD to receive: {amountUsd} USD
              </p>
              <p className="text-sm text-gray-500">
                Price of one USD: {quoteUsdPriceInSle} SLE
              </p>
              <p className="text-sm text-gray-500">
                Order limits in SLE: {quoteMinimum} - {quoteMaximum}
              </p>
              <div className="flex text-sm text-gray-500">
                <span>Seconds to update:&nbsp; </span>
                  {countdown == 10 && (<span>{countdown}</span>)}
                  {countdown > 0 && countdown < 10 && (<span>&nbsp;{countdown}</span>)}
                  { countdown == 0 &&
                    <span className="">
                      <RefreshCw className="animate-spin size-4 text-primary"/>
                    </span>
                  }
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-2">
              <p className="text-2xl">Please confirm the details below:</p>
              <p>Phone Number with Orange Money: {phoneNumber}</p>
              <p>Amount in SLE to spend: SLE${amount}</p>
              <p>Your wallet address: {getShortAddress()}</p>
              <p>Amount of USD to receive: US${amountUsd}</p>
              <p>Amount within limits: {+amount >= quoteMinimum &&
                +amount <= quoteMaximum ? "Yes" : "No -- please go back"}</p>
              <p>Timestamp of quote: {quoteTimestamp}</p>
            </div>
          )}

          <div className={`flex ${step > 1 ? 'justify-between' : 'justify-end'}` }>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            ) : (
              <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <span>Confirm (</span>
                  { countdown > 0 && (<span>{countdown}</span>)}
                  { countdown == 0 &&
                    <span><RefreshCw className="animate-spin size-4 text-primary"/></span>
                  }
                  <span>)</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
