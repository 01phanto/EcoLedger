// Test script to verify data flow between upload and dashboard
// Run this in browser console to test the system

console.log('🧪 EcoLedger Data Flow Test');

// Test 1: Check if storage keys exist
const storageKeys = [
  'ecoledger_user_projects',
  'ecoledger_admin_queue', 
  'ecoledger_approved_projects',
  'ecoledger_marketplace',
  'ecoledger_blockchain'
];

console.log('📊 Testing Storage Keys:');
storageKeys.forEach(key => {
  const data = localStorage.getItem(key);
  console.log(`${key}: ${data ? `${JSON.parse(data).length} items` : 'not found'}`);
});

// Test 2: Add a sample project
console.log('📝 Adding test project...');
const testProject = {
  id: `TEST_${Date.now()}`,
  ngoName: 'Test NGO',
  projectName: 'Test Mangrove Project',
  location: 'Test Location',
  claimedTrees: 100,
  description: 'Test project for verification',
  status: 'Pending Verification',
  submissionDate: new Date().toISOString(),
  aiResults: {
    yoloScore: '87.3',
    ndviScore: '82.7', 
    iotScore: '91.4',
    finalScore: '86.8',
    confidence: 'High'
  }
};

// Add to storage
const existingProjects = JSON.parse(localStorage.getItem('ecoledger_user_projects') || '[]');
existingProjects.push(testProject);
localStorage.setItem('ecoledger_user_projects', JSON.stringify(existingProjects));

console.log('✅ Test project added successfully');
console.log('📊 Total projects in storage:', existingProjects.length);

// Test 3: Verify dashboard can read the data
console.log('🔍 Testing dashboard data reading...');
const dashboardProjects = JSON.parse(localStorage.getItem('ecoledger_user_projects') || '[]');
console.log('📈 Dashboard should show:', dashboardProjects.length, 'projects');

// Test 4: Check navigation routes
console.log('🧭 Testing navigation routes...');
const currentHost = window.location.hostname;
const basePath = currentHost.includes('github.io') ? '/EcoLedger' : '';
console.log(`🌐 Current environment: ${currentHost}`);
console.log(`📍 Base path: ${basePath || 'local development'}`);
console.log(`🔗 Dashboard URL should be: ${window.location.origin}${basePath}/dashboard`);

console.log('✅ Data flow test completed!');
console.log('💡 To test: Upload a project, then check if it appears in dashboard');