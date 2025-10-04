'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Leaf, 
  BarChart3, 
  TrendingUp, 
  TreePine, 
  Zap, 
  Award,
  ExternalLink,
  RefreshCw,
  Eye
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';

interface DashboardData {
  projects: any[];
  stats: {
    totalProjects: number;
    totalTrees: number;
    totalCredits: number;
    avgScore: number;
  };
  recentActivity: any[];
  loading: boolean;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    projects: [],
    stats: {
      totalProjects: 0,
      totalTrees: 0,
      totalCredits: 0,
      avgScore: 0
    },
    recentActivity: [],
    loading: true
  });

  const [selectedProject, setSelectedProject] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load real user projects and activities
      const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
      const approvedProjects = JSON.parse(localStorage.getItem('approvedProjects') || '[]');
      const blockchainLedger = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
      const userPurchases = JSON.parse(localStorage.getItem('userPurchases') || '[]');

      // Transform user projects to dashboard format
      const transformedProjects = [...userProjects, ...approvedProjects].map(project => ({
        id: project.id,
        name: project.projectName || project.name,
        location: project.location,
        treeCount: project.aiResults?.tree_count || project.treeCount || 0,
        claimedTrees: project.claimedTrees || project.treeCount || 0,
        finalScore: (project.aiResults?.final_score || 0) / 100,
        carbonCredits: project.carbonCredits || (project.aiResults?.final_score || 0) * 0.01,
        status: project.status === 'approved' ? 'Verified' : 
                project.status === 'pending' ? 'Pending Review' :
                project.status === 'rejected' ? 'Rejected' : 'Under Review',
        date: project.submissionDate || project.date || new Date().toISOString().split('T')[0],
        blockchainTx: project.blockchainTx || null,
        aiScores: {
          treeScore: (project.aiResults?.tree_count || 75) / 100,
          ndviScore: (project.aiResults?.ndvi_score || 0.7),
          iotScore: (project.aiResults?.IoT_Score || 0.75),
          auditScore: (project.aiResults?.final_score || 80) / 100
        }
      }));

      // Fallback to sample data if no real projects exist
      const sampleProjects = transformedProjects.length > 0 ? transformedProjects : [
        {
          id: 'SAMPLE_001',
          name: 'Sample Mangrove Project',
          location: 'Demo Location',
          treeCount: 100,
          claimedTrees: 100,
          finalScore: 0.75,
          carbonCredits: 0.75,
          status: 'Sample Data',
          date: new Date().toISOString().split('T')[0],
          blockchainTx: null,
          aiScores: {
            treeScore: 0.8,
            ndviScore: 0.75,
            iotScore: 0.7,
            auditScore: 0.75
          }
        }
      ];

      const stats = {
        totalProjects: sampleProjects.length,
        totalTrees: sampleProjects.reduce((sum, p) => sum + p.treeCount, 0),
        totalCredits: sampleProjects.reduce((sum, p) => sum + p.carbonCredits, 0),
        avgScore: sampleProjects.length > 0 ? 
          sampleProjects.reduce((sum, p) => sum + p.finalScore, 0) / sampleProjects.length : 0
      };

      // Generate real activity from recent projects and purchases
      const recentActivity = [];
      
      // Add recent project activities
      sampleProjects.slice(0, 3).forEach((project, index) => {
        if (project.status === 'Verified') {
          recentActivity.push({
            type: 'verification',
            title: 'Project verified successfully',
            project: project.name,
            timestamp: `${index + 1} ${index === 0 ? 'hour' : 'day'}${index > 0 ? 's' : ''} ago`
          });
        } else if (project.status === 'Pending Review') {
          recentActivity.push({
            type: 'review',
            title: 'Project submitted for review',
            project: project.name,
            timestamp: `${index + 1} day${index > 0 ? 's' : ''} ago`
          });
        }
      });

      // Add purchase activities
      userPurchases.slice(0, 2).forEach((purchase: any, index: number) => {
        recentActivity.push({
          type: 'credits',
          title: `Purchased ${purchase.amount} carbon credits`,
          project: purchase.projectName,
          timestamp: `${index + 2} day${index > 0 ? 's' : ''} ago`
        });
      });

      // Fallback activity if no real data
      if (recentActivity.length === 0) {
        recentActivity.push({
          type: 'info',
          title: 'Welcome to EcoLedger Dashboard',
          project: 'Upload your first project to get started',
          timestamp: 'now'
        });
      }

      setData({
        projects: sampleProjects,
        stats,
        recentActivity: recentActivity.slice(0, 5), // Limit to 5 items
        loading: false
      });

      console.log(`📊 Dashboard loaded: ${sampleProjects.length} projects, ${stats.totalTrees} trees, ${stats.totalCredits.toFixed(2)} credits`);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setData(prev => ({ ...prev, loading: false }));
    }
  };

  const scoreColors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'text-green-600 bg-green-100';
      case 'Needs Review': return 'text-yellow-600 bg-yellow-100';
      case 'Rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const chartData = data.projects.map(project => ({
    name: project.name.split(' ')[0],
    score: Math.round(project.finalScore * 100),
    trees: project.treeCount,
    credits: project.carbonCredits
  }));

  const pieData = data.projects.length > 0 ? [
    { name: 'Tree Detection', value: Math.round(data.projects[0].aiScores.treeScore * 100), color: '#10B981' },
    { name: 'NDVI Health', value: Math.round(data.projects[0].aiScores.ndviScore * 100), color: '#3B82F6' },
    { name: 'IoT Conditions', value: Math.round(data.projects[0].aiScores.iotScore * 100), color: '#8B5CF6' },
    { name: 'Audit Check', value: Math.round(data.projects[0].aiScores.auditScore * 100), color: '#F59E0B' }
  ] : [];

  if (data.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Leaf className="h-8 w-8 text-green-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">EcoLedger</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/upload" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Upload
              </Link>
              <Link href="/marketplace" className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md">
                Marketplace
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Dashboard</h1>
          <p className="text-gray-600">Monitor your mangrove plantation projects and carbon credit status</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.totalProjects}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TreePine className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Trees Verified</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.totalTrees.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Carbon Credits</p>
                <p className="text-2xl font-semibold text-gray-900">{data.stats.totalCredits.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg Score</p>
                <p className="text-2xl font-semibold text-gray-900">{(data.stats.avgScore * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Your Projects</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {data.projects.map((project) => (
                  <div key={project.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                        <p className="text-sm text-gray-500">{project.location} • {project.date}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-gray-600">
                            Trees: {project.treeCount}/{project.claimedTrees}
                          </span>
                          <span className="text-sm text-gray-600">
                            Score: {(project.finalScore * 100).toFixed(1)}%
                          </span>
                          <span className="text-sm text-gray-600">
                            Credits: {project.carbonCredits.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                          {project.status}
                        </span>
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Charts */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={2} name="Score %" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6 space-y-4">
                {data.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.project}</p>
                      <p className="text-xs text-gray-400">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Score Breakdown */}
            {pieData.length > 0 && (
              <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Latest Project AI Scores</h3>
                </div>
                <div className="p-6">
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Score']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 space-y-3">
                <Link
                  href="/upload"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  New Verification
                </Link>
                <Link
                  href="/marketplace"
                  className="w-full border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition duration-200 flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit Marketplace
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">{selectedProject.name}</h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedProject.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedProject.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trees Detected</p>
                  <p className="font-medium">{selectedProject.treeCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Final Score</p>
                  <p className="font-medium">{(selectedProject.finalScore * 100).toFixed(1)}%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">AI Score Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tree Detection</span>
                    <span className="text-sm font-medium">{(selectedProject.aiScores.treeScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">NDVI Health</span>
                    <span className="text-sm font-medium">{(selectedProject.aiScores.ndviScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">IoT Conditions</span>
                    <span className="text-sm font-medium">{(selectedProject.aiScores.iotScore * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Audit Check</span>
                    <span className="text-sm font-medium">{(selectedProject.aiScores.auditScore * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}