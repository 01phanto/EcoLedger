// EcoLedger Dynamic Data Loader
// Copy and paste this entire script into your browser console at http://localhost:3002

console.log('🔄 Loading Dynamic EcoLedger Data...');

// Dynamic Projects Data
const dynamicProjects = [
  {
    "id": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "projectName": "Automated Mangrove Restoration",
    "location": "Test Bay, Dynamic Island",
    "claimedTrees": 150,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "pending_review",
    "aiResults": {
      "tree_count": 142,
      "ndvi_score": 0.834,
      "IoT_Score": 0.891,
      "final_score": 87.3
    }
  },
  {
    "id": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "projectName": "Coastal Protection Initiative",
    "location": "Dynamic Coast, Test Region",
    "claimedTrees": 200,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "pending_review",
    "aiResults": {
      "tree_count": 195,
      "ndvi_score": 0.756,
      "IoT_Score": 0.823,
      "final_score": 82.1
    }
  },
  {
    "id": "DYNAMIC_TEST_003_1759556343",
    "ngoName": "Wetland Restoration Collective",
    "projectName": "Biodiversity Enhancement Project",
    "location": "Mangrove Delta, Test Country",
    "claimedTrees": 300,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "pending_review",
    "aiResults": {
      "tree_count": 287,
      "ndvi_score": 0.912,
      "IoT_Score": 0.945,
      "final_score": 91.8
    }
  }
];

// Approved Projects Data
const approvedProjects = [
  {
    "id": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "projectName": "Automated Mangrove Restoration",
    "location": "Test Bay, Dynamic Island",
    "claimedTrees": 150,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "approved",
    "aiResults": {
      "tree_count": 142,
      "ndvi_score": 0.834,
      "IoT_Score": 0.891,
      "final_score": 87.3
    },
    "approvalDate": "2025-10-04T11:09:01.686744",
    "carbonCredits": 1.52,
    "pricePerCredit": 15.05
  },
  {
    "id": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "projectName": "Coastal Protection Initiative",
    "location": "Dynamic Coast, Test Region",
    "claimedTrees": 200,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "approved",
    "aiResults": {
      "tree_count": 195,
      "ndvi_score": 0.756,
      "IoT_Score": 0.823,
      "final_score": 82.1
    },
    "approvalDate": "2025-10-04T11:09:01.694780",
    "carbonCredits": 1.97,
    "pricePerCredit": 13.9
  },
  {
    "id": "DYNAMIC_TEST_003_1759556343",
    "ngoName": "Wetland Restoration Collective",
    "projectName": "Biodiversity Enhancement Project",
    "location": "Mangrove Delta, Test Country",
    "claimedTrees": 300,
    "submissionDate": "2025-10-04T11:09:01.686744",
    "status": "approved",
    "aiResults": {
      "tree_count": 287,
      "ndvi_score": 0.912,
      "IoT_Score": 0.945,
      "final_score": 91.8
    },
    "approvalDate": "2025-10-04T11:09:01.694780",
    "carbonCredits": 3.24,
    "pricePerCredit": 16.07
  }
];

// Marketplace Data
const marketplaceData = [
  {
    "id": "MARKET_1759556341_759556341",
    "projectId": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "projectName": "Automated Mangrove Restoration",
    "location": "Test Bay, Dynamic Island",
    "creditsAvailable": 0.62,
    "totalCredits": 1.52,
    "pricePerCredit": 15.05,
    "listedDate": "2025-10-04T11:09:01.686744"
  },
  {
    "id": "MARKET_1759556341_759556342",
    "projectId": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "projectName": "Coastal Protection Initiative",
    "location": "Dynamic Coast, Test Region",
    "creditsAvailable": 0.77,
    "totalCredits": 1.97,
    "pricePerCredit": 13.9,
    "listedDate": "2025-10-04T11:09:01.694780"
  },
  {
    "id": "MARKET_1759556341_759556343",
    "projectId": "DYNAMIC_TEST_003_1759556343",
    "ngoName": "Wetland Restoration Collective",
    "projectName": "Biodiversity Enhancement Project",
    "location": "Mangrove Delta, Test Country",
    "creditsAvailable": 3.24,
    "totalCredits": 3.24,
    "pricePerCredit": 16.07,
    "listedDate": "2025-10-04T11:09:01.694780"
  }
];

// Purchase History
const purchaseHistory = [
  {
    "id": "PURCHASE_1759556341_556341",
    "listingId": "MARKET_1759556341_759556341",
    "projectId": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "projectName": "Automated Mangrove Restoration",
    "quantity": 0.9,
    "pricePerCredit": 15.05,
    "totalCost": 13.55,
    "purchaseDate": "2025-10-04T11:09:01.694780",
    "buyer": "Green Corporation Ltd",
    "transactionId": "0x68e0b2f5PURCHASE"
  },
  {
    "id": "PURCHASE_1759556341_556342",
    "listingId": "MARKET_1759556341_759556342",
    "projectId": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "projectName": "Coastal Protection Initiative",
    "quantity": 1.2,
    "pricePerCredit": 13.9,
    "totalCost": 16.68,
    "purchaseDate": "2025-10-04T11:09:01.694780",
    "buyer": "Green Corporation Ltd",
    "transactionId": "0x68e0b2f5PURCHASE"
  }
];

// Blockchain Ledger
const blockchainLedger = [
  {
    "type": "project_approval",
    "projectId": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "carbonCredits": 1.52,
    "description": "Project approved: Automated Mangrove Restoration",
    "timestamp": "2025-10-04T11:09:01.686744",
    "transactionId": "0x68e0b2f5556341",
    "blockNumber": 1
  },
  {
    "type": "project_approval",
    "projectId": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "carbonCredits": 1.97,
    "description": "Project approved: Coastal Protection Initiative",
    "timestamp": "2025-10-04T11:09:01.694780",
    "transactionId": "0x68e0b2f5556342",
    "blockNumber": 2
  },
  {
    "type": "project_approval",
    "projectId": "DYNAMIC_TEST_003_1759556343",
    "ngoName": "Wetland Restoration Collective",
    "carbonCredits": 3.24,
    "description": "Project approved: Biodiversity Enhancement Project",
    "timestamp": "2025-10-04T11:09:01.694780",
    "transactionId": "0x68e0b2f5556343",
    "blockNumber": 3
  },
  {
    "type": "credit_purchase",
    "purchaseId": "PURCHASE_1759556341_556341",
    "projectId": "DYNAMIC_TEST_001_1759556341",
    "ngoName": "Dynamic Test NGO",
    "buyer": "Green Corporation Ltd",
    "quantity": 0.9,
    "amount": 13.55,
    "description": "Purchased 0.9 credits from Automated Mangrove Restoration",
    "timestamp": "2025-10-04T11:09:01.694780",
    "transactionId": "0x68e0b2f5PURCHASE",
    "blockNumber": 4
  },
  {
    "type": "credit_purchase",
    "purchaseId": "PURCHASE_1759556341_556342",
    "projectId": "DYNAMIC_TEST_002_1759556342",
    "ngoName": "Green Earth Dynamics",
    "buyer": "Green Corporation Ltd",
    "quantity": 1.2,
    "amount": 16.68,
    "description": "Purchased 1.2 credits from Coastal Protection Initiative",
    "timestamp": "2025-10-04T11:09:01.694780",
    "transactionId": "0x68e0b2f5PURCHASE",
    "blockNumber": 5
  }
];

// Load all data into localStorage
try {
  localStorage.setItem('userProjects', JSON.stringify(dynamicProjects));
  localStorage.setItem('adminReviewQueue', JSON.stringify(dynamicProjects));
  localStorage.setItem('approvedProjects', JSON.stringify(approvedProjects));
  localStorage.setItem('marketplace', JSON.stringify(marketplaceData));
  localStorage.setItem('userPurchases', JSON.stringify(purchaseHistory));
  localStorage.setItem('blockchainLedger', JSON.stringify(blockchainLedger));
  
  console.log('✅ Dynamic EcoLedger data loaded successfully!');
  console.log('📊 Data Summary:');
  console.log(`   • ${dynamicProjects.length} projects in system`);
  console.log(`   • ${approvedProjects.length} projects approved`);
  console.log(`   • ${marketplaceData.length} marketplace listings`);
  console.log(`   • ${purchaseHistory.length} completed purchases`);
  console.log(`   • ${blockchainLedger.length} blockchain transactions`);
  console.log('');
  console.log('🌐 Navigate through the app to see dynamic data:');
  console.log('   • Dashboard: View project statistics');
  console.log('   • Upload: Submit new projects');
  console.log('   • Admin: Review pending projects');
  console.log('   • Marketplace: Buy carbon credits');
  console.log('');
  console.log('🔄 Refresh the page to see the dynamic data!');
  
  // Auto refresh after 2 seconds
  setTimeout(() => {
    window.location.reload();
  }, 2000);
  
} catch (error) {
  console.error('❌ Error loading dynamic data:', error);
}