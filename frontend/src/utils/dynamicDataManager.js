/**
 * Dynamic Data Manager for EcoLedger
 * Handles real data flow throughout the application
 */

class DynamicDataManager {
  constructor() {
    this.storageKeys = {
      userProjects: 'ecoledger_user_projects',
      adminQueue: 'ecoledger_admin_queue',
      approvedProjects: 'ecoledger_approved_projects',
      marketplace: 'ecoledger_marketplace',
      purchases: 'ecoledger_purchases',
      blockchain: 'ecoledger_blockchain',
      credits: 'ecoledger_credits'
    };
    this.initializeStorage();
  }

  initializeStorage() {
    // Initialize empty arrays if no data exists
    Object.values(this.storageKeys).forEach(key => {
      if (!localStorage.getItem(key)) {
        localStorage.setItem(key, JSON.stringify([]));
      }
    });
  }

  // PROJECT MANAGEMENT
  addUserProject(projectData) {
    const projects = this.getUserProjects();
    const newProject = {
      ...projectData,
      id: `PROJ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submissionDate: new Date().toISOString(),
      status: 'pending_review',
      lastUpdated: new Date().toISOString()
    };
    
    projects.push(newProject);
    localStorage.setItem(this.storageKeys.userProjects, JSON.stringify(projects));
    
    // Also add to admin queue
    this.addToAdminQueue(newProject);
    
    console.log(`📊 Added new project: ${newProject.projectName} (ID: ${newProject.id})`);
    return newProject;
  }

  getUserProjects() {
    return JSON.parse(localStorage.getItem(this.storageKeys.userProjects) || '[]');
  }

  updateProjectStatus(projectId, status, additionalData = {}) {
    const projects = this.getUserProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        status,
        lastUpdated: new Date().toISOString(),
        ...additionalData
      };
      
      localStorage.setItem(this.storageKeys.userProjects, JSON.stringify(projects));
      
      // If approved, move to approved projects and marketplace
      if (status === 'approved') {
        this.approveProject(projects[projectIndex]);
      }
      
      console.log(`🔄 Updated project ${projectId} status to: ${status}`);
      return projects[projectIndex];
    }
    return null;
  }

  // ADMIN QUEUE MANAGEMENT
  addToAdminQueue(project) {
    const queue = this.getAdminQueue();
    if (!queue.find(p => p.id === project.id)) {
      queue.push({
        ...project,
        queuedDate: new Date().toISOString()
      });
      localStorage.setItem(this.storageKeys.adminQueue, JSON.stringify(queue));
    }
  }

  getAdminQueue() {
    return JSON.parse(localStorage.getItem(this.storageKeys.adminQueue) || '[]');
  }

  removeFromAdminQueue(projectId) {
    const queue = this.getAdminQueue();
    const filteredQueue = queue.filter(p => p.id !== projectId);
    localStorage.setItem(this.storageKeys.adminQueue, JSON.stringify(filteredQueue));
  }

  // PROJECT APPROVAL WORKFLOW
  approveProject(project) {
    // Calculate carbon credits based on AI results
    const carbonCredits = this.calculateCarbonCredits(project);
    
    const approvedProject = {
      ...project,
      status: 'approved',
      approvalDate: new Date().toISOString(),
      carbonCredits: carbonCredits,
      creditsAvailable: carbonCredits,
      pricePerCredit: this.calculateCreditPrice(project)
    };

    // Add to approved projects
    const approved = this.getApprovedProjects();
    approved.push(approvedProject);
    localStorage.setItem(this.storageKeys.approvedProjects, JSON.stringify(approved));

    // Add to marketplace
    this.addToMarketplace(approvedProject);

    // Record on blockchain
    this.recordBlockchainTransaction({
      type: 'project_approval',
      projectId: project.id,
      ngoName: project.ngoName,
      location: project.location,
      carbonCredits: carbonCredits,
      description: `Project approved: ${project.projectName}`,
      timestamp: new Date().toISOString()
    });

    // Remove from admin queue
    this.removeFromAdminQueue(project.id);

    console.log(`✅ Approved project: ${project.projectName} (${carbonCredits} credits)`);
    return approvedProject;
  }

  getApprovedProjects() {
    return JSON.parse(localStorage.getItem(this.storageKeys.approvedProjects) || '[]');
  }

  calculateCarbonCredits(project) {
    const aiResults = project.aiResults || {};
    const treeCount = aiResults.tree_count || 0;
    const finalScore = (aiResults.final_score || 70) / 100;
    
    // Each tree absorbs approximately 12.3 kg CO2 per year
    // Convert to tons and apply quality multiplier
    const co2Absorbed = (treeCount * 12.3 * finalScore) / 1000;
    return Math.round(co2Absorbed * 100) / 100; // Round to 2 decimal places
  }

  calculateCreditPrice(project) {
    const basePrice = 15; // Base price per credit in USD
    const qualityMultiplier = (project.aiResults?.final_score || 70) / 100;
    return Math.round((basePrice * (0.8 + qualityMultiplier * 0.4)) * 100) / 100;
  }

  // MARKETPLACE MANAGEMENT
  addToMarketplace(project) {
    const marketplace = this.getMarketplace();
    const listing = {
      id: `MARKET_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId: project.id,
      ngoName: project.ngoName,
      projectName: project.projectName,
      location: project.location,
      creditsAvailable: project.carbonCredits,
      totalCredits: project.carbonCredits,
      pricePerCredit: project.pricePerCredit,
      listedDate: new Date().toISOString(),
      projectData: project
    };

    marketplace.push(listing);
    localStorage.setItem(this.storageKeys.marketplace, JSON.stringify(marketplace));
    
    console.log(`🏪 Added to marketplace: ${listing.projectName}`);
    return listing;
  }

  getMarketplace() {
    return JSON.parse(localStorage.getItem(this.storageKeys.marketplace) || '[]');
  }

  purchaseCredits(listingId, quantity, buyerInfo) {
    const marketplace = this.getMarketplace();
    const listing = marketplace.find(l => l.id === listingId);
    
    if (!listing || listing.creditsAvailable < quantity) {
      throw new Error('Insufficient credits available');
    }

    const totalCost = quantity * listing.pricePerCredit;
    
    // Create purchase record
    const purchase = {
      id: `PURCHASE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      listingId: listingId,
      projectId: listing.projectId,
      ngoName: listing.ngoName,
      projectName: listing.projectName,
      location: listing.location,
      quantity: quantity,
      pricePerCredit: listing.pricePerCredit,
      totalCost: totalCost,
      purchaseDate: new Date().toISOString(),
      buyer: buyerInfo,
      transactionId: `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`
    };

    // Update marketplace listing
    listing.creditsAvailable -= quantity;
    localStorage.setItem(this.storageKeys.marketplace, JSON.stringify(marketplace));

    // Add to purchases
    const purchases = this.getPurchases();
    purchases.push(purchase);
    localStorage.setItem(this.storageKeys.purchases, JSON.stringify(purchases));

    // Record blockchain transaction
    this.recordBlockchainTransaction({
      type: 'credit_purchase',
      purchaseId: purchase.id,
      projectId: listing.projectId,
      ngoName: listing.ngoName,
      buyer: buyerInfo.name || 'Anonymous Buyer',
      quantity: quantity,
      amount: totalCost,
      description: `Purchased ${quantity} credits from ${listing.projectName}`,
      timestamp: new Date().toISOString()
    });

    console.log(`💰 Purchase completed: ${quantity} credits for $${totalCost}`);
    return purchase;
  }

  getPurchases() {
    return JSON.parse(localStorage.getItem(this.storageKeys.purchases) || '[]');
  }

  // BLOCKCHAIN LEDGER
  recordBlockchainTransaction(transactionData) {
    const blockchain = this.getBlockchain();
    const transaction = {
      ...transactionData,
      id: `TX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      blockNumber: blockchain.length + 1,
      hash: this.generateTransactionHash(transactionData),
      timestamp: transactionData.timestamp || new Date().toISOString()
    };

    blockchain.push(transaction);
    localStorage.setItem(this.storageKeys.blockchain, JSON.stringify(blockchain));
    
    console.log(`🔗 Blockchain transaction recorded: ${transaction.type}`);
    return transaction;
  }

  getBlockchain() {
    return JSON.parse(localStorage.getItem(this.storageKeys.blockchain) || '[]');
  }

  generateTransactionHash(data) {
    const str = JSON.stringify(data) + Date.now();
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return '0x' + Math.abs(hash).toString(16).padStart(16, '0');
  }

  // ANALYTICS AND STATS
  getDashboardStats() {
    const userProjects = this.getUserProjects();
    const approved = this.getApprovedProjects();
    const purchases = this.getPurchases();
    const blockchain = this.getBlockchain();

    const totalTrees = approved.reduce((sum, p) => sum + (p.aiResults?.tree_count || 0), 0);
    const totalCredits = approved.reduce((sum, p) => sum + (p.carbonCredits || 0), 0);
    const totalRevenue = purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);

    return {
      totalProjects: userProjects.length,
      approvedProjects: approved.length,
      pendingProjects: userProjects.filter(p => p.status === 'pending_review').length,
      totalTrees: totalTrees,
      totalCredits: totalCredits,
      availableCredits: this.getMarketplace().reduce((sum, l) => sum + l.creditsAvailable, 0),
      totalRevenue: totalRevenue,
      totalTransactions: blockchain.length,
      avgProjectScore: approved.length > 0 ? 
        approved.reduce((sum, p) => sum + (p.aiResults?.final_score || 0), 0) / approved.length : 0
    };
  }

  // UTILITY METHODS
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      localStorage.removeItem(key);
    });
    this.initializeStorage();
    console.log('🗑️ All dynamic data cleared');
  }

  exportData() {
    const data = {};
    Object.entries(this.storageKeys).forEach(([name, key]) => {
      data[name] = JSON.parse(localStorage.getItem(key) || '[]');
    });
    return data;
  }

  importData(data) {
    Object.entries(data).forEach(([name, values]) => {
      if (this.storageKeys[name]) {
        localStorage.setItem(this.storageKeys[name], JSON.stringify(values));
      }
    });
    console.log('📥 Dynamic data imported');
  }
}

// Create global instance
window.dynamicDataManager = new DynamicDataManager();

export default DynamicDataManager;