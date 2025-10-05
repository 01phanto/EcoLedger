'use client';

import { useState, useEffect } from 'react';

interface BlockchainEntry {
  type: string;
  id: string;
  description: string;
  credits?: number;
  amount?: number;
  buyer?: string;
  seller?: string;
  date: string;
  transactionId: string;
  blockNumber: number;
  ngoName?: string;
  location?: string;
  status?: string;
}

interface CreditBalance {
  ngoName: string;
  totalCredits: number;
  availableCredits: number;
  tradedCredits: number;
  totalValue: number;
}

export default function BlockchainLedger() {
  const [transactions, setTransactions] = useState<BlockchainEntry[]>([]);
  const [creditBalances, setCreditBalances] = useState<CreditBalance[]>([]);
  const [selectedTab, setSelectedTab] = useState('transactions');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = () => {
    // Load transactions from localStorage
    let ledgerData = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
    
    // If no data exists, add sample transaction data
    if (ledgerData.length === 0) {
      const sampleTransactions = [
        {
          type: 'project_approval',
          id: 'TXN_001',
          description: 'Mangrove Trust Foundation - Sundarbans Restoration Phase 1 approved',
          credits: 54.1,
          date: '2024-09-15T10:30:00Z',
          transactionId: '0xabc123...def456',
          blockNumber: 1001,
          ngoName: 'Mangrove Trust Foundation',
          location: 'Bangladesh',
          status: 'Verified'
        },
        {
          type: 'project_approval',
          id: 'TXN_002',
          description: 'Ocean Guardians - Coastal Protection Initiative approved',
          credits: 32.8,
          date: '2024-09-20T14:15:00Z',
          transactionId: '0x789abc...123def',
          blockNumber: 1002,
          ngoName: 'Ocean Guardians',
          location: 'Philippines',
          status: 'Verified'
        },
        {
          type: 'credit_purchase',
          id: 'TXN_003',
          description: 'EcoTech Corp purchased 25 carbon credits',
          credits: 25,
          amount: 1250,
          buyer: 'EcoTech Corp',
          seller: 'Mangrove Trust Foundation',
          date: '2024-09-25T16:45:00Z',
          transactionId: '0x456def...789abc',
          blockNumber: 1003,
          ngoName: 'Mangrove Trust Foundation'
        },
        {
          type: 'credit_purchase',
          id: 'TXN_004',
          description: 'Green Solutions Ltd purchased 15 carbon credits',
          credits: 15,
          amount: 750,
          buyer: 'Green Solutions Ltd',
          seller: 'Ocean Guardians',
          date: '2024-10-01T09:20:00Z',
          transactionId: '0x654321...098765',
          blockNumber: 1004,
          ngoName: 'Ocean Guardians'
        },
        {
          type: 'project_approval',
          id: 'TXN_005',
          description: 'Coastal Care Foundation - Mangrove Ecosystem Restoration approved',
          credits: 47.3,
          date: '2024-10-03T11:30:00Z',
          transactionId: '0x111222...333444',
          blockNumber: 1005,
          ngoName: 'Coastal Care Foundation',
          location: 'Indonesia',
          status: 'Verified'
        }
      ];
      
      // Save sample data to localStorage
      localStorage.setItem('blockchainLedger', JSON.stringify(sampleTransactions));
      ledgerData = sampleTransactions;
    }
    
    setTransactions(ledgerData.sort((a: BlockchainEntry, b: BlockchainEntry) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));

    // Calculate credit balances
    const balances: { [key: string]: CreditBalance } = {};
    
    ledgerData.forEach((entry: BlockchainEntry) => {
      if (entry.ngoName) {
        if (!balances[entry.ngoName]) {
          balances[entry.ngoName] = {
            ngoName: entry.ngoName,
            totalCredits: 0,
            availableCredits: 0,
            tradedCredits: 0,
            totalValue: 0
          };
        }

        if (entry.type === 'project_approval' && entry.credits) {
          balances[entry.ngoName].totalCredits += entry.credits;
          balances[entry.ngoName].availableCredits += entry.credits;
        } else if (entry.type === 'credit_purchase' && entry.credits) {
          balances[entry.ngoName].tradedCredits += entry.credits;
          balances[entry.ngoName].availableCredits -= entry.credits;
          if (entry.amount) {
            balances[entry.ngoName].totalValue += entry.amount;
          }
        }
      }
    });

    setCreditBalances(Object.values(balances));
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.ngoName && tx.ngoName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'project_approval': return '✅';
      case 'credit_purchase': return '💰';
      case 'credit_trade': return '🔄';
      default: return '📝';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'project_approval': return 'text-green-600';
      case 'credit_purchase': return 'text-blue-600';
      case 'credit_trade': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const totalCreditsIssued = creditBalances.reduce((sum, balance) => sum + balance.totalCredits, 0);
  const totalCreditsTraded = creditBalances.reduce((sum, balance) => sum + balance.tradedCredits, 0);
  const totalValueTraded = creditBalances.reduce((sum, balance) => sum + balance.totalValue, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Blockchain Ledger Dashboard
          </h1>
          <p className="text-gray-600">
            Complete transaction history and credit tracking on the EcoLedger blockchain
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Credits Issued</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCreditsIssued.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Credits Traded</p>
                <p className="text-2xl font-semibold text-gray-900">{totalCreditsTraded.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">💵</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value Traded</p>
                <p className="text-2xl font-semibold text-gray-900">${totalValueTraded.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔗</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setSelectedTab('transactions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'transactions'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              🔗 All Transactions
            </button>
            <button
              onClick={() => setSelectedTab('balances')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedTab === 'balances'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              💳 Credit Balances
            </button>
          </nav>
        </div>

        {selectedTab === 'transactions' && (
          <>
            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow mb-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Transactions
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by description, transaction ID, or NGO name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Type
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Transactions</option>
                    <option value="project_approval">Project Approvals</option>
                    <option value="credit_purchase">Credit Purchases</option>
                    <option value="credit_trade">Credit Trades</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Transaction History ({filteredTransactions.length} transactions)
                </h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits/Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Block #
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map((transaction, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg mr-2">{getTransactionIcon(transaction.type)}</span>
                            <span className={`text-sm font-medium capitalize ${getTransactionColor(transaction.type)}`}>
                              {transaction.type.replace('_', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{transaction.description}</div>
                          {transaction.ngoName && (
                            <div className="text-sm text-gray-500">NGO: {transaction.ngoName}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {transaction.credits && (
                              <span className="block">🌿 {transaction.credits.toFixed(2)} credits</span>
                            )}
                            {transaction.amount && (
                              <span className="block text-green-600">💰 ${transaction.amount.toFixed(2)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {transaction.transactionId}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          #{transaction.blockNumber.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <span className="text-4xl mb-4 block">🔍</span>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          </>
        )}

        {selectedTab === 'balances' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Credit Balances by NGO ({creditBalances.length} organizations)
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NGO Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Credits Issued
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Traded Credits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trading Rate
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {creditBalances.map((balance, index) => {
                    const tradingRate = balance.totalCredits > 0 ? (balance.tradedCredits / balance.totalCredits) * 100 : 0;
                    
                    return (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{balance.ngoName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">🌿 {balance.totalCredits.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-green-600">✅ {balance.availableCredits.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-blue-600">📈 {balance.tradedCredits.toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-green-600 font-medium">
                            💰 ${balance.totalValue.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(tradingRate, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{tradingRate.toFixed(1)}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {creditBalances.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">💳</span>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No credit balances found</h3>
                <p className="text-gray-500">Credits will appear here once projects are approved and traded.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}