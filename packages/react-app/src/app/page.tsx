'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, MessageCircle, Shield } from 'lucide-react'

export default function Page() {
  const router = useRouter()
  const { address, chainId } = useAccount()

  const [fiatAmount, setFiatAmount] = useState('')
  const [cryptoAmount, setCryptoAmount] = useState('')
  const [selectedFiat, setSelectedFiat] = useState('SLE') // Default to SLE
  const [selectedCrypto, setSelectedCrypto] = useState('USDT')
  const [isFiatDrawerOpen, setIsFiatDrawerOpen] = useState(false)
  const [isCryptoDrawerOpen, setIsCryptoDrawerOpen] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(13.5) // Example rate: 1 USDT = 13.5 SLE

  // Update crypto amount when fiat amount or exchange rate changes
  useEffect(() => {
    if (fiatAmount && !isNaN(parseFloat(fiatAmount))) {
      const cryptoVal = (parseFloat(fiatAmount) / exchangeRate).toFixed(2)
      setCryptoAmount(cryptoVal)
    } else {
      setCryptoAmount('')
    }
  }, [fiatAmount, exchangeRate])

  // Update fiat amount when crypto amount or exchange rate changes
  useEffect(() => {
    if (cryptoAmount && !isNaN(parseFloat(cryptoAmount))) {
      const fiatVal = (parseFloat(cryptoAmount) * exchangeRate).toFixed(2)
      setFiatAmount(fiatVal)
    } else {
      setFiatAmount('')
    }
  }, [cryptoAmount, exchangeRate])

  const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setFiatAmount(value)
    }
  }

  const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and a single decimal point
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCryptoAmount(value)
    }
  }

  const handleProceed = () => {
    if (!address) {
      alert("Please connect your wallet")
      return
    }
    if (!fiatAmount || parseFloat(fiatAmount) <= 0) {
      alert("Please enter a valid amount to pay")
      return
    }
    if (!cryptoAmount || parseFloat(cryptoAmount) <= 0) {
      alert("Please enter a valid amount to receive")
      return
    }

    // Example: Navigate to a confirmation page with details
     router.push('/buy' +
                  `?buyerName=${encodeURIComponent("Test User")}`+
                  `&phoneNumber=${encodeURIComponent("012345678")}` +
                  `&crypto=${encodeURIComponent(selectedCrypto)}` +
                  `&address1=${encodeURIComponent(address ?? '')}` +
                  `&amount=${encodeURIComponent(fiatAmount)}`)
    // router.push(`/confirm?fiat=${fiatAmount}&crypto=${cryptoAmount}&fiatType=${selectedFiat}&cryptoType=${selectedCrypto}`)
  }


  return (
    <div className="p-5 pb-10 sm:px-8 space-y-6">
      {/* "Pagar" (Pay) Section */}
      <div className="mb-2 group">
        <p className="mb-2 font-medium text-sm tracking-wide text-surface-600 dark:text-surface-200 transition-all">You Pay</p>
        <div className="relative flex items-center justify-end bg-surface-200 dark:bg-surface-800 border-2 border-surface-200 dark:border-surface-600 rounded-lg">
          <Input
            type="text"
            id="fiatInput"
            maxLength={15}
            autoComplete="off"
            inputMode="decimal"
            tabIndex={1}
            placeholder="Minimum 100"
            className="input-base text-2xl bg-surface-100 tabular-nums tracking-tighter placeholder:tracking-normal placeholder:normal-nums h-full w-full"
            value={fiatAmount}
            onChange={handleFiatChange}
          />
          <div
            className="flex justify-center items-center gap-2 py-3 px-2 bg-surface-100 dark:bg-surface-700 cursor-pointer absolute right-3 min-w-24 h-3/5 rounded-r-lg hover:bg-surface-100/60 rounded-md"
            onClick={() => setIsFiatDrawerOpen(true)}
            aria-label="fiat drawer"
            role="button"
            tabIndex={2}
          >
            <div className="relative flex-shrink-0" style={{ width: '22px', height: '22px' }}>
              {/* Simple SVG Icon for SLE */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span className="uppercase font-medium tracking-widest">{selectedFiat}</span>
            <ChevronDown className="w-4 h-4 text-surface-600" />
          </div>
        </div>
      </div>

      {/* "Usted obtiene" (You get) Section */}
      <div className="mb-2 group">
        <p className="mb-2 text-sm text-surface-600 dark:text-surface-200 font-medium tracking-wide transition-all">You get</p>
        <div className="relative flex items-center justify-end border-2 bg-surface-200 dark:bg-surface-800 border-surface-200 dark:border-surface-600 rounded-lg">
          <Input
            type="text"
            id="cryptoInput"
            autoComplete="off"
            maxLength={15}
            inputMode="decimal"
            tabIndex={3}
            className="input-base text-2xl border-2 bg-surface-100 tabular-nums tracking-tighter placeholder:tracking-normal placeholder:normal-nums h-full w-full"
            value={cryptoAmount}
            onChange={handleCryptoChange}
          />
          <button
            type="button"
            tabIndex={4}
            className="text-center font-medium flex justify-center items-center gap-2 py-3 px-2 bg-surface-100 dark:bg-surface-700 cursor-pointer absolute right-3 min-w-24 h-3/5 rounded-md hover:bg-surface-100/60 focus:!ring-0"
            onClick={() => setIsCryptoDrawerOpen(true)}
          >
            <span className="flex gap-2 items-center justify-between text-surface-600 font-semibold tracking-widest text-xs uppercase">
              <div className="relative flex-shrink-0" style={{ width: '22px', height: '22px' }}>
                {/* Simple SVG Icon for USDT */}
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                  <circle cx="16" cy="16" r="14" fill="#50AF95" />
                  <text x="16" y="21" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial, sans-serif">T</text>
                </svg>
              </div>
              {selectedCrypto}
            </span>
            <ChevronDown className="w-4 h-4 text-surface-600" />
          </button>
        </div>
        <div className="mt-3 flex justify-between font-normal text-xs text-surface-500 tracking-wide">
          <span>1 {selectedCrypto} ≈ {exchangeRate} {selectedFiat}</span>
          <span>{selectedCrypto} · Network Fee {selectedFiat} 0</span>
        </div>
      </div>

      {/* "Usted paga" (You pay including fees) Summary */}
      <div className="px-2 sm:px-2 -mt-4 mb-2 transition-opacity ease-in-out duration-300 opacity-100">
        <div className="flex flex-col bg-surface-200 dark:bg-surface-800 rounded-t-lg text-sm sm:text-base">
          <button
            type="button"
            className="text-center font-medium items-center text-white rounded-lg text-sm flex justify-between gap-3 cursor-pointer w-full p-3"
          >
            <span className="font-medium text-surface-600 dark:text-surface-300 text-left">
              You pay <span className="font-bold">{selectedFiat} {fiatAmount || '0.00'}</span> including fees
            </span>
            <div className="flex justify-between items-center gap-3">
              <MessageCircle className="w-5 h-5 text-surface-600 dark:text-surface-300" />
            </div>
          </button>
        </div>
        <div className="border-b-4 flex items-center justify-start font-medium text-xs text-surface-500 border-x-4 border-surface-200 dark:border-surface-800 py-2 px-3 rounded-b-lg">
          Pay with
          <div className="flex items-center justify-start pl-2">
            <span className="flex items-center justify-center">
              {/* Simple SVG Icon for bank transfer */}
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex items-center justify-center pl-2 min-h-4 w-6 h-6">
                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M2 9H22M9 14H12M15 14H16M9 17H10M13 17H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Bank Transfer
            </span>
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <div className="px-2 sm:px-2 py-2 sticky bottom-0 bg-background">
        <Button
          type="button"
          tabIndex={5}
          className="text-center font-medium w-full py-6 text-base text-white bg-primary hover:bg-primary/90 rounded-lg focus:!ring-0"
          onClick={handleProceed}
        >
          Proceed
        </Button>
      </div>

      {/* Fiat Selection Drawer (Modal Placeholder) */}
      {isFiatDrawerOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md rounded-lg shadow-lg">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Select Currency</h3>
                <Button variant="ghost" size="icon" onClick={() => setIsFiatDrawerOpen(false)}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
              <div className="space-y-2">
                <Button
                  variant={selectedFiat === 'SLE' ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedFiat('SLE')
                    setIsFiatDrawerOpen(false)
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative flex-shrink-0" style={{ width: '24px', height: '24px' }}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    </div>
                    SLE (Sierra Leone Leone)
                  </div>
                </Button>
                {/* Add more fiat currencies as needed */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                  variant={selectedCrypto === 'USDT' ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => {
                    setSelectedCrypto('USDT')
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
                {/* Add more cryptocurrencies as needed */}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}