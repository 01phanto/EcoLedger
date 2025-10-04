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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center items-center mb-8">
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-2xl">
              <Leaf className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-6">
            EcoLedger
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            AI-Powered Mangrove Verification & Carbon Credit Trading
          </h2>
          <p className="text-lg text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Complete workflow from NGO project submission through AI analysis (YOLOv8, NDVI, IoT CO₂) 
            to admin approval, blockchain ledger recording, and carbon credit marketplace trading
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/upload"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Upload className="h-5 w-5 mr-2" />
              Start AI Verification
            </Link>
            <Link
              href="/marketplace"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💰 Carbon Marketplace
            </Link>
            <Link
              href="/admin"
              className="bg-gradient-to-r from-purple-500 to-violet-600 text-white px-8 py-4 rounded-xl font-bold hover:from-purple-600 hover:to-violet-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔐 Admin Portal
            </Link>
          </div>
        </div>

        {/* Complete Workflow Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl mb-16">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Complete Verification Workflow
            </h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From NGO project submission to carbon credit trading through AI verification and blockchain ledger
            </p>
          </div>
          
          {/* Workflow Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1: NGO Upload */}
            <div className="card-hover bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">🏢</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">1. NGO Upload</h4>
                <p className="text-gray-600 text-sm mb-4">
                  NGOs submit mangrove plantation data with satellite images, ground photos, and IoT sensor data
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📊 Project Details</div>
                  <div>📸 Image Evidence</div>
                  <div>🌡️ IoT Sensor Data</div>
                </div>
              </div>
            </div>

            {/* Step 2: AI Analysis */}
            <div className="card-hover bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">🤖</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">2. AI Analysis</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Advanced AI models analyze and score the submitted data
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>🌳 YOLOv8 Tree Detection</div>
                  <div>🍃 NDVI Vegetation Health</div>
                  <div>📈 IoT CO₂ Analysis</div>
                  <div>⚡ Final Score Calculation</div>
                </div>
              </div>
            </div>

            {/* Step 3: Admin Review */}
            <div className="card-hover bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">👨‍💼</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">3. Admin Approval</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Admin reviews AI analysis and approves verified projects
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>✅ Project Verification</div>
                  <div>💳 Carbon Credits Issued</div>
                  <div>🔗 Blockchain Recording</div>
                </div>
              </div>
            </div>

            {/* Step 4: Trading */}
            <div className="card-hover bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl text-white">💰</span>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">4. Credit Trading</h4>
                <p className="text-gray-600 text-sm mb-4">
                  Companies purchase verified carbon credits from marketplace
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>📈 Marketplace Listing</div>
                  <div>💵 Credit Purchase</div>
                  <div>⛓️ Blockchain Transaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Models Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌳</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">YOLOv8 Detection</h4>
              <p className="text-gray-600">
                Advanced computer vision for accurate tree counting and forest density analysis
              </p>
            </div>
          </div>
          
          <div className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍃</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">NDVI Analysis</h4>
              <p className="text-gray-600">
                Satellite-based vegetation health assessment using normalized difference vegetation index
              </p>
            </div>
          </div>
          
          <div className="card-hover bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">IoT CO₂ Sensors</h4>
              <p className="text-gray-600">
                Real-time environmental monitoring and carbon absorption measurement
              </p>
            </div>
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
