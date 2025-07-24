'use client'

import axios from 'axios'
import {ArrowLeft, CheckCircle, RefreshCw, Shield} from "lucide-react"
import { useEffect, useState} from 'react'
import { useAccount } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'

import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


export default function Page() {

  const cryptoName = {
    "usdt": "USDT",
    "gooddollar": "GoodDollar",
  }
  const cryptoSymbol = {
    "usdt": "USDT",
    "gooddollar": "G$",
  }

  const { address, chainId } = useAccount()

  const [quoteToken, setQuoteToken] = useState("")
  const [quoteTimestamp, setQuoteTimestamp] = useState(0)
  const [quoteCrypto, setQuoteCrypto] = useState("usdt")
  const [quoteCryptoPriceInSle, setQuoteCryptoPriceInSle] = useState(0.0)
  const [quoteMinimum, setQuoteMinimum] = useState(0)
  const [quoteMaximum, setQuoteMaximum] = useState(0)
  const [step, setStep] = useState(2)
  const [amountSle, setAmountSle] = useState('')
  const [amountUsd, setAmountUsd] = useState(0.0)
  const [countdown, setCountdown] = useState(1)
  const [secondsWaitingPayment, setSecondsWaitingPayment] = useState(0)
  const [receiverPhone, setReceiverPhone] = useState("")
  const [receiverName, setReceiverName] = useState("")
  const [transactionUrl, setTransactionUrl] = useState("")

  const [phoneNumber, setPhoneNumber] = useState('')
  const [buyerName, setBuyerName]  = useState('')
  const [address1, setAddress1]  = useState('')
  const [crypto, setCrypto]  = useState('usdt')

  useEffect(() => {
    console.log("** OJO useEffect")
    if (process.env.NEXT_PUBLIC_COORDINATOR == undefined) {
      alert("Falta NEXT_PUBLIC_COORDINATOR")
      return
    }

    let lPhoneNumber = ""
    let lBuyerName = ""
    let lAddress1 = ""
    let lCrypto = ""
    if (typeof window != 'undefined' && 
        typeof URLSearchParams != 'undefined') {
      let searchParams = new URLSearchParams(window.location.search)
      lPhoneNumber = searchParams.get('phoneNumber') ?? ""
      setPhoneNumber(lPhoneNumber)
      lBuyerName = searchParams.get('buyerName') ?? ""
      setBuyerName(lBuyerName)
      lAddress1 = searchParams.get('address1') ?? ""
      setAddress1(lAddress1)
      lCrypto= searchParams.get('crypto') ?? ""
      setCrypto(lCrypto)
    }
    if (lPhoneNumber == "") {
      console.log("Missing phone number")
      alert("Missing Phone Number")
      return
    }
    if (lBuyerName == "") {
      alert("Missing Buyer Name")
      return
    }
    if (!address) { 
      alert("Missing wallet address")
      return
    }
    if (!crypto || (crypto != "usdt" && crypto != "gooddollar")) { 
      alert("Missing crypto")
      return
    }
    if (lAddress1 != address) {
      alert("Different addresses from identification and this step")
      return
    }

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
            fetchPurchaseQuote()
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


  const shortAddress = (a: string) => a.slice(0,4) + '...' + a.slice(-4)

  const runningDevelopment = () => process.env.NEXT_PUBLIC_NETWORK == "ALFAJORES"

  const runningProduction = () => process.env.NEXT_PUBLIC_NETWORK == "CELO"

  const isAlfajores = () => chainId && chainId == celoAlfajores.id

  const isCelo= () => chainId && chainId == celo.id

  const steps = [
    { number: 1, title: "About you", description: "Wallet, name and orange money number" },
    { number: 2, title: "Amount", description: "Amount of crypto to buy" },
    { number: 3, title: "Review", description: "Review and confirm details" },
    { number: 4, title: "Payment", description: "Pay with your Orange Money" },
    { number: 5, title: "Complete", description: "Transaction processed" },
  ]

  const fetchPurchaseQuote = async () => {
    if (address && phoneNumber && buyerName) {
      let tokenParam = quoteToken == "" ? "" : `token=${quoteToken}&`
      const apiPurchaseQuoteUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/purchase_quote?${tokenParam}`+
        `wallet=${address}&`+
        `phone=${phoneNumber}&` +
        `crypto=${crypto}&` +
        `buyerName=${buyerName}`
      //extractAPIErrorResponse(axios)

      try {
        axios.get(
          apiPurchaseQuoteUrl, {
            validateStatus: function (status) {
              return status < 500; // Reject only if the status code is greater than or equal to 500
            }
          })
          .then( (response) => {
            if (response.data) {
              let data = response.data
              if (data.token!== undefined &&
                  data.timestamp !== undefined &&
                    data.crypto !== undefined &&
                    data.cryptoPriceInSle !== undefined &&
                      data.minimum !== undefined &&
                        data.maximum !== undefined
                 ) {
                   setQuoteToken(data.token)
                   setQuoteTimestamp(data.timestamp)
                   setQuoteCrypto(data.crypto)
                   setQuoteCryptoPriceInSle(data.cryptoPriceInSle)
                   setQuoteMinimum(data.minimum)
                   setQuoteMaximum(data.maximum)

                   if (amountSle && parseFloat(amountSle)>0) {
                     setAmountUsd(calculateAmountCrypto(
                       parseFloat(amountSle), data.cryptoPriceInSle
                     ))
                   }
                 } else {
                   console.error('Invalid data format from API:', data)
                   alert('Invalid data format from API:' + data)
                 }
            }
          })
          .catch( (error) => {
            console.error('Error fetching quote:', error.toJSON())
            alert('Error. Possibly there is an order with the same number.\n' +
                  'Wait 15 minutes and try again')
          })
      } catch (error) {
        console.error('Error fetching quote:', error)
        alert('Error. Possibly there is an order with the same number.\n' +
              'Wait 15 minutes and try again')
      }
    }
  }

  const calculateAmountCrypto = (sle: number, slePerCrypto: number) => {
    return slePerCrypto && slePerCrypto > 0 && sle && sle > 0 ?
      Math.round(sle*100.0/slePerCrypto)/100.0 : 0
  }

  const secondsAsMinutes = (seconds: number):String => {
    return `${Math.floor(seconds / 60)}:${seconds % 60}`
  }

  const handleNext = () => {
    switch (step) {
      case 1:
        alert("Should not")
      break
      case 2:
        if (+amountSle < quoteMinimum) {
          alert('Amount should be greather than lower limit')
        } else if (runningProduction() && !isCelo()) {
          alert('Switch to the Celo Blockchain')
        } else if (+quoteMaximum == 0) {
          alert('Seems there is a problem with the backend, try again later')
        } else if (+quoteMaximum < +quoteMinimum) {
          alert('Seems there are not enough funds in our side, please contact support')
        } else if (+amountSle > quoteMaximum) {
          alert('Amount should be less than upper limit')
        } else if (amountSle && parseFloat(amountSle) > 0) {
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
    if (step > 2) {
      setStep(step - 1)
    }
  }

  const handleConfirm = () => {
    try {
      if (runningProduction() && !isCelo()) {
          alert('Switch to the Celo Blockchain')
          return
      }

      const apiPurchaseOrderUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/purchase_order?token=${quoteToken}&amountSle=${amountSle}`
      axios.get(apiPurchaseOrderUrl)
      .then(response => {
        if (response.data) {
          let data = response.data
          if (data.token !== undefined &&
            data.seconds !== undefined &&
            data.amountSle !== undefined &&
            data.amountUsd !== undefined &&
            data.receiverPhone !== undefined &&
            data.receiverName !== undefined
           ) {
             /* TODO: if (data.token !== token ||
                 data.amountSle !== amountSle ||
                   data.amountUsd !== amountUsd) {
               alert("Mismatch in information of this app and coordinator")
             } else { */
             setSecondsWaitingPayment(data.seconds)
             setReceiverPhone(data.receiverPhone)
             setReceiverName(data.receiverName)
             setStep(4)
           }
           else {
            alert('Incorrect information to make order. ' + JSON.stringify(data))
           }
        } else {
          alert("No reponse data");
        }
      }).catch(function (error) {
        alert("Problem with axios" + error);
      });
    } catch (error) {
     alert('Error making order:' + error)
    }
  }

  const handleSupposePaid = () => {
    if (runningProduction()) {
      alert("This only works in development")
      return 
    }
    let e = document.getElementById('suppose-I-paid')
    if (e) {
      e.setAttribute("disabled", "true");
    }
    try {
      let msg= `Transaction Id AB0123CD.45EF Transfer Successful from ${phoneNumber} transaction amount SLE${amountSle} net credit amount SLE${amountSle} your new balance is SLE500`

      const apiSmsReceivedUrl = process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/sms_received`

      axios.post(apiSmsReceivedUrl, {
        sender: "OrangeMoney",
        msg: msg
      }/*, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        // Trying to avoid prefligth OPTIONS request
      }*/)
      .then(function (response) {
        if (response.data) {
          let data = response.data
          alert(`Sent, answer from coordinator: ${JSON.stringify(data)}`)
        } else {
          alert('No data in response')
        }
      })
      .catch(error => {
         alert(`Problem sending: ${error}`)
      })
    } catch (error) {
      alert('Error supposing payment:' + error)
    }

  }


  const fetchOrderState = async () => {
    try {
     if (quoteToken) {
       const apiPurchaseOrderStateUrl= process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/purchase_order_state?token=${quoteToken}`
        axios.get(apiPurchaseOrderStateUrl)
        .then(response => {
          if (response.data) {
            let data = response.data
            if (data.state !== undefined) {
              switch (data.state) {
               case "pending":
                 break
               case "expired":
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
    <div className="flex items-center justify-center mt-4 flex-wrap">
      {/* Progress Steps */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-9 h-9 rounded-full border-2 ${
                  step >= s.number
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "border-gray-300 text-gray-400"
                }`}
              >
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${step >= s.number ? "text-blue-600" : "text-gray-400"}`}
                >
                  {s.title}
                </p>
                <p className="text-xs text-gray-500">{s.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-4 h-0.5 mx-3 ${step > s.number ? "bg-blue-600" : "bg-gray-300"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <Card className="w-full max-w-md p-2 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Step {step}: {steps[step - 1].title}
          </CardTitle>
          <CardDescription>{steps[step - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 2 && (
            <div className="space-y-2">
              <label htmlFor="amountSle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount of SLE to pay</label>
              <Input
                id="amountSle"
                type="number"
                placeholder="Enter amount"
                value={amountSle}
                min={quoteMinimum}
                max={quoteMaximum}
                onChange={(e) => {
                  setAmountSle(e.target.value)
                  setAmountUsd(
                    calculateAmountCrypto(parseFloat(e.target.value),
                                       quoteCryptoPriceInSle)
                  )
                } }
                aria-label="Amount of SLE"
              />
              <p className="text-sm text-gray-500">
                Amount of {cryptoName[crypto]} to receive: {amountUsd} {cryptoSymbol[crypto]}
              </p>
              <p className="text-sm text-gray-500">
                Price of one {cryptoSymbol[crypto]}: {quoteCryptoPriceInSle} SLE
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
              <p className="text-sm">Amount in SLE to spend: SLE${amountSle}</p>
              <p className="text-sm">Amount of {cryptoName[crypto]} to receive: {cryptoSymbol[crypto]}{amountUsd}</p>
              <p className="text-sm">Amount within limits: {+amountSle >= quoteMinimum &&
                +amountSle <= quoteMaximum ? "Yes" : "No -- please go back"}</p>
              {runningDevelopment() &&
                <div className="border border-dotted border-orange-500 text-orange-500 flex items-center text-sm flex justify-between">
                  <p className="text-sm">Timestamp of quote: {quoteTimestamp}</p>
                  <p className="text-sm">Your wallet address: {address ? 
                    shortAddress(address) : ''}</p>
                </div>
              }
            </div>
          )}

          {step == 4 &&
            <div className="space-y-2">
              <p className="text-sm">Waiting for your payment: {secondsAsMinutes(secondsWaitingPayment)}</p>
              <p className="text-sm">From your phone {phoneNumber} ({buyerName}) with Orange Money, pay {amountSle}SLE to the phone {receiverPhone} ({receiverName})</p>
            </div>
          }
          {step == 5 &&
            <div className="space-y-2">
              <p className="text-sm">Thanks for your payment. We transfered {amountUsd} {cryptoSymbol[crypto]} to your wallet.</p>
            </div>
          }
          {step == 5 && runningDevelopment() &&
            <div className="space-y-2">
              <p className="text-sm">(Well in reality since this is testnet we sent {amountUsd}USDC...)</p>
            </div>
          }

          {step == 6 &&
            <div className="space-y-2">
              <p className="text-sm">stable-sl didn't receive your payment. Order cancelled</p>
              <p className="text-sm">If you need support please in Telegram write to <a href="https://t.me/soporte_pdJ_bot" target="_blank">@soporte_pdJ_bot</a>.</p>
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
            { step == 4 && runningDevelopment() &&
              <div className="border border-dotted border-orange-500 text-orange-500 flex items-center text-sm flex justify-between">
                <Button 
                  id="suppose-I-paid" 
                  onClick={handleSupposePaid} 
                  className="btn btn-sm bg-orange-500 text-primary-foreground hover:bg-primary/90">
                 Suppose I paid
                </Button>
              </div>
            }

            { step == 5 &&
              <a href={transactionUrl} target="_blank">Transaction Receipt</a>
            }

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
