/**
 * Based on Header of Celo Composer
 */
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { useConnect } from "wagmi"
import { injected } from "wagmi/connectors"

import MovingBanner from "@/components/moving-banner"

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

        <div 
          data-testid="headerLogo" 
          className="left-0 top-0 right-0 bottom-0 flex h-[inherit] pointer-events-none justify-center"
        >
          <span className="flex items-center justify-center gap-3 text-black text-lg font-extrabold">
            <img 
              src="stable-sl-logo.svg" 
              alt="logo" 
              style={{width: "64px"}}
            />
            Stable SL
          </span>
        </div>
        {!hideConnectBtn && (
          <div className="p-3">
          <ConnectButton
          showBalance={{
            smallScreen: false,
            largeScreen: false,
          }}
          />
          </div>
        )}
      </div>
      <MovingBanner />
    </div>
  )
}
