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
        <div className="flex items-center justify-between border-2 bg-surface-200 dark:bg-surface-800 border-surface-200 dark:border-surface-600 rounded-lg">
          <div className="mb-2 text-sm text-surface-600 dark:text-surface-200 font-medium tracking-wide transition-all">Cryptocurrency</div>
          <button
            type="button"
            tabIndex={4}
            className="text-center font-medium flex justify-center items-center gap-2 py-3 px-2 bg-surface-100 dark:bg-surface-700 cursor-pointer absolute right-3 min-w-24 h-3/5 rounded-md hover:bg-surface-100/60 focus:!ring-0"
            onClick={() => setIsCryptoDrawerOpen(true)}
          >
            <span className="flex gap-2 items-center justify-between text-surface-600 font-semibold tracking-widest text-xs uppercase">
              <div className="relative flex-shrink-0" style={{ width: '22px', height: '22px' }}>
                {/* Simple SVG Icon for USDT or G$ */}
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                {crypto === 'usdt' ? (
                  <>
                    <circle cx="16" cy="16" r="14" fill="#50AF95" />
                    <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
                  </>
                ) : (
                  <>
                    <circle cx="16" cy="16" r="14" fill="#FF6B00" />
                    <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">G</text>
                  </>
                )}
                </svg>
              </div>
              {crypto}
            </span>
            <ChevronDown className="w-4 h-4 text-surface-600" />
          </button>
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

      {/* Crypto Selection Drawer (Modal Placeholder) */}
      {isCryptoDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md rounded-lg shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Select Cryptocurrency</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsCryptoDrawerOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <div className="space-y-2">
                <Button
                  variant={crypto === 'usdt' ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setCrypto('usdt')
                   setIsCryptoDrawerOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                        <circle cx="16" cy="16" r="14" fill="#50AF95" />
                        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
                      </svg>
                    </div>
                    USDT (Tether)
                  </div>
                </Button>
                <Button
                  variant={crypto === 'gooddollar' ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setCrypto('gooddollar')
                    setIsCryptoDrawerOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                        <circle cx="16" cy="16" r="14" fill="#FF6B00" />
                        <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">G</text>
                      </svg>
                    </div>
                    G$ (GoodDollar)
                  </div>
                </Button>
                {/* Add more cryptocurrencies as needed */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      </div>
  )
}
