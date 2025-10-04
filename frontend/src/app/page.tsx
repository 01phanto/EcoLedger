'use client'

import Link from 'next/link'
import { Leaf, Upload, BarChart3, ShoppingCart, Shield, Briefcase, Link2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">EcoLedger</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/upload" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Upload
              </Link>
              <Link href="/dashboard" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Dashboard
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Marketplace
              </Link>
              <Link href="/admin" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Admin
              </Link>
              <Link href="/buyer" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Portfolio
              </Link>
              <Link href="/ledger" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Ledger
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Verify Mangrove Plantations with
            <span className="text-green-600"> AI-Powered</span> Technology
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            EcoLedger uses advanced AI models to verify mangrove plantation projects, 
            calculate carbon absorption, and issue verified carbon credits on blockchain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-200 flex items-center justify-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Start Verification
            </Link>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-xl font-bold">EcoLedger</span>
            </div>
            <p className="text-gray-400 mb-4">
              Verifying mangrove plantations and fighting climate change with AI and blockchain technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
