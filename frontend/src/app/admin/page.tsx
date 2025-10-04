'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye,
  FileText,
  Users,
  TreePine,
  BarChart3
} from 'lucide-react';

interface PendingProject {
  id: string;
  ngoName: string;
  projectName: string;
  location: string;
  submissionDate: string;
  claimedTrees: number;
  status: 'pending' | 'approved' | 'rejected';
  aiResults?: {
    tree_count: number;
    ndvi_score: number;
    iot_score: number;
    final_score: number;
  };
}

export default function AdminDashboard() {
  const [projects, setProjects] = useState<PendingProject[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedProject, setSelectedProject] = useState<PendingProject | null>(null);

  useEffect(() => {
    loadPendingProjects();
  }, []);

  const loadPendingProjects = () => {
    // Load real projects from localStorage (uploaded by NGOs)
    const userProjects = JSON.parse(localStorage.getItem('userProjects') || '[]');
    const adminQueue = JSON.parse(localStorage.getItem('adminReviewQueue') || '[]');
    
    // Combine and filter projects that need admin review
    const pendingProjects = [...userProjects, ...adminQueue].filter(project => 
      project.status === 'pending_admin_review' || project.status === 'pending'
    );

    // Transform to admin format if needed
    const transformedProjects = pendingProjects.map(project => ({
      id: project.id,
      ngoName: project.ngoName,
      projectName: project.projectName,
      location: project.location,
      submissionDate: project.submissionDate,
      claimedTrees: project.aiResults?.tree_count || 0,
      status: project.status === 'pending_admin_review' ? 'pending' : project.status,
      aiResults: {
        tree_count: project.aiResults?.tree_count || 0,
        ndvi_score: project.aiResults?.ndvi_score ? (project.aiResults.ndvi_score * 100) : 0,
        iot_score: project.aiResults?.iot_score ? (project.aiResults.iot_score * 100) : 0,
        final_score: project.aiResults?.final_score || 0
      },
      originalProject: project // Keep reference to original project data
    }));

    // If no real projects, add sample projects for demo
    if (transformedProjects.length === 0) {
      const mockProjects: PendingProject[] = [
        {
          id: 'DEMO_001',
          ngoName: 'Demo - Sundarbans Conservation Society',
          projectName: 'Demo - Mangrove Restoration Phase 2',
          location: 'Sundarbans, Bangladesh',
          submissionDate: '2025-10-04T08:30:00Z',
          claimedTrees: 150,
          status: 'pending',
          aiResults: {
            tree_count: 147,
            ndvi_score: 78.5,
            iot_score: 85.2,
            final_score: 83.7
          }
        }
      ];
      setProjects(mockProjects);
    } else {
      setProjects(transformedProjects);
    }
    
    console.log(`📋 Loaded ${transformedProjects.length} real projects for admin review`);
  };

  const handleApproval = (projectId: string, decision: 'approved' | 'rejected') => {
    const project = projects.find(p => p.id === projectId);
    
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status: decision }
        : project
    ));
    
    if (project && decision === 'approved') {
      // Add approved project to marketplace
      const marketplaceListing = {
        id: `MARKETPLACE_${Date.now()}`,
        ngoId: project.id,
        ngoName: project.ngoName,
        projectName: project.projectName,
        location: project.location,
        creditsAvailable: project.aiResults ? (project.aiResults.final_score / 10) : 5.0,
        pricePerCredit: 15.00 + Math.random() * 10, // Random price between $15-25
        verificationScore: project.aiResults ? project.aiResults.final_score / 100 : 0.85,
        vintageYear: 2025,
        projectType: 'mangrove_plantation',
        verificationStandard: 'EcoLedger_AI_v1.0',
        description: `AI-verified mangrove restoration project with ${project.aiResults?.tree_count || 0} trees planted.`,
        totalTrees: project.aiResults?.tree_count || 0,
        co2Absorbed: (project.aiResults?.tree_count || 0) * 12.3
      };
      
      // Store in marketplace listings
      const existingListings = JSON.parse(localStorage.getItem('marketplaceListings') || '[]');
      existingListings.push(marketplaceListing);
      localStorage.setItem('marketplaceListings', JSON.stringify(existingListings));
      
      // Add to blockchain ledger
      const blockchainEntry = {
        type: 'project_approval',
        id: projectId,
        description: `Project "${project.projectName}" approved and credits issued`,
        credits: marketplaceListing.creditsAvailable,
        date: new Date().toISOString(),
        transactionId: `0xAPPROVAL${Date.now()}`,
        blockNumber: Math.floor(Math.random() * 1000000),
        ngoName: project.ngoName,
        location: project.location
      };
      
      const existingLedger = JSON.parse(localStorage.getItem('blockchainLedger') || '[]');
      existingLedger.push(blockchainEntry);
      localStorage.setItem('blockchainLedger', JSON.stringify(existingLedger));
      
      alert(`✅ Project "${project.projectName}" approved!\n\n📈 Added to marketplace with ${marketplaceListing.creditsAvailable.toFixed(2)} credits\n💰 Price: $${marketplaceListing.pricePerCredit.toFixed(2)} per credit\n🔗 Recorded on blockchain: ${blockchainEntry.transactionId}`);
    } else if (project) {
      alert(`Project "${project.projectName}" has been ${decision}!`);
    }
    
    setSelectedProject(null);
  };

  const filteredProjects = projects.filter(project => 
    filter === 'all' || project.status === filter
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />;
      default: return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Verify and approve mangrove projects</p>
              </div>
            </div>
            <nav className="flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/upload" className="text-gray-600 hover:text-gray-900">Upload</Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/marketplace" className="text-gray-600 hover:text-gray-900">Marketplace</Link>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'rejected').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center">
              <TreePine className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Trees</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {projects.filter(p => p.status === 'approved')
                    .reduce((sum, p) => sum + (p.aiResults?.tree_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {['all', 'pending', 'approved', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    filter === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab} ({projects.filter(p => tab === 'all' || p.status === tab).length})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Projects for Review</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredProjects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{project.projectName}</h3>
                        <p className="text-gray-600">{project.ngoName} • {project.location}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Submitted: {new Date(project.submissionDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="ml-6 text-right">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1 capitalize">{project.status}</span>
                        </div>
                      </div>
                    </div>

                    {project.aiResults && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded">
                          <p className="text-sm text-gray-600">Trees Detected</p>
                          <p className="text-lg font-semibold text-green-600">{project.aiResults.tree_count}</p>
                          <p className="text-xs text-gray-500">Claimed: {project.claimedTrees}</p>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <p className="text-sm text-gray-600">NDVI Score</p>
                          <p className="text-lg font-semibold text-blue-600">{project.aiResults.ndvi_score.toFixed(1)}%</p>
                        </div>
                        <div className="text-center p-3 bg-orange-50 rounded">
                          <p className="text-sm text-gray-600">IoT Score</p>
                          <p className="text-lg font-semibold text-orange-600">{project.aiResults.iot_score.toFixed(1)}%</p>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <p className="text-sm text-gray-600">Final Score</p>
                          <p className="text-lg font-semibold text-purple-600">{project.aiResults.final_score.toFixed(1)}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Details
                  </button>
                  
                  {project.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApproval(project.id, 'approved')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleApproval(project.id, 'rejected')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Project Review Details</h3>
                  <button
                    onClick={() => setSelectedProject(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedProject.projectName}</h4>
                    <p className="text-gray-600">{selectedProject.ngoName}</p>
                    <p className="text-gray-600">{selectedProject.location}</p>
                  </div>

                  {selectedProject.aiResults && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <h5 className="font-medium">AI Analysis Results</h5>
                        <p>Trees Detected: {selectedProject.aiResults.tree_count}</p>
                        <p>Claimed Trees: {selectedProject.claimedTrees}</p>
                        <p>Accuracy: {((selectedProject.aiResults.tree_count / selectedProject.claimedTrees) * 100).toFixed(1)}%</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded">
                        <h5 className="font-medium">Environmental Scores</h5>
                        <p>NDVI Health: {selectedProject.aiResults.ndvi_score.toFixed(1)}%</p>
                        <p>IoT Environmental: {selectedProject.aiResults.iot_score.toFixed(1)}%</p>
                        <p>Final Score: {selectedProject.aiResults.final_score.toFixed(1)}%</p>
                      </div>
                    </div>
                  )}

                  {selectedProject.status === 'pending' && (
                    <div className="flex space-x-4 pt-4">
                      <button
                        onClick={() => handleApproval(selectedProject.id, 'approved')}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                      >
                        ✓ Approve Project
                      </button>
                      <button
                        onClick={() => handleApproval(selectedProject.id, 'rejected')}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                      >
                        ✗ Reject Project
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}