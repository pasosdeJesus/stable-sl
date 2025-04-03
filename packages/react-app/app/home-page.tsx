'use client'

import Layout from '../components/Layout'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export default function HomePage() {
  const [userAddress, setUserAddress] = useState('')
  const [isMounted, setIsMounted] = useState(false)
  const { address, isConnected } = useAccount()

  const [formValues, setFormValues] = useState({
    amount: '',
    submitted: false
  })

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isConnected && address) {
      setUserAddress(address)
    }
  }, [address, isConnected])

  if (!isMounted) {
    return null
  }

  const handleChange = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    })
  }

  const btnHandler = () => {
    setFormValues({
      ...formValues,
      ["submitted"]: true
    })
  }

  let cont = <div>Please connect your wallet</div>
  if (isConnected) {
    cont = (
      <form className="bg-white p-8 rounded shadow-md w-full max-w-md" onSubmit={btnHandler}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">Amount</label>
          <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" placeholder="Enter amount" name="amount" onChange={handleChange}/>
        </div>
        <div className="mb-6">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Buy with FonBnk</button>
        </div>
      </form>
    )
    if (formValues["submitted"]) {
      const searchParams = new URLSearchParams()
      searchParams.append("provider", "bank_transfer")
      searchParams.append("network", "CELO")
      searchParams.append("amount", formValues["amount"])
      searchParams.append("currency", "usdt")
      searchParams.append("address", "0x6b3bc1b55b28380193733a2fd27f2639d92f14be")
      searchParams.append("source", "u2Ldt7Hh")
      searchParams.append("country", "NG")
      const url = `https://sandbox-pay.fonbnk.com/phone?${searchParams.toString()}`;
      console.log("url=", url)
      cont = (
        <div>
          <iframe style={{width: "25rem", height: "27rem"}} src={url}/>
        </div>
      )
    }
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-900">Buy USDT</h1>
        { cont } 
      </div>
    </Layout>
  )
}
