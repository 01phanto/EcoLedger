/**
 * EcoLedger API Utility with Mock Data Fallback
 * Handles live backend API calls with automatic fallback to mock data
 */

export interface ReportData {
  id: string;
  ngo: string;
  projectName: string;
  location: string;
  trees: number;
  claimedTrees: number;
  ndvi: number;
  iot: number;
  score: string;
  credits: number;
  status: 'Verified' | 'Pending' | 'Rejected';
  submissionDate: string;
  verificationDate?: string;
  blockchainTx?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  source: 'live' | 'mock';
  error?: string;
}

// Configuration
const API_CONFIG = {
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || '',
  TIMEOUT: 5000,
  RETRY_ATTEMPTS: 2
};

// Mock data for hackathon demo
const MOCK_REPORTS: ReportData[] = [
  {
    id: 'eco-001',
    ngo: 'Mangrove Trust',
    projectName: 'Sundarbans Restoration Phase 1',
    location: 'Sundarbans, Bangladesh',
    trees: 950,
    claimedTrees: 950,
    ndvi: 0.8,
    iot: 0.9,
    score: '91%',
    credits: 10.6,
    status: 'Verified',
    submissionDate: '2024-09-15',
    verificationDate: '2024-09-22',
    blockchainTx: '0x7f9b4c8a2d3e5f1a8b9c2d4e6f7a9b1c3d5e7f9a'
  },
  {
    id: 'eco-002', 
    ngo: 'Green Earth Foundation',
    projectName: 'Coastal Mangrove Shield',
    location: 'Kerala, India',
    trees: 1200,
    claimedTrees: 1180,
    ndvi: 0.75,
    iot: 0.85,
    score: '88%',
    credits: 12.1,
    status: 'Verified',
    submissionDate: '2024-09-10',
    verificationDate: '2024-09-18',
    blockchainTx: '0x3a5b7c9d1e2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b'
  },
  {
    id: 'eco-003',
    ngo: 'Ocean Guardian NGO',
    projectName: 'Coral Reef Mangrove Buffer',
    location: 'Philippines',
    trees: 800,
    claimedTrees: 785,
    ndvi: 0.72,
    iot: 0.88,
    score: '85%',
    credits: 8.9,
    status: 'Verified',
    submissionDate: '2024-09-05',
    verificationDate: '2024-09-14',
    blockchainTx: '0x9c1a3b5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b'
  },
  {
    id: 'eco-004',
    ngo: 'Climate Action Network',
    projectName: 'Urban Mangrove Initiative',
    location: 'Mumbai, India',
    trees: 600,
    claimedTrees: 580,
    ndvi: 0.68,
    iot: 0.82,
    score: '82%',
    credits: 6.7,
    status: 'Pending',
    submissionDate: '2024-09-20',
    verificationDate: undefined
  },
  {
    id: 'eco-005',
    ngo: 'Sustainable Seas',
    projectName: 'Mangrove Carbon Sink',
    location: 'Vietnam',
    trees: 1500,
    claimedTrees: 1450,
    ndvi: 0.82,
    iot: 0.91,
    score: '93%',
    credits: 15.8,
    status: 'Verified',
    submissionDate: '2024-08-28',
    verificationDate: '2024-09-08',
    blockchainTx: '0x2f4a6b8c0d2e4f6a8b0c2d4e6f8a0b2c4d6e8f0a'
  }
];

/**
 * Fetch reports with automatic fallback to mock data
 */
export async function fetchReports(): Promise<ApiResponse<ReportData[]>> {
  // If no backend URL configured, return mock data immediately
  if (!API_CONFIG.BACKEND_URL) {
    console.log('🎭 API: Using mock data (no backend URL configured)');
    return {
      success: true,
      data: MOCK_REPORTS,
      source: 'mock'
    };
  }

  // Try to fetch from live backend
  try {
    console.log('🌐 API: Attempting to fetch from live backend...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API: Successfully fetched live data');
    
    return {
      success: true,
      data: Array.isArray(data) ? data : data.reports || [],
      source: 'live'
    };

  } catch (error) {
    console.warn('⚠️ API: Live backend failed, falling back to mock data');
    console.warn('Error details:', error);
    
    return {
      success: true,
      data: MOCK_REPORTS,
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Submit new project data
 */
export async function submitProject(projectData: any): Promise<ApiResponse<any>> {
  // Always save to localStorage for demo
  const existingProjects = JSON.parse(localStorage.getItem('ecoledger_user_projects') || '[]');
  const newProject = {
    ...projectData,
    id: `eco-${Date.now()}`,
    submissionDate: new Date().toISOString(),
    status: 'Pending Verification'
  };
  
  existingProjects.push(newProject);
  localStorage.setItem('ecoledger_user_projects', JSON.stringify(existingProjects));

  // If no backend URL, return success with mock response
  if (!API_CONFIG.BACKEND_URL) {
    return {
      success: true,
      data: { projectId: newProject.id, status: 'submitted' },
      source: 'mock'
    };
  }

  // Try to submit to live backend
  try {
    const response = await fetch(`${API_CONFIG.BACKEND_URL}/api/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data,
      source: 'live'
    };

  } catch (error) {
    console.warn('⚠️ API: Failed to submit to backend, but saved locally');
    return {
      success: true,
      data: { projectId: newProject.id, status: 'submitted_offline' },
      source: 'mock',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Health check for backend availability
 */
export async function checkBackendHealth(): Promise<boolean> {
  if (!API_CONFIG.BACKEND_URL) {
    return false;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${API_CONFIG.BACKEND_URL}/`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;

  } catch (error) {
    return false;
  }
}

/**
 * Get API status for debugging
 */
export function getApiStatus(): {
  backendUrl: string;
  hasBackend: boolean;
  mockDataCount: number;
} {
  return {
    backendUrl: API_CONFIG.BACKEND_URL || 'Not configured',
    hasBackend: !!API_CONFIG.BACKEND_URL,
    mockDataCount: MOCK_REPORTS.length
  };
}