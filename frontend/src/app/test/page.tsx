'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TestPage() {
  const [testResults, setTestResults] = useState({
    storage: {},
    navigation: {},
    dataFlow: {},
    backend: {}
  });

  useEffect(() => {
    runSystemTests();
  }, []);

  const runSystemTests = () => {
    console.log('🧪 Running EcoLedger System Tests...');

    // Test 1: Storage Tests
    const storageTests = testStorageSystem();
    
    // Test 2: Navigation Tests  
    const navigationTests = testNavigationSystem();
    
    // Test 3: Data Flow Tests
    const dataFlowTests = testDataFlow();
    
    // Test 4: Backend Tests
    const backendTests = testBackendConnection();

    setTestResults({
      storage: storageTests,
      navigation: navigationTests,
      dataFlow: dataFlowTests,
      backend: backendTests
    });
  };

  const testStorageSystem = () => {
    const storageKeys = [
      'ecoledger_user_projects',
      'ecoledger_admin_queue',
      'ecoledger_approved_projects', 
      'ecoledger_marketplace',
      'ecoledger_blockchain'
    ];

    const results = {};
    storageKeys.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        const parsed = data ? JSON.parse(data) : [];
        results[key] = {
          exists: !!data,
          count: Array.isArray(parsed) ? parsed.length : 0,
          status: 'working'
        };
      } catch (error) {
        results[key] = {
          exists: false,
          count: 0,
          status: 'error',
          error: error.message
        };
      }
    });

    return results;
  };

  const testNavigationSystem = () => {
    const currentHost = window.location.hostname;
    const basePath = currentHost.includes('github.io') ? '/EcoLedger' : '';
    
    return {
      currentHost,
      basePath,
      isGitHubPages: currentHost.includes('github.io'),
      dashboardUrl: `${window.location.origin}${basePath}/dashboard`,
      uploadUrl: `${window.location.origin}${basePath}/upload`,
      adminUrl: `${window.location.origin}${basePath}/admin`,
      marketplaceUrl: `${window.location.origin}${basePath}/marketplace`
    };
  };

  const testDataFlow = () => {
    // Add a test project to verify data flow
    const testProject = {
      id: `TEST_${Date.now()}`,
      ngoName: 'System Test NGO',
      projectName: 'Data Flow Test Project',
      location: 'Test Environment',
      claimedTrees: 50,
      status: 'Pending Verification',
      submissionDate: new Date().toISOString(),
      aiResults: {
        yoloScore: '85.0',
        ndviScore: '80.0',
        iotScore: '90.0',
        finalScore: '85.0',
        confidence: 'High'
      }
    };

    try {
      // Test adding project
      const existing = JSON.parse(localStorage.getItem('ecoledger_user_projects') || '[]');
      existing.push(testProject);
      localStorage.setItem('ecoledger_user_projects', JSON.stringify(existing));

      // Test reading project back
      const verification = JSON.parse(localStorage.getItem('ecoledger_user_projects') || '[]');
      const found = verification.find(p => p.id === testProject.id);

      return {
        addSuccess: true,
        readSuccess: !!found,
        totalProjects: verification.length,
        testProjectFound: !!found,
        status: found ? 'working' : 'error'
      };
    } catch (error) {
      return {
        addSuccess: false,
        readSuccess: false,
        totalProjects: 0,
        testProjectFound: false,
        status: 'error',
        error: error.message
      };
    }
  };

  const testBackendConnection = () => {
    // For now, just return basic info since we're using localStorage
    return {
      mode: 'localStorage',
      status: 'simulated',
      aiModels: {
        yolo: 'simulated',
        ndvi: 'simulated', 
        iot: 'simulated'
      },
      blockchain: 'simulated',
      note: 'Using localStorage simulation for GitHub Pages deployment'
    };
  };

  const clearTestData = () => {
    if (confirm('Clear all test data from localStorage?')) {
      const storageKeys = [
        'ecoledger_user_projects',
        'ecoledger_admin_queue',
        'ecoledger_approved_projects',
        'ecoledger_marketplace', 
        'ecoledger_blockchain'
      ];
      
      storageKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      
      alert('Test data cleared! Refresh the page to run tests again.');
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧪 EcoLedger System Test
            </h1>
            <p className="text-lg text-gray-600">
              Comprehensive testing of upload → dashboard data flow and routing
            </p>
          </div>

          {/* Navigation Test */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🧭 Navigation Test</h2>
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Environment:</strong> {testResults.navigation.isGitHubPages ? 'GitHub Pages' : 'Local'}
                </div>
                <div>
                  <strong>Base Path:</strong> {testResults.navigation.basePath || 'None (local)'}
                </div>
                <div>
                  <strong>Host:</strong> {testResults.navigation.currentHost}
                </div>
                <div>
                  <strong>Dashboard URL:</strong> {testResults.navigation.dashboardUrl}
                </div>
              </div>
              <div className="mt-4 flex gap-2 flex-wrap">
                <Link href="/upload" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                  Test Upload Page
                </Link>
                <Link href="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  Test Dashboard Page
                </Link>
                <Link href="/admin" className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600">
                  Test Admin Page
                </Link>
                <Link href="/marketplace" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                  Test Marketplace Page
                </Link>
              </div>
            </div>
          </div>

          {/* Storage Test */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💾 Storage System Test</h2>
            <div className="bg-green-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(testResults.storage).map(([key, result]) => (
                  <div key={key} className="bg-white rounded-lg p-4 border">
                    <div className="text-sm font-mono text-gray-600">{key}</div>
                    <div className={`text-lg font-bold ${result.status === 'working' ? 'text-green-600' : 'text-red-600'}`}>
                      {result.exists ? '✅' : '❌'} {result.count} items
                    </div>
                    {result.error && (
                      <div className="text-xs text-red-500 mt-1">{result.error}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Data Flow Test */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🔄 Data Flow Test</h2>
            <div className="bg-yellow-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Add Project:</strong> 
                  <span className={`ml-2 ${testResults.dataFlow.addSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.dataFlow.addSuccess ? '✅ Success' : '❌ Failed'}
                  </span>
                </div>
                <div>
                  <strong>Read Project:</strong>
                  <span className={`ml-2 ${testResults.dataFlow.readSuccess ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.dataFlow.readSuccess ? '✅ Success' : '❌ Failed'}
                  </span>
                </div>
                <div>
                  <strong>Total Projects:</strong> {testResults.dataFlow.totalProjects}
                </div>
                <div>
                  <strong>Test Project Found:</strong>
                  <span className={`ml-2 ${testResults.dataFlow.testProjectFound ? 'text-green-600' : 'text-red-600'}`}>
                    {testResults.dataFlow.testProjectFound ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
              </div>
              {testResults.dataFlow.error && (
                <div className="mt-4 p-3 bg-red-100 rounded-lg text-red-700">
                  Error: {testResults.dataFlow.error}
                </div>
              )}
            </div>
          </div>

          {/* Backend Test */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🖥️ Backend Status</h2>
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <strong>Mode:</strong> {testResults.backend.mode}
                </div>
                <div>
                  <strong>Status:</strong> {testResults.backend.status}
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                {testResults.backend.note}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="text-center space-y-4">
            <button 
              onClick={runSystemTests}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 font-semibold"
            >
              🔄 Run Tests Again
            </button>
            <button 
              onClick={clearTestData}
              className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700 font-semibold ml-4"
            >
              🗑️ Clear Test Data
            </button>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}