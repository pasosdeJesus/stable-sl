"use client"

/**
 * Based on Header of Celo Composer
 */

import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { useConnect } from "wagmi"
import { injected } from "wagmi/connectors"
import { Menu, MessageCircle } from "lucide-react"

export default function Header() {
  const [hideConnectBtn, setHideConnectBtn] = useState(false)
  const { connect } = useConnect()

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true)
      connect({ connector: injected({ target: "metaMask" }) })
    }
  }, [])

  return (
    <div className="sticky top-0 z-10 flex flex-col xs:rounded-t-xl justify-between bg-surface-100 dark:bg-surface-700">
      <div className="flex items-center justify-between gap-3 sm:gap-5 px-5 py-3 sm:px-8 sm:py-3 w-full min-h-14 relative">
        <button 
          type="button" 
          className="text-center font-medium focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg focus:!ring-0 text-base p-4 -m-4 disabled:invisible relative"
        >
          <div className="text-surface-800 dark:text-surface-200">
            <Menu className="w-6 h-6" />
          </div>
        </button>
        
        <div 
          data-testid="headerLogo" 
          className="absolute left-0 top-0 right-0 bottom-0 flex h-[inherit] pointer-events-none justify-center"
        >
          <span className="flex items-center justify-center gap-3 text-black text-lg font-extrabold">
            <img 
              src="stable-sl-logo.png" 
              alt="logo" 
              className="h-8" 
              height="32"
            />
            Stable SL
          </span>
        </div>
        
        <div className="flex gap-2">
          <button 
            type="button" 
            className="text-center font-medium focus-within:ring-4 focus-within:outline-hidden inline-flex items-center justify-center bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700 focus-within:ring-primary-300 dark:focus-within:ring-primary-800 rounded-lg focus:!ring-0 p-0 text-base text-surface-800 dark:text-surface-200"
            data-testid="closeIcon"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      </div>
      
      {!hideConnectBtn && (
        <div className="px-5 py-3 flex justify-center">
          <div className="w-full max-w-xs">
            <ConnectButton
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              chainStatus="icon"
              accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
