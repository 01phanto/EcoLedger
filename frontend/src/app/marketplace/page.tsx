'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface CreditListing {
  id: string;
  ngoId: string;
  ngoName: string;
  projectName: string;
  location: string;
  creditsAvailable: number;
  pricePerCredit: number;
  verificationScore: number;
  vintageYear: number;
  projectType: string;
  verificationStandard: string;
  description: string;
  totalTrees: number;
  co2Absorbed: number;
}

export default function MarketplacePage() {
  const [listings, setListings] = useState<CreditListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<CreditListing | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState('');

  useEffect(() => {
    loadMarketplaceData();
  }, []);

  const loadMarketplaceData = () => {
    // Load only approved projects from localStorage
    const approvedListings = JSON.parse(localStorage.getItem('marketplaceListings') || '[]');
    
    // Also check for any approved projects that haven't been added to marketplace yet
    const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const newlyApproved = userProjects.filter(project => 
      project.status === 'approved' && 
      !approvedListings.find(listing => listing.ngoId === project.id)
    );

    // Convert newly approved projects to marketplace format
    const newListings = newlyApproved.map(project => ({
      id: `MARKETPLACE_${project.id}`,
      ngoId: project.id,
      ngoName: project.ngoName,
      projectName: project.projectName,
      location: project.location,
      creditsAvailable: (project.aiResults?.final_score || 50) / 10, // Convert score to credits
      pricePerCredit: 15.00 + Math.random() * 10, // Price between $15-25
      verificationScore: (project.aiResults?.final_score || 50) / 100,
      vintageYear: new Date().getFullYear(),
      projectType: 'mangrove_plantation',
      verificationStandard: 'EcoLedger_AI_v1.0',
      description: `AI-verified mangrove restoration project with ${project.aiResults?.tree_count || 0} trees planted.`,
      totalTrees: project.aiResults?.tree_count || 0,
      co2Absorbed: project.aiResults?.co2_absorbed || 0
    }));

    // Combine existing and new listings
    const allListings = [...approvedListings, ...newListings];
    
    // Save updated listings
    if (newListings.length > 0) {
      localStorage.setItem('marketplaceListings', JSON.stringify(allListings));
    }
    
    // If no real projects, show demo data
    if (allListings.length === 0) {
      const defaultListings: CreditListing[] = [
        {
          id: 'DEMO_1',
          ngoId: 'demo_sundarbans',
          ngoName: 'Demo - Sundarbans Conservation Society',
          projectName: 'Demo - Sundarbans Mangrove Restoration',
          location: 'Sundarbans, Bangladesh',
          creditsAvailable: 125.8,
          pricePerCredit: 18.50,
          verificationScore: 0.92,
          vintageYear: 2024,
          projectType: 'mangrove_plantation',
          verificationStandard: 'EcoLedger_AI_v1.0',
          description: 'Demo project - Large-scale mangrove restoration project.',
          totalTrees: 3500,
          co2Absorbed: 1547.0
        }
      ];
      setListings(defaultListings);
      console.log('📋 No approved projects found, showing demo data');
    } else {
      setListings(allListings);
      console.log(`📋 Loaded ${allListings.length} approved projects in marketplace`);
    }
  };

  const handlePurchase = () => {
    if (!selectedListing || !purchaseAmount) return;

    const quantity = parseFloat(purchaseAmount);
    const totalCost = quantity * selectedListing.pricePerCredit;

    const purchase = {
      id: `PURCHASE_${Date.now()}`,
      marketplaceListingId: selectedListing.id,
      ngoName: selectedListing.ngoName,
      projectName: selectedListing.projectName,
      location: selectedListing.location,
      creditsQuantity: quantity,
      pricePerCredit: selectedListing.pricePerCredit,
      totalAmount: totalCost,
      purchaseDate: new Date().toISOString(),
      transactionId: `0xPURCHASE${Date.now()}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      status: 'active',
      carbonOffset: quantity * 12.3
    };

    const existingPurchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
    existingPurchases.push(purchase);
    localStorage.setItem('userPurchases', JSON.stringify(existingPurchases));

    const updatedListings = listings.map(listing => 
      listing.id === selectedListing.id 
        ? { ...listing, creditsAvailable: listing.creditsAvailable - quantity }
        : listing
    );
    setListings(updatedListings);
    localStorage.setItem('marketplaceListings', JSON.stringify(updatedListings));

    const blockchainEntry = {
      type: 'credit_purchase',
      id: purchase.id,
      description: `Purchased ${quantity} credits from ${selectedListing.ngoName}`,
      credits: quantity,
      amount: totalCost,
      date: new Date().toISOString(),
      transactionId: purchase.transactionId,
      blockNumber: purchase.blockNumber,
      ngoName: selectedListing.ngoName,
      buyer: 'Current User'
    };

    const existingLedger = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
    existingLedger.push(blockchainEntry);
    localStorage.setItem('blockchainLedger', JSON.stringify(existingLedger));

    alert(`✅ Purchase successful! ${quantity} credits for $${totalCost.toFixed(2)}`);
    
    setSelectedListing(null);
    setPurchaseAmount('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">🌿 Carbon Credit Marketplace</h1>
        
        <div className="mb-6">
          <nav className="flex space-x-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">← Dashboard</Link>
            <Link href="/buyer" className="text-indigo-600 hover:text-indigo-800">💼 Portfolio</Link>
            <Link href="/ledger" className="text-blue-600 hover:text-blue-800">🔗 Ledger</Link>
          </nav>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{listing.projectName}</h3>
              <p className="text-sm text-gray-600 mb-4">{listing.ngoName}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Available Credits:</span>
                  <span className="text-sm font-medium text-green-600">🌿 {listing.creditsAvailable.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Price per Credit:</span>
                  <span className="text-sm font-semibold">${listing.pricePerCredit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Verification Score:</span>
                  <span className="text-sm font-medium text-green-600">{(listing.verificationScore * 100).toFixed(0)}%</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedListing(listing)}
                disabled={listing.creditsAvailable <= 0}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                {listing.creditsAvailable > 0 ? 'Purchase Credits' : 'Sold Out'}
              </button>
            </div>
          ))}
        </div>

        {selectedListing && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Carbon Credits</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">{selectedListing.projectName}</h4>
                  <p className="text-sm text-gray-600">{selectedListing.ngoName}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Credits)</label>
                  <input
                    type="number"
                    min="0.1"
                    max={selectedListing.creditsAvailable}
                    step="0.1"
                    value={purchaseAmount}
                    onChange={(e) => setPurchaseAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                {purchaseAmount && (
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between text-sm">
                      <span>Total Cost:</span>
                      <span className="font-medium">${(parseFloat(purchaseAmount) * selectedListing.pricePerCredit).toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setSelectedListing(null)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Purchase
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
