// Mock API responses for GitHub Pages deployment
// This simulates the backend API when running on GitHub Pages

class MockAPI {
  constructor() {
    this.baseURL = '';
  }

  // Simulate health check
  async health() {
    return {
      status: 'ok',
      message: 'Mock API running on GitHub Pages',
      timestamp: new Date().toISOString()
    };
  }

  // Simulate tree counting
  async treecount(imageData) {
    // Simulate processing delay
    await this.delay(2000);
    
    return {
      trees_detected: Math.floor(Math.random() * 50) + 20,
      confidence: (Math.random() * 0.3 + 0.7).toFixed(2),
      processing_time: '2.34s',
      model: 'YOLOv8 (simulated)'
    };
  }

  // Simulate NDVI analysis
  async ndvi(imageData) {
    await this.delay(1500);
    
    return {
      ndvi_score: (Math.random() * 0.3 + 0.7).toFixed(2),
      vegetation_health: 'Good',
      processing_time: '1.56s',
      analysis: 'Simulated NDVI analysis'
    };
  }

  // Simulate IoT processing
  async iot(csvData) {
    await this.delay(1000);
    
    return {
      iot_score: (Math.random() * 0.2 + 0.8).toFixed(2),
      sensors_processed: 6,
      avg_conditions: 'Optimal',
      processing_time: '0.89s'
    };
  }

  // Simulate CO2 calculation
  async co2(treeCount) {
    await this.delay(500);
    
    const co2PerTree = 12.3;
    const totalCO2 = treeCount * co2PerTree;
    
    return {
      co2_absorbed: totalCO2.toFixed(2),
      trees_counted: treeCount,
      absorption_rate: co2PerTree,
      units: 'kg CO2/year'
    };
  }

  // Simulate final scoring
  async finalscore(data) {
    await this.delay(1000);
    
    const aiScore = Math.random() * 0.3 + 0.7;
    const ndviScore = Math.random() * 0.3 + 0.7;
    const iotScore = Math.random() * 0.2 + 0.8;
    const auditScore = 0.9;
    
    const finalScore = (0.4 * aiScore + 0.3 * ndviScore + 0.2 * iotScore + 0.1 * auditScore);
    
    return {
      final_score: finalScore.toFixed(2),
      ai_score: aiScore.toFixed(2),
      ndvi_score: ndviScore.toFixed(2),
      iot_score: iotScore.toFixed(2),
      audit_score: auditScore.toFixed(2),
      carbon_credits: (data.co2_absorbed / 1000 * finalScore).toFixed(2),
      status: finalScore > 0.8 ? 'Verified' : 'Needs Review'
    };
  }

  // Simulate blockchain submission
  async ledgerSubmit(data) {
    await this.delay(2000);
    
    return {
      transaction_id: 'tx_' + Date.now(),
      block_hash: 'block_' + Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
      timestamp: new Date().toISOString(),
      message: 'Project recorded on simulated blockchain'
    };
  }

  // Helper function for delays
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export for use in the frontend
if (typeof window !== 'undefined') {
  window.MockAPI = MockAPI;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MockAPI;
}