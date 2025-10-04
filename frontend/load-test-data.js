// Simple Dynamic Data Loader for EcoLedger
// Run this in your browser console at http://localhost:3000

console.log('🌱 Loading EcoLedger test data...');

// Clear existing data
localStorage.clear();

// Sample projects data
const sampleProjects = [
  {
    id: 'PROJECT_TEST_001',
    ngoName: 'Green Coast Foundation',
    projectName: 'Mangrove Restoration Initiative',
    location: 'Sundarbans, Bangladesh',
    claimedTrees: 150,
    submissionDate: '2025-10-01T10:00:00Z',
    status: 'pending_review',
    aiResults: {
      tree_count: 142,
      ndvi_score: 0.854,
      IoT_Score: 0.891,
      final_score: 89.2
    }
  },
  {
    id: 'PROJECT_TEST_002',
    ngoName: 'Ocean Blue Conservation',
    projectName: 'Coastal Protection Project',
    location: 'Kerala, India',
    claimedTrees: 200,
    submissionDate: '2025-10-02T14:30:00Z',
    status: 'approved',
    aiResults: {
      tree_count: 185,
      ndvi_score: 0.783,
      IoT_Score: 0.825,
      final_score: 84.1
    },
    approvalDate: '2025-10-03T09:15:00Z',
    carbonCredits: 2.28,
    pricePerCredit: 14.50
  }
];

// Store test data
localStorage.setItem('userProjects', JSON.stringify(sampleProjects));
localStorage.setItem('adminReviewQueue', JSON.stringify([sampleProjects[0]]));
localStorage.setItem('approvedProjects', JSON.stringify([sampleProjects[1]]));

// Create marketplace listing for approved project
const marketplaceListing = {
  id: 'MARKET_001',
  projectId: 'PROJECT_TEST_002',
  ngoName: 'Ocean Blue Conservation',
  projectName: 'Coastal Protection Project',
  location: 'Kerala, India',
  creditsAvailable: 2.28,
  totalCredits: 2.28,
  pricePerCredit: 14.50,
  listedDate: '2025-10-03T10:00:00Z'
};

localStorage.setItem('marketplace', JSON.stringify([marketplaceListing]));

// Create blockchain entries
const blockchainEntries = [
  {
    type: 'project_approval',
    projectId: 'PROJECT_TEST_002',
    ngoName: 'Ocean Blue Conservation',
    carbonCredits: 2.28,
    description: 'Project approved: Coastal Protection Project',
    timestamp: '2025-10-03T09:15:00Z',
    transactionId: '0xabc123def456',
    blockNumber: 1
  }
];

localStorage.setItem('blockchainLedger', JSON.stringify(blockchainEntries));

console.log('✅ Test data loaded successfully!');
console.log('📊 Data loaded:');
console.log('  • 2 projects created');
console.log('  • 1 project in admin review');
console.log('  • 1 project approved');
console.log('  • 1 marketplace listing');
console.log('  • 1 blockchain transaction');
console.log('');
console.log('🔄 Refreshing page to load data...');

// Refresh page to see the loaded data
setTimeout(() => {
  window.location.reload();
}, 1000);