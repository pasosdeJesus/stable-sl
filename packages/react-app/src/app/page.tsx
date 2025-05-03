'use client'

import axios from 'axios'
import {ArrowLeft, RefreshCw} from "lucide-react"
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';

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
  const [buyerName, setBuyerName] = useState('')
  const [amountUsd, setAmountUsd] = useState(0.0)
  const [countdown, setCountdown] = useState(0)
  const [secondsWaitingPayment, setSecondsWaitingPayment] = useState(0)
  const [phoneNumberToPay, setPhoneNumberToPay] = useState("")
  const [nameOfReceiver, setNameOfReceiver] = useState("")
  const [transactionUrl, setTransactionUrl] = useState("")

  useEffect(() => {
    getUserAddress()
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
        if (step == 4) {
          setSecondsWaitingPayment(secondsWaitingPayment - 1)
          if (secondsWaitingPayment <= 0) {
            setStep(6)
          }
        }
      }, 1000)
      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      // Reset the timer after a short delay
      switch (step) {
        case 1:
        case 2:
        case 3:
          setTimeout(() => {
            fetchQuoteToBuy()
            setCountdown(10)
          }, 1000) // 1 second delay
          break
        case 4:
          setTimeout(() => {
            fetchOrderState()
            setCountdown(10)
          }, 1000) // 1 second delay
          break
        default:
          break
      }
    }
  }, [countdown])

  const isAlfajores = () => (typeof ethereum != "undefined") && 
    ethereum.networkVersion === '44787'

  const fetchQuoteToBuy = async () => {
    try {
     if (address && phoneNumber && buyerName) {
       const apiQuoteToBuyUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/quote_to_buy?wallet=${address}&phone=${phoneNumber}&buyerName=${buyerName}`
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

  const secondsAsMinutes = (seconds: number):String => {
    return `${Math.floor(seconds / 60)}:${seconds % 60}`
  }

  const handleNext = () => {
    switch (step) {
      case 1:
        if (phoneNumber && /^0\d{8}$/.test(phoneNumber) && address && buyerName) {
          fetchQuoteToBuy()
          setStep(2)
        } else if (!address) {
          alert('Please connect your wallet')
        } else if (!buyerName) {
          alert('Please provide name linked to Orange Money')
        } else {
          alert('Phone number should have 9 digits and start with 0')
        }
      break
      case 2:
        if (+amount < quoteMinimum) {
          alert('Amount should be greather than lower limit')
        } else if (+quoteMaximum == 0) {
          alert('Seems there is a problem with the backend, try again later')
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

  const copyTestPhone = async () => {
    try {
      const inputField = document.getElementById('testPhone') as HTMLInputElement;
      await navigator.clipboard.writeText(inputField.value);
      console.log('Text copied to clipboard successfully!');
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  }

  const handleConfirm = () => {
    try {
      const apiOrderToBuyUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/order_to_buy?quoteId=${quoteId}`
      axios.get(apiOrderToBuyUrl)
      .then(response => {
        if (response.data) {
          let data = response.data
          if (data.quoteId !== undefined &&
            data.seconds !== undefined &&
            data.amountSle !== undefined &&
            data.amountUsd !== undefined &&
            data.phoneNumberToPay !== undefined &&
            data.nameOfReceiver !== undefined
           ) {
             /* TODO: if (data.quoteId !== quoteId ||
                 data.amountSle !== amount ||
                   data.amountUsd !== amountUsd) {
               alert("Mismatch in information of this app and coordinator")
             } else { */
             setSecondsWaitingPayment(data.seconds)
             setPhoneNumberToPay(data.phoneNumberToPay)
             setNameOfReceiver(data.nameOfReceiver)
             setStep(4)
           }
           else {
            alert('Insufficient information to make order')
           }
        }
      })
    } catch (error) {
     alert('Error making order:' + error)
    }
  }

  const handleSupposePaid = () => {
    document.getElementById('suppose-I-paid').disabled = true;
    try {
      const apiGwPaymentReceivedUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/gw_payment_received?phone=012345678&amountSle=${amount}`
      axios.get(apiGwPaymentReceivedUrl)
      .then(response => {
        if (response.data) {
          let data = response.data
          if (data.quoteId !== undefined &&
              data.amountSle !== undefined &&
              data.senderPhone !== undefined &&
              data.senderName !== undefined
          ) {
            console.log("quoteId=", data.quoteId)
            console.log("amountSle=", data.amountSle)
            console.log("senderPhone=", data.senderPhone)
            console.log("senderName=", data.senderName)
          } else {
            alert('Received information is incomplete supposing payment')
          }
        } else {
            alert('No data in response')
        }
      })
    } catch (error) {
      alert('Error supposing payment:' + error)
    }

  }


  const handleReceipt = () => {

  }

  const fetchOrderState = async () => {
    try {
     if (quoteId) {
       const apiBuyOrderStateUrl= process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/buy_order_state?quoteId=${quoteId}`
        axios.get(apiBuyOrderStateUrl)
        .then(response => {
          if (response.data) {
            let data = response.data
            if (data.state !== undefined) {
              switch (data.state) {
               case "pending":
                 break
               case "timeout":
                 setStep(6)
                 break
               case "paid":
                 setTransactionUrl(data.transactionUrl)
                 setStep(5)
              }
            } else {
              alert("Response from coordinator service doesn't include state")
            }
          } else {
              alert("No response from coordinator service")
          }
        })
      }
    } catch (error) {
      console.error('Error fetching status from coordinator service:', error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-md p-4 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Stable-SL</CardTitle>
          <CardDescription>
            <p>Buying USD in Sierra Leone</p>
            <p>Step {step} of 5</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <div className="space-y-2">
              {address && isAlfajores() &&
                <p className="text-sm">
                  Your wallet address: {getShortAddress()}
                </p>
              }
              <label htmlFor="phoneNumber" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Phone Number with Orange Money
              {isAlfajores() &&
                <div className="flex items-center text-sm">
                  Test with &nbsp;
                  <div className="bg-gray-50">
                    012456789 &nbsp;
                    <Input style={{display: "none"}} id="testPhone" value="012345478" disabled />
                    <Button
                      className="btn btn-sm bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={copyTestPhone}>Copy</Button>
                   </div>
                </div>
              }
              </label>
              <Input
                id="phoneNumber"
                type="tel"
                maxlengt=14
                placeholder="Sierra Leone number e.g 075232442"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-label="Phone Number"
              />
              <label htmlFor="buyerName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name linked to Orange Money
              </label>
               <Input
                id="buyerName"
                value={buyerName}
                maxlengt=80
                onChange={(e) => setBuyerName(e.target.value)}
                aria-label="Name linked to Orange Money"
              />

              {!address &&
                <p>Please connect your wallet</p>
              }
            </div>
          )}

          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="amount" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount of SLE to pay</label>
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
              <p className="text-sm">Phone Number with Orange Money: {phoneNumber}</p>
              <p className="text-sm">Amount in SLE to spend: SLE${amount}</p>
              <p className="text-sm">Amount of USD to receive: US${amountUsd}</p>
              <p className="text-sm">Amount within limits: {+amount >= quoteMinimum &&
                +amount <= quoteMaximum ? "Yes" : "No -- please go back"}</p>
              {isAlfajores() &&
                <div>
                  <p className="text-sm">Timestamp of quote: {quoteTimestamp}</p>
                  <p className="text-sm">Your wallet address: {getShortAddress()}</p>
                </div>
              }
            </div>
          )}

          {step == 4 &&
            <div className="space-y-2">
              <p className="text-sm">Waiting for your payment: {secondsAsMinutes(secondsWaitingPayment)}</p>
              <p className="text-sm">Pay {amount}SLE to the phone {phoneNumberToPay} with the name {nameOfReceiver}</p>
            </div>
          }
          {step == 5 &&
            <div className="space-y-2">
              <p className="text-sm">Thanks for the payment. We transfered {amountUsd}USD to your wallet.</p>
              <p className="text-sm">If you need contact our support team.</p>
            </div>
          }
          {step == 6 &&
            <div className="space-y-2">
              <p className="text-sm">stable-sl didn't receive your payment. Order cancelled</p>
              <p className="text-sm">If you need contact our support team.</p>
            </div>
          }


          <div className={`flex ${step > 1 ? 'justify-between' : 'justify-end'}` }>
            {step > 1 && step <= 3 && (
              <Button variant="outline" onClick={handleBack} className="mr-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {step < 3 &&
              <Button onClick={handleNext} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Next
              </Button>
            }
            { step == 3 &&
              <Button onClick={handleConfirm} className="bg-primary text-primary-foreground hover:bg-primary/90">
                <span>Confirm (</span>
                  { countdown > 0 && (<span>{countdown}</span>)}
                  { countdown == 0 &&
                    <span><RefreshCw className="animate-spin size-4 text-primary"/></span>
                  }
                  <span>)</span>
              </Button>
            }
            { step == 4 && isAlfajores() &&
              <Button id="suppose-I-paid" onClick={handleSupposePaid} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Suppose I paid
              </Button>
            }

            { step == 5 &&
              <a className="bg-primary text-primary-foreground hover:bg-primary/90 btn btn-sm" href={transactionUrl} target="_blank">Transaction Receipt</a>
            }

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
