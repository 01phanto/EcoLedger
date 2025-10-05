'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, RefreshCw, TreePine, Award } from 'lucide-react';
import { fetchReports, getApiStatus, type ReportData } from '../../utils/api';

export default function AdminDashboard() {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<'live' | 'mock'>('mock');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const response = await fetchReports();
      setReports(response.data);
      setDataSource(response.source);
      console.log('Admin loaded reports:', response.data.length);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = (projectId: string, decision: 'approved' | 'rejected') => {
    setReports(prev => prev.map(report => 
      report.id === projectId 
        ? { ...report, status: decision === 'approved' ? 'Verified' : 'Rejected' }
        : report
    ));
    alert('Project ' + decision + ' successfully!');
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const apiStatus = getApiStatus();
  const totalCredits = reports.reduce((sum, report) => sum + report.credits, 0);
  const verifiedCount = reports.filter(r => r.status === 'Verified').length;
  const pendingCount = reports.filter(r => r.status === 'Pending').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <TreePine className="h-8 w-8 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">EcoLedger Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TreePine className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Projects</dt>
                    <dd className="text-lg font-medium text-gray-900">{reports.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                    <dd className="text-lg font-medium text-gray-900">{verifiedCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{pendingCount}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Award className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Credits</dt>
                    <dd className="text-lg font-medium text-gray-900">{totalCredits.toFixed(1)}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-100 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-blue-900 mb-2">Verification Workflow</h2>
          <div className="text-blue-800">
            NGO Upload  Admin Review  Blockchain Ledger  Carbon Trading
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg leading-6 font-medium text-gray-900">Project Reports</h2>
              <button
                onClick={loadReports}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </button>
            </div>
          </div>
          <ul className="divide-y divide-gray-200">
            {reports.map((report) => (
              <li key={report.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <TreePine className="h-6 w-6 text-green-400" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{report.projectName}</div>
                        <div className="text-sm text-gray-500">{report.ngo}  {report.location}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{report.trees.toLocaleString()} trees</div>
                        <div className="text-sm text-gray-500">{report.credits.toFixed(1)} credits</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">Score: {report.score}</div>
                        <div className="text-sm text-gray-500">NDVI: {(report.ndvi * 100).toFixed(0)}%  IoT: {(report.iot * 100).toFixed(0)}%</div>
                      </div>
                      <span className={'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ' + getStatusClass(report.status)}>
                        {report.status}
                      </span>
                      {report.status === 'Pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApproval(report.id, 'approved')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleApproval(report.id, 'rejected')}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {reports.length === 0 && (
            <div className="px-4 py-12 text-center">
              <TreePine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No project reports found</p>
              <p className="text-sm text-gray-400 mt-2">
                NGO projects will appear here once submitted
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
