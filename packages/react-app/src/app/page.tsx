'use client'

import axios from 'axios'
import {Shield} from "lucide-react"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAccount } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'

export default function Page() {

  const router = useRouter()

  const { address, chainId } = useAccount()
  const [previousAddress, setPreviousAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customerName, setCustomerName] = useState('')

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_COORDINATOR == undefined) {
      alert("Falta NEXT_PUBLIC_COORDINATOR")
      return
    }
    console.log("addres=", address)
    console.log("phoneNumber=", phoneNumber)
    console.log("customerName=", customerName)
    if (address == null) {
      setDisabledAndValue("phoneNumber", true, "")
      setDisabledAndValue("customerName", true, "")
      setPreviousAddress('')
    } else {
      if (address != previousAddress) {
        setPreviousAddress(address)
        let url = process.env.NEXT_PUBLIC_COORDINATOR +
          `/api/wallet_connected?address=${address}`
        console.log(`Fetching ${url}`)
        setDisabledAndValue("phoneNumber", false)
      }
    }
  }, [address])

  const setDisabledAndValue = (id: string, disabled: boolean, value: any = null) => {
    const e = document.getElementById(id)
    if (e) {
      e.disabled = disabled
    }
    if (e && value != null) {
      e.value = value
    }
  }

  const runningDevelopment = () => process.env.NEXT_PUBLIC_NETWORK == "ALFAJORES"

  const runningProduction = () => process.env.NEXT_PUBLIC_NETWORK == "CELO"

  const isAlfajores = () => chainId && chainId == celoAlfajores.id

  const isCelo= () => chainId && chainId == celo.id

  const blurPhoneNumber = (p: string) => {
    setPhoneNumber(p)
    if (validatePhoneNumber(p)) {
      setDisabledAndValue("customerName", false)
    } else {
      setDisabledAndValue("customerName", true, "")
    }
  }

  const changePhoneNumber = (p: string) => {
    setPhoneNumber(p)
  }

  const blurCustomerName = (c: string) => {
    setCustomerName(c)
    return  validateCustomerName(c)
  }

  const changeCustomerName = (n: string) => {
    setCustomerName(n)
  }

  const validatePhoneNumber = (p: string) => {
    if (!p || !/^0\d{8}$/.test(p)) {
      alert('Phone number should have 9 digits and start with 0')
    } else if (runningProduction() && !isCelo()) {
      alert('Switch to the Celo Blockchain')
    } else if (!address) {
      alert('Please connect your wallet')
    } else {
      return true
    }
    return false
  }

  const validateCustomerName = (n: string) => {
    if (!n || n.length < 5) {
      alert("Name should be longer")
    } else {
      return true
    }
    return false
  }

  const validate = () => {
    if (!address) {
      alert("Connect wallet please")
      return false
    }
    return validatePhoneNumber(phoneNumber) && 
      validateCustomerName(customerName)
  }

  const handleBuy = () => {
    if (validate()) {
      router.push('/buy' +
                  `?buyerName=${encodeURIComponent(customerName)}`+
                  `&phoneNumber=${encodeURIComponent(phoneNumber)}` + 
                  `&address1=${encodeURIComponent(address ?? '')}`)
    }
  }

  const handleSell = () => {
    if (validate()) {
      router.push(
        '/sell' +
          `?sellerName=${encodeURIComponent(customerName)}`+
          `&phoneNumber=${encodeURIComponent(phoneNumber)}` + 
          `&address1=${encodeURIComponent(address ?? '')}`
      )
    }
  }

  const copyTestPhone = async () => {
    try {
      const inputField = document.getElementById('testPhone') as HTMLInputElement
      await navigator.clipboard.writeText(inputField.value)
      console.log('Text copied to clipboard successfully!')
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  return (
    <div className="flex items-center justify-center mt-4 flex-wrap">

      <Card className="w-full max-w-md p-2 rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-600" />
            Identification
          </CardTitle>
          <CardDescription>
            Provide your identification details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {!address &&
              <div className="border-2 border-dotted border-red-500">
                Please connect your wallet
              </div>
            }
            {runningDevelopment() &&
              <div className="border border-dotted border-orange-500 text-orange-500 flex items-center text-sm flex justify-between">
                Test with your name and &nbsp;
                <div className="bg-gray-50">
                  012456789 &nbsp;
                </div>
                <Input 
                    style={{display: "none"}} 
                    id="testPhone" 
                    value="012345678" 
                    disabled />
                <Button
                    className="btn btn-sm bg-orange-500 text-primary-foreground hover:bg-primary/90"
                    onClick={copyTestPhone}>Copy</Button>
              </div>
            }

            <label 
              htmlFor="phoneNumber" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Phone Number with Orange Money
            </label>
            <Input
                id="phoneNumber"
                type="tel"
                maxLength={14}
                placeholder="Sierra Leone number e.g 075934442"
                value={phoneNumber}
                onChange={(e) => changePhoneNumber(e.target.value) }
                onBlur={(e) => blurPhoneNumber(e.target.value) }
                aria-label="Phone Number"
                disabled
              />
            <label 
              htmlFor="customerName" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name linked to Orange Money
            </label>
            <Input
                id="customerName"
                value={customerName}
                maxLength={80}
                onChange={(e) => changeCustomerName(e.target.value)}
                onBlur={(e) => blurCustomerName(e.target.value) }
                aria-label="Name linked to Orange Money"
                disabled
            />

          </div>
          <div className="flex justify-between">
            <Button
              id="buyButton"
              onClick={handleBuy} 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
              Buy USDT
            </Button>
            <Button 
              id="sellButton"
              onClick={handleSell} 
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
              Sell USDT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
