'use client';

import { useState, useEffect } from 'react';

interface Purchase {
  id: string;
  marketplaceListingId: string;
  ngoName: string;
  projectName: string;
  location: string;
  creditsQuantity: number;
  pricePerCredit: number;
  totalAmount: number;
  purchaseDate: string;
  transactionId: string;
  blockNumber: number;
  status: 'active' | 'traded' | 'retired';
  carbonOffset: number;
}

interface TradeOffer {
  id: string;
  creditId: string;
  quantity: number;
  askingPrice: number;
  originalPrice: number;
  profitLoss: number;
  datePosted: string;
}

export default function BuyerDashboard() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([]);
  const [selectedTab, setSelectedTab] = useState('portfolio');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [selectedCredit, setSelectedCredit] = useState<Purchase | null>(null);
  const [tradeQuantity, setTradeQuantity] = useState(1);
  const [tradePrice, setTradePrice] = useState(0);

  useEffect(() => {
    loadPurchaseData();
    loadTradeOffers();
  }, []);

  const loadPurchaseData = () => {
    const existingPurchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');
    setPurchases(existingPurchases.sort((a: Purchase, b: Purchase) => 
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    ));
  };

  const loadTradeOffers = () => {
    const existingOffers = JSON.parse(localStorage.getItem('tradeOffers') || '[]');
    setTradeOffers(existingOffers);
  };

  const handleCreateTradeOffer = () => {
    if (!selectedCredit || tradeQuantity <= 0 || tradePrice <= 0) return;

    const newOffer: TradeOffer = {
      id: `TRADE_${Date.now()}`,
      creditId: selectedCredit.id,
      quantity: tradeQuantity,
      askingPrice: tradePrice,
      originalPrice: selectedCredit.pricePerCredit,
      profitLoss: (tradePrice - selectedCredit.pricePerCredit) * tradeQuantity,
      datePosted: new Date().toISOString()
    };

    const updatedOffers = [...tradeOffers, newOffer];
    setTradeOffers(updatedOffers);
    localStorage.setItem('tradeOffers', JSON.stringify(updatedOffers));

    // Record trade posting on blockchain
    const blockchainEntry = {
      type: 'trade_offer_created',
      id: newOffer.id,
      description: `Trade offer created: ${tradeQuantity} credits from ${selectedCredit.ngoName} at $${tradePrice}/credit`,
      credits: tradeQuantity,
      amount: tradePrice * tradeQuantity,
      date: new Date().toISOString(),
      transactionId: `0xTRADE${Date.now()}`,
      blockNumber: Math.floor(Math.random() * 1000000),
      ngoName: selectedCredit.ngoName,
      buyer: 'Current User'
    };

    const existingLedger = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
    existingLedger.push(blockchainEntry);
    localStorage.setItem('blockchainLedger', JSON.stringify(existingLedger));

    setShowTradeModal(false);
    setSelectedCredit(null);
    setTradeQuantity(1);
    setTradePrice(0);

    alert(`✅ Trade offer created successfully!\n\n🔄 Offering ${tradeQuantity} credits at $${tradePrice} each\n💰 Total value: $${(tradePrice * tradeQuantity).toFixed(2)}\n🔗 Transaction: ${blockchainEntry.transactionId}`);
  };

  const handleRetireCredits = (purchase: Purchase) => {
    if (confirm(`Are you sure you want to retire ${purchase.creditsQuantity} credits?\n\nRetired credits cannot be traded and represent permanent carbon offset.`)) {
      // Update purchase status
      const updatedPurchases = purchases.map(p => 
        p.id === purchase.id ? { ...p, status: 'retired' as const } : p
      );
      setPurchases(updatedPurchases);
      localStorage.setItem('userPurchases', JSON.stringify(updatedPurchases));

      // Record retirement on blockchain
      const blockchainEntry = {
        type: 'credit_retirement',
        id: purchase.id,
        description: `Retired ${purchase.creditsQuantity} credits from ${purchase.ngoName} for permanent carbon offset`,
        credits: purchase.creditsQuantity,
        date: new Date().toISOString(),
        transactionId: `0xRETIRE${Date.now()}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        ngoName: purchase.ngoName,
        buyer: 'Current User'
      };

      const existingLedger = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
      existingLedger.push(blockchainEntry);
      localStorage.setItem('blockchainLedger', JSON.stringify(existingLedger));

      alert(`✅ Credits retired successfully!\n\n🌍 ${purchase.creditsQuantity} credits representing ${purchase.carbonOffset.toFixed(2)} tons CO₂ permanently offset\n🔗 Transaction: ${blockchainEntry.transactionId}`);
    }
  };

  const totalCreditsOwned = purchases
    .filter(p => p.status === 'active')
    .reduce((sum, p) => sum + p.creditsQuantity, 0);
  
  const totalInvestment = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  
  const totalCarbonOffset = purchases
    .filter(p => p.status === 'retired')
    .reduce((sum, p) => sum + p.carbonOffset, 0);
  
  const activeTradeValue = tradeOffers.reduce((sum, offer) => sum + (offer.askingPrice * offer.quantity), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'traded': return 'bg-blue-100 text-blue-800';
      case 'retired': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅';
      case 'traded': return '🔄';
      case 'retired': return '🌍';
      default: return '📄';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            💼 Carbon Credit Portfolio
          </h1>
          <p className="text-gray-600">
            Manage your carbon credits, create trade offers, and track your environmental impact
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">🌿</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Credits</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCreditsOwned.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Investment</p>
                <p className="text-2xl font-semibold text-gray-900">${totalInvestment.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Trade Offers Value</p>
                <p className="text-2xl font-semibold text-gray-900">${activeTradeValue.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CO₂ Offset (tons)</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCarbonOffset.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('portfolio')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'portfolio'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💼 My Credits Portfolio
            </button>
            <button
              onClick={() => setSelectedTab('trades')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'trades'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔄 My Trade Offers ({tradeOffers.length})
            </button>
          </nav>
        </div>

        {selectedTab === 'portfolio' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Credit Holdings ({purchases.length} purchases)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Purchase Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase) => (
                    <tr key={purchase.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{purchase.projectName}</div>
                          <div className="text-sm text-gray-500">NGO: {purchase.ngoName}</div>
                          <div className="text-sm text-gray-500">📍 {purchase.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="block">🌿 {purchase.creditsQuantity.toFixed(2)} credits</span>
                          <span className="block text-green-600">🌍 {purchase.carbonOffset.toFixed(2)} tons CO₂</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          <span className="block">${purchase.pricePerCredit.toFixed(2)} per credit</span>
                          <span className="block font-medium text-green-600">💰 ${purchase.totalAmount.toFixed(2)} total</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.status)}`}>
                          {getStatusIcon(purchase.status)} {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(purchase.purchaseDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {purchase.status === 'active' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedCredit(purchase);
                                  setTradePrice(purchase.pricePerCredit * 1.1); // Start with 10% markup
                                  setShowTradeModal(true);
                                }}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded"
                              >
                                🔄 Trade
                              </button>
                              <button
                                onClick={() => handleRetireCredits(purchase)}
                                className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-2 py-1 rounded"
                              >
                                🌍 Retire
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {purchases.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">💼</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No credits purchased yet</h3>
                <p className="text-gray-500">Visit the marketplace to purchase carbon credits.</p>
              </div>
            )}
          </div>
        )}

        {selectedTab === 'trades' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Active Trade Offers ({tradeOffers.length} offers)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credit Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Original Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asking Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Profit/Loss
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Posted
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tradeOffers.map((offer) => {
                    const originalPurchase = purchases.find(p => p.id === offer.creditId);
                    const profitMargin = ((offer.askingPrice - offer.originalPrice) / offer.originalPrice) * 100;
                    
                    return (
                      <tr key={offer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          {originalPurchase && (
                            <div>
                              <div className="text-sm font-medium text-gray-900">{originalPurchase.projectName}</div>
                              <div className="text-sm text-gray-500">NGO: {originalPurchase.ngoName}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">🌿 {offer.quantity.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">${offer.originalPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-900">${offer.askingPrice.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <span className={`font-medium ${offer.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {offer.profitLoss >= 0 ? '+' : ''}${offer.profitLoss.toFixed(2)}
                            </span>
                            <span className={`block text-xs ${profitMargin >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ({profitMargin >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%)
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(offer.datePosted).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {tradeOffers.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🔄</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No active trade offers</h3>
                <p className="text-gray-500">Create trade offers from your credit portfolio to start trading.</p>
              </div>
            )}
          </div>
        )}

        {/* Trade Modal */}
        {showTradeModal && selectedCredit && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                🔄 Create Trade Offer
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project
                  </label>
                  <p className="text-sm text-gray-900">{selectedCredit.projectName}</p>
                  <p className="text-sm text-gray-500">Available: {selectedCredit.creditsQuantity} credits</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Trade
                  </label>
                  <input
                    type="number"
                    min="0.1"
                    max={selectedCredit.creditsQuantity}
                    step="0.1"
                    value={tradeQuantity}
                    onChange={(e) => setTradeQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Credit ($)
                  </label>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={tradePrice}
                    onChange={(e) => setTradePrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Original price: ${selectedCredit.pricePerCredit.toFixed(2)}
                  </p>
                </div>

                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between text-sm">
                    <span>Total Trade Value:</span>
                    <span className="font-medium">${(tradeQuantity * tradePrice).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Profit/Loss:</span>
                    <span className={`font-medium ${(tradePrice - selectedCredit.pricePerCredit) * tradeQuantity >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(tradePrice - selectedCredit.pricePerCredit) * tradeQuantity >= 0 ? '+' : ''}
                      ${((tradePrice - selectedCredit.pricePerCredit) * tradeQuantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowTradeModal(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTradeOffer}
                  disabled={tradeQuantity <= 0 || tradePrice <= 0 || tradeQuantity > selectedCredit.creditsQuantity}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Create Offer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}