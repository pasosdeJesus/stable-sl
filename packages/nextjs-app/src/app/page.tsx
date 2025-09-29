'use client'

import axios from 'axios'
import { ChevronDown, MessageCircle, Shield } from "lucide-react"
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAccount } from 'wagmi'
import { celo, celoAlfajores } from 'wagmi/chains'

export default function Page() {

  const router = useRouter()

  const { address, chainId } = useAccount()
  const [previousAddress, setPreviousAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [crypto, setCrypto] = useState('usdt')
  const [isCryptoDrawerOpen, setIsCryptoDrawerOpen] = useState(false) 

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_COORDINATOR == undefined) {
      alert("Falta NEXT_PUBLIC_COORDINATOR")
      return
    }
    console.log("addres=", address)
    console.log("phoneNumber=", phoneNumber)
    console.log("customerName=", customerName)
    console.log("crypto=", crypto)
    if (address == null) {
      setDisabledAndValue("phoneNumber", true, "")
      setDisabledAndValue("customerName", true, "")
      setDisabledAndValue("crypto", true, "usdt")
      setPreviousAddress('')
    } else {
      if (address != previousAddress) {
        setPreviousAddress(address)
        setDisabledAndValue("phoneNumber", false)
      }
    }
  }, [address])

  const setDisabledAndValue = (id: string, disabled: boolean, value: any = null) => {
    const e = document.getElementById(id)
    if (e) {
      //@ts-ignore
      e.disabled = disabled
    }
    if (e && value != null) {
      //@ts-ignore
      e.value = value
    }
  }

  const runningDevelopment = () => {
    return process.env.NEXT_PUBLIC_NETWORK == "ALFAJORES"
  }

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
                  `&crypto=${encodeURIComponent(crypto)}` +
                  `&address1=${encodeURIComponent(address ?? '')}`)
    }
  }

  const handleSell = () => {
    if (validate()) {
      router.push(
        '/sell' +
          `?sellerName=${encodeURIComponent(customerName)}`+
          `&phoneNumber=${encodeURIComponent(phoneNumber)}` +
          `&crypto=${encodeURIComponent(crypto)}` +
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
    <div className="p-5 sm:px-8 space-y-6">
      <div className="mb-2 group">
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
        <p className="mb-2 font-medium text-sm tracking-wide text-surface-600 dark:text-surface-200 transition-all">
            <label
              htmlFor="phoneNumber"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Phone Number with Orange Money
            </label>
        </p>
        <div className="relative flex items-center justify-end bg-surface-200 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-600 rounded-lg">
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
        </div>
      </div>

      <div className="mb-2 group">
        <p className="mb-2 font-medium text-sm tracking-wide text-surface-600 dark:text-surface-200 transition-all">
            <label
              htmlFor="customerName"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Name linked to Orange Money
            </label>
        </p>
        <div className="relative flex items-center justify-end bg-surface-200 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-600 rounded-lg">
            <Input
                id="customerName"
                value={customerName}
                maxLength={80}
                onChange={(e) => changeCustomerName(e.target.value)}
                onBlur={(e) => blurCustomerName(e.target.value) }
                aria-label="Name linked to Orange Money"
            />
        </div>
      </div>

      <div className="mb-2 group">
        <div className="flex items-center justify-around border-2 bg-surface-200 dark:bg-surface-800 border-surface-200 dark:border-surface-600 rounded-lg">
          <div className="mb-2 text-sm text-surface-600 dark:text-surface-200 font-medium tracking-wide transition-all">Crypto:&nbsp;&nbsp;&nbsp;</div>
          <div>
            <Select onValueChange={setCrypto} defaultValue={crypto}>
              <SelectTrigger>
                <SelectValue placeholder="Select crypto" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Crypto</SelectLabel>
                    <SelectItem value="usdt">USDT</SelectItem>
                    <SelectItem value="gooddollar">GoodDollar</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-around px-2 sm:px-2 py-2 sticky bottom-0">
        <Button
          id="buyButton"
          type="button"
          tabIndex={5}
          className="text-center font-medium w-32 py-6 text-base text-white bg-primary hover:bg-primary/90 rounded-lg focus:!ring-0"
          onClick={handleBuy}
        >
          Buy
        </Button>
        <Button
          id="sellButton"
          type="button"
          tabIndex={6}
          className="text-center font-medium w-32 py-6 text-base text-white bg-primary hover:bg-primary/90 rounded-lg focus:!ring-0"
          onClick={handleSell}
          >
            Sell
        </Button>
      </div>
    </div>
  )
}
