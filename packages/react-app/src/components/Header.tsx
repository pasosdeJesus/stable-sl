/**
 * Based on Header of Celo Composer
 */
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useEffect, useState } from "react"
import { useConnect } from "wagmi"
import { injected } from "wagmi/connectors"

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
        <>
          {!hideConnectBtn && (
            <div className="flex h-16 content-center justify-between">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900">Stable SL</h1>
                <p className="text-gray-600 mt-2">Buy USDT in Sierra Leone</p>
              </div>
              <div className="p-3">
                <ConnectButton
                  showBalance={{
                    smallScreen: true,
                    largeScreen: false,
                  }}
                />
              </div>
            </div>
          )}
        </>
  )
}
