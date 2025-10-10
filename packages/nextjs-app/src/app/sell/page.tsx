'use client'

import axios from 'axios'
import {ArrowLeft, CheckCircle, RefreshCw, Shield} from "lucide-react"
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'
import { Address, erc20Abi, http } from 'viem'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'


export default function Page() {

  const router = useRouter()

  const { address, chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  //const { writeContractAsync } = useWriteContractAsync()
  const [quoteToken, setQuoteToken] = useState("")
  const [quoteTimestamp, setQuoteTimestamp] = useState(0)
  const [quoteCrypto, setQuoteCrypto] = useState("usdt")
  const [quoteCryptoPriceInSle, setQuoteCryptoPriceInSle] = useState(0.0)
  const [quoteCryptoBalance, setQuoteCryptoBalance] = useState(0.0)
  const [quoteMinimum, setQuoteMinimum] = useState(0)
  const [quoteMaximum, setQuoteMaximum] = useState(0)
  const [step, setStep] = useState(2)
  const [crypto, setCrypto] = useState('usdt')
  const [amountSle, setAmountSle] = useState(0)
  const [amountCrypto, setAmountCrypto] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [secondsWaitingPayment, setSecondsWaitingPayment] = useState(0)
  const [senderPhone, setSenderPhone] = useState("")
  const [senderName, setSenderName] = useState("")
  const [transactionUrl, setTransactionUrl] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [sellerName, setSellerName] = useState("")
  const [address1, setAddress1] = useState("")

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_COORDINATOR == undefined) {
      alert("Falta NEXT_PUBLIC_COORDINATOR")
      return
    }
    let lPhoneNumber = ""
    let lSellerName = ""
    let lAddress1 = ""
    let lCrypto = ""
    if (typeof window != 'undefined' && typeof URLSearchParams != 'undefined') {
      let searchParams = new URLSearchParams(window.location.search)
      lPhoneNumber = searchParams.get('phoneNumber') ?? ""
      setPhoneNumber(lPhoneNumber)
      lSellerName = searchParams.get('sellerName') ?? ""
      setSellerName(lSellerName)
      lAddress1 = searchParams.get('address1') ?? ""
      setAddress1(lAddress1)
      lCrypto = searchParams.get('crypto') ?? "usdt"
      if (lCrypto != "usdt" && lCrypto != "gooddollar") {
        alert("Unkown crypto: " + lCrypto)
        return
      }
      setCrypto(lCrypto)
    }

    if (lPhoneNumber == "") {
      alert("Missing Phone Number")
      return
    }
    if (lSellerName == "") {
      alert("Missing Buyer Name")
      return
    }
    if (!address) { 
      alert("Missing wallet address")
      return
    }
    if (lAddress1 != address) {
      alert("Different addresses from identification and this step")
      return
    }

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer) // Cleanup on unmount
    } else {
      // Reset the timer after a short delay
      switch (step) {
        case 1:
        case 2:
        case 3:
          fetchSalesQuote()
          setTimeout(() => {
            fetchSalesQuote()
            setCountdown(10)
          }, 1000) // 1 second delay
          break
        case 4:
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
    { number: 2, title: "Amount", description: "Amount of crypto to sell" },
    { number: 3, title: "Confirm", description: "Review and confirm details" },
      { number: 4, title: "Approve transfer", description: "Pay with your wallet" },
      { number: 5, title: "Wait for our payment", description: "In your Orange" },
      { number: 6, title: "Done", description: "Transaction completed" },
    ]

    const fetchSalesQuote = async () => {
      if (address && phoneNumber && sellerName) {
        let tokenParam = quoteToken == "" ? "" : `token=${quoteToken}&`
        const apiSalesQuoteUrl = process.env.NEXT_PUBLIC_COORDINATOR +
          `/api/sales_quote?${tokenParam}`+
          `wallet=${address}&`+
          `crypto=${crypto}&`+
          `phone=${phoneNumber}&` +
          `sellerName=${sellerName}`
        //extractAPIErrorResponse(axios)

        try {
          axios.get(
            apiSalesQuoteUrl, {
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
                  data.cryptoBalance !== undefined &&
                  data.minimum !== undefined &&
                  data.maximum !== undefined
                ) {
                    setQuoteToken(data.token)
                    setQuoteTimestamp(data.timestamp)
                    setQuoteCrypto(data.crypto)
                    setQuoteCryptoPriceInSle(data.cryptoPriceInSle)
                    setQuoteCryptoBalance(data.cryptoBalance)
                    setQuoteMinimum(data.minimum)
                    setQuoteMaximum(data.maximum)
                    setSenderPhone(data.senderPhone)
                    setSenderName(data.senderName)

                    if (amountCrypto && amountCrypto > 0) {
                      setAmountSle(calculateAmountSle(
                        amountCrypto, data.cryptoPriceInSle
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

    const calculateAmountSle = (_cryptoAmount: number, slePerCrypto: number) => {
      return slePerCrypto && _cryptoAmount ?
        Math.round(_cryptoAmount*slePerCrypto) : 0
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
          if (+amountCrypto < quoteMinimum) {
            alert('Amount should be greather than lower limit')
          } else if (runningProduction() && !isCelo()) {
            alert('Switch to the Celo Blockchain')
          } else if (+quoteMaximum <= 0) {
            alert('Maximum quote <= 0. Try again later')
          } else if (+amountCrypto > quoteMaximum) {
            alert('Amount should be less than upper limit')
          } else if (amountCrypto && amountCrypto > 0) {
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
      if (step == 2) {
        router.push(
          '/' +
            `?customerName=${encodeURIComponent(sellerName)}`+
            `&phoneNumber=${encodeURIComponent(phoneNumber)}` +
            `&crypto=${encodeURIComponent(crypto)}`
        )
      } else if (step > 2) {
        setStep(step - 1)
      }
    }

    const handleConfirm = async () => {

      const transferFromWallet = async() => {
        let erc20Address:Address = runningProduction() ?
          '0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e' : //USDT 
          '0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B' //USDC Alfa
        let decimals = 6
        if (crypto == "gooddollar") {
          erc20Address = runningProduction() ?
            '0x62b8b11039fcfe5ab0c56e502b1c372a3d2a9c7a' :
            '0xb4fF4DcbaC21ECBe3b0A313aFd031aF7279be142'
          decimals = 18
        }
        const amountInWei = BigInt(amountCrypto * (10 ** decimals))
        console.log("amountInWei=", amountInWei)
        debugger
        let txHash = await writeContractAsync({
          address: erc20Address,
          abi: erc20Abi,
          functionName: 'transfer',
          args: [
            '0x6b3bc1b55b28380193733a2fd27f2639d92f14be',
            amountInWei
          ],
        });
        console.log('Transaction sent:', txHash);
        if (txHash) {
          const cryptoTransferredUrl = process.env.NEXT_PUBLIC_COORDINATOR +
            `/api/crypto_transferred`
          axios.post(
            cryptoTransferredUrl,
            {
              "token": quoteToken,
              "tx": txHash
            }
          )
          .then(response => {
            if (response.data) {
              let data = response.data
              if (data.thanks !== undefined) {
                console.log(" Recibido")
                setStep(5)
              }
            }
          }).catch(function (error) {
            alert("Problem verifying transaction, please take screenshot and contact us. Error: " + error);
          });
        } else {
          alert("Transaction not completed")
        }
      }

      try {
        if (runningProduction() && !isCelo()) {
          alert('Switch to the Celo Blockchain')
          return
        }

        const apiSalesOrderUrl = process.env.NEXT_PUBLIC_COORDINATOR +
          `/api/sales_order?token=${quoteToken}&amountCrypto=${amountCrypto}`
        axios.get(apiSalesOrderUrl)
        .then(response => {
          if (response.data) {
            let data = response.data
            if (data.token !== undefined &&
                data.seconds !== undefined &&
                  data.amountSle !== undefined &&
                    data.crypto !== undefined &&
                      data.amountCrypto !== undefined &&
                        data.senderPhone !== undefined &&
                          data.senderName !== undefined
               ) {
                 //setSecondsWaitingPayment(data.seconds)
                 setSenderPhone(data.senderPhone)
                 setSenderName(data.senderName)
                 setStep(4)
                 console.log("OJO setStep(4)")
                 transferFromWallet()
               } else {
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
       const apiSalesOrderStateUrl= process.env.NEXT_PUBLIC_COORDINATOR +
        `/api/sales_order_state?token=${quoteToken}`
        axios.get(apiSalesOrderStateUrl)
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
              <p className="text-sm text-gray-500">
                Balance in your wallet: {Math.floor(quoteCryptoBalance)} {crypto}
              </p>
              <label htmlFor="amountCrypto" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Amount of {crypto} to sell</label>
              <Input
                id="amountCrypto"
                type="number"
                placeholder="Enter amount"
                value={amountCrypto}
                min={quoteMinimum}
                max={quoteMaximum}
                onChange={(e) => {
                  setAmountCrypto(+e.target.value)
                  setAmountSle(
                    calculateAmountSle(parseFloat(e.target.value),
                                       quoteCryptoPriceInSle)
                  )
                } }
                aria-label="Amount of {crypto}"
              />
              <p className="text-sm text-gray-500">
                Amount of SLE to receive: {amountSle} SLE
              </p>
              <p className="text-sm text-gray-500">
                Price of one {crypto}: {quoteCryptoPriceInSle} SLE
              </p>
              <p className="text-sm text-gray-500">
                Order limits in {crypto}: {Math.floor(quoteMinimum)} - 
                  {Math.floor(quoteMaximum)}
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
              <p className="text-sm">Amount in {crypto} to sell: {crypto}${amountCrypto}</p>
              <p className="text-sm">Amount of SLE to receive: {amountSle}SLE</p>
              <p className="text-sm">Amount within limits: {+amountCrypto>= quoteMinimum &&
                +amountCrypto <= quoteMaximum ? "Yes" : "No -- please go back"}</p>
              <p className="text-sm">Once you confirm transfer from your wallet to ours, we will pay to you {amountSle}SLE in your Orange Money {phoneNumber} ({sellerName}). Expect payment from the phone {senderPhone} ({senderName})</p>
              {runningDevelopment() &&
                <div className="border border-dotted border-orange-500 text-orange-500 flex items-center text-sm flex justify-between">
                  <p className="text-sm">Timestamp of quote: {quoteTimestamp}</p>
                  <p className="text-sm">Your wallet address: {shortAddress(address ?? '')}</p>
                </div>
              }
            </div>
          )}

          {step == 4 &&
            <div className="space-y-2">
              <p className="text-sm">Waiting for your approval of the transaction for {amountCrypto} to send you after {amountSle}SLE to your Orange {phoneNumber} with name {sellerName}. {/*secondsAsMinutes(secondsWaitingPayment)*/}</p>
            </div>
          }
          {step == 5 &&
            <div className="space-y-2">
              <p className="text-sm">Thanks for selling. We are transferring {amountSle}SLE to your Orange Money {phoneNumber} with name {sellerName}.</p>
              <p>If you don't receive them in the next 15 minutes, please contact us by writing in Telegram to <a href="https://t.me/soporte_pdJ_bot" target="_blank">@soporte_pdJ_bot</a> or in WhatsApp to the number +232 75343641.</p>
            </div>
          }
          {step == 5 && runningDevelopment() &&
            <div className="border border-dotted border-orange-500 text-orange-500 flex items-center text-sm flex justify-between">
              <p className="text-sm">(Well in reality since this is testnet we are just trying to send an SMS to the provided number.)</p>
            </div>
          }

          {step == 6 &&
            <div className="space-y-2">
              <p className="text-sm">stable-sl couldn't send your payment.</p>
              <p className="text-sm">Please contact support in Telegram by writting to <a href="https://t.me/soporte_pdJ_bot" target="_blank">@soporte_pdJ_bot</a> or in WhatsApp by writing to the number +232 75343641.</p>
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

            { step == 6 &&
              <a href={transactionUrl} target="_blank">Transaction Receipt</a>
            }

          </div>
        </CardContent>
      </Card>
    </div>
  )
}
