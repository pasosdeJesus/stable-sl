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
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">Good job</label>
      </div>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold text-gray-900">Coordinator</h1>
        { cont } 
      </div>
    </Layout>
  )
}
