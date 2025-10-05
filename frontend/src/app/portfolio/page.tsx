'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Leaf, 
  Award,
  Calendar,
  BarChart3,
  PieChart,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'earned';
  credits: number;
  price: number;
  total: number;
  counterparty: string;
  date: string;
  status: 'completed' | 'pending';
}

interface Portfolio {
  totalCredits: number;
  totalValue: number;
  totalSpent: number;
  totalEarned: number;
  holdings: Array<{
    ngo: string;
    credits: number;
    avgPrice: number;
    value: number;
    change: number;
  }>;
  transactions: Transaction[];
}

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<Portfolio>({
    totalCredits: 0,
    totalValue: 0,
    totalSpent: 0,
    totalEarned: 0,
    holdings: [],
    transactions: []
  });

  const [selectedTab, setSelectedTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = () => {
    // Load transaction data and calculate portfolio
    const ledgerData = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
    const userTransactions = JSON.parse(localStorage.getItem('userTransactions') || '[]');
    
    // If no user transactions exist, add sample data
    if (userTransactions.length === 0) {
      const sampleUserTransactions: Transaction[] = [
        {
          id: 'UTX_001',
          type: 'purchase' as const,
          credits: 25,
          price: 50,
          total: 1250,
          counterparty: 'Mangrove Trust Foundation',
          date: '2024-09-25T16:45:00Z',
          status: 'completed' as const
        },
        {
          id: 'UTX_002',
          type: 'purchase' as const,
          credits: 15,
          price: 45,
          total: 675,
          counterparty: 'Ocean Guardians',
          date: '2024-10-01T09:20:00Z',
          status: 'completed' as const
        },
        {
          id: 'UTX_003',
          type: 'sale' as const,
          credits: 10,
          price: 55,
          total: 550,
          counterparty: 'EcoTech Corp',
          date: '2024-10-02T14:30:00Z',
          status: 'completed' as const
        },
        {
          id: 'UTX_004',
          type: 'purchase' as const,
          credits: 20,
          price: 48,
          total: 960,
          counterparty: 'Coastal Care Foundation',
          date: '2024-10-03T11:15:00Z',
          status: 'completed' as const
        }
      ];
      
      localStorage.setItem('userTransactions', JSON.stringify(sampleUserTransactions));
      setPortfolio(calculatePortfolio(sampleUserTransactions));
    } else {
      setPortfolio(calculatePortfolio(userTransactions));
    }
  };

  const calculatePortfolio = (transactions: Transaction[]): Portfolio => {
    let totalCredits = 0;
    let totalSpent = 0;
    let totalEarned = 0;
    const holdings: { [key: string]: any } = {};

    transactions.forEach(tx => {
      if (tx.type === 'purchase') {
        totalCredits += tx.credits;
        totalSpent += tx.total;
        
        if (!holdings[tx.counterparty]) {
          holdings[tx.counterparty] = {
            ngo: tx.counterparty,
            credits: 0,
            totalCost: 0,
            transactions: 0
          };
        }
        holdings[tx.counterparty].credits += tx.credits;
        holdings[tx.counterparty].totalCost += tx.total;
        holdings[tx.counterparty].transactions += 1;
      } else if (tx.type === 'sale') {
        totalCredits -= tx.credits;
        totalEarned += tx.total;
      }
    });

    const holdingsArray = Object.values(holdings).map((holding: any) => ({
      ngo: holding.ngo,
      credits: holding.credits,
      avgPrice: holding.totalCost / holding.credits,
      value: holding.credits * 52, // Current market price ~$52
      change: ((52 - (holding.totalCost / holding.credits)) / (holding.totalCost / holding.credits)) * 100
    }));

    const totalValue = holdingsArray.reduce((sum, holding) => sum + holding.value, 0);

    return {
      totalCredits,
      totalValue,
      totalSpent,
      totalEarned,
      holdings: holdingsArray,
      transactions: transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    };
  };

  const chartData = [
    { date: '2024-09-15', value: 0 },
    { date: '2024-09-25', value: 1250 },
    { date: '2024-10-01', value: 1925 },
    { date: '2024-10-02', value: 1375 },
    { date: '2024-10-03', value: 2335 },
    { date: '2024-10-04', value: 2600 }
  ];

  const pieData = portfolio.holdings.map((holding, index) => ({
    name: holding.ngo,
    value: holding.credits,
    color: ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'][index % 5]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Portfolio</h1>
          <p className="text-gray-600">Track your carbon credit investments and transactions</p>
        </div>

        {/* Portfolio Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <Leaf className="h-8 w-8 text-green-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900">{portfolio.totalCredits}</p>
              <p className="text-sm text-green-600">+12.5% this month</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">${portfolio.totalValue.toLocaleString()}</p>
              <p className="text-sm text-green-600">+8.3% this month</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <ArrowDownRight className="h-8 w-8 text-red-600" />
              <span className="text-sm text-gray-500">Spent</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Total Invested</p>
              <p className="text-2xl font-bold text-gray-900">${portfolio.totalSpent.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <ArrowUpRight className="h-8 w-8 text-green-600" />
              <span className="text-sm text-gray-500">Earned</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900">${portfolio.totalEarned.toLocaleString()}</p>
              <p className="text-sm text-green-600">ROI: {((portfolio.totalValue + portfolio.totalEarned - portfolio.totalSpent) / portfolio.totalSpent * 100).toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            {['overview', 'holdings', 'transactions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  selectedTab === tab
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Portfolio Performance Chart */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Performance</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Holdings Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Holdings Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {selectedTab === 'holdings' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Current Holdings</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NGO</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.holdings.map((holding, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{holding.ngo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {holding.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${holding.avgPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${holding.value.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${holding.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.change >= 0 ? '+' : ''}{holding.change.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === 'transactions' && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Transaction History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {portfolio.transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(tx.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.type === 'purchase' ? 'bg-blue-100 text-blue-800' :
                          tx.type === 'sale' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.credits}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${tx.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={tx.type === 'sale' ? 'text-green-600' : 'text-gray-900'}>
                          {tx.type === 'sale' ? '+' : '-'}${tx.total.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tx.counterparty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          tx.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}