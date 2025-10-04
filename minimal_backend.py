"""
Minimal Backend Server for Testing EcoLedger Upload
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Minimal EcoLedger backend is running!",
        "service": "EcoLedger-Minimal"
    })

@app.route('/treecount', methods=['POST'])
def tree_count():
    """Simplified tree detection endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        # Simulate tree detection
        logger.info(f"Processing image: {file.filename}")
        
        # Return mock results
        return jsonify({
            "Tree_Count": 147,
            "status": "success",
            "method": "mock_detection",
            "confidence": 0.89,
            "Boxes": [
                {"label": "mangrove", "confidence": 0.91, "x1": 100, "y1": 150, "x2": 200, "y2": 250},
                {"label": "mangrove", "confidence": 0.87, "x1": 300, "y1": 100, "x2": 400, "y2": 200}
            ]
        })
        
    except Exception as e:
        logger.error(f"Tree detection error: {e}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500

@app.route('/ndvi', methods=['POST'])
def ndvi():
    """Simplified NDVI analysis endpoint"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        logger.info(f"Processing NDVI image: {file.filename}")
        
        # Return mock NDVI results
        return jsonify({
            "health_score": 78.5,
            "avg_ndvi": 0.67,
            "status": "success",
            "method": "mock_ndvi"
        })
        
    except Exception as e:
        logger.error(f"NDVI analysis error: {e}")
        return jsonify({"error": f"NDVI processing failed: {str(e)}"}), 500

@app.route('/iot', methods=['POST'])
def iot():
    """Simplified IoT processing endpoint"""
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No CSV file provided"}), 400
        
        file = request.files['file']
        logger.info(f"Processing IoT data: {file.filename}")
        
        # Return mock IoT results
        return jsonify({
            "iot_score": 85.2,
            "status": "optimal",
            "avg_soil_moisture": 65.3,
            "avg_temperature": 28.7,
            "method": "mock_iot"
        })
        
    except Exception as e:
        logger.error(f"IoT processing error: {e}")
        return jsonify({"error": f"IoT processing failed: {str(e)}"}), 500

@app.route('/co2', methods=['POST'])
def co2():
    """CO2 calculation endpoint"""
    try:
        data = request.get_json()
        tree_count = data.get('tree_count', 0)
        
        # Calculate CO2 absorption (12.3 kg per tree per year)
        co2_absorbed = tree_count * 12.3
        
        return jsonify({
            "co2_absorbed": co2_absorbed,
            "tree_count": tree_count,
            "absorption_rate": 12.3,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"CO2 calculation error: {e}")
        return jsonify({"error": f"CO2 calculation failed: {str(e)}"}), 500

@app.route('/finalscore', methods=['POST'])
def final_score():
    """Final score calculation endpoint"""
    try:
        data = request.get_json()
        
        tree_count = data.get('tree_count', 0)
        claimed_trees = data.get('claimed_trees', 0)
        ndvi_score = data.get('ndvi_score', 0)
        iot_score = data.get('iot_score', 0)
        
        # Calculate final score
        accuracy = min(100, (tree_count / max(claimed_trees, 1)) * 100)
        final = (accuracy * 0.4 + ndvi_score * 0.3 + iot_score * 0.3)
        
        return jsonify({
            "final_score": round(final, 1),
            "accuracy_score": round(accuracy, 1),
            "tree_count": tree_count,
            "claimed_trees": claimed_trees,
            "status": "success"
        })
        
    except Exception as e:
        logger.error(f"Final score calculation error: {e}")
        return jsonify({"error": f"Score calculation failed: {str(e)}"}), 500

@app.route('/ledger/submit', methods=['POST'])
def ledger_submit():
    """Blockchain ledger submission endpoint"""
    try:
        data = request.get_json()
        
        # Mock blockchain submission
        logger.info("Submitting to blockchain...")
        
        return jsonify({
            "transaction_id": "0x1234567890abcdef",
            "block_number": 12345,
            "status": "confirmed",
            "timestamp": "2025-10-04T09:00:00Z",
            "carbon_credits": data.get('verification_results', {}).get('final_score', 0) / 10
        })
        
    except Exception as e:
        logger.error(f"Blockchain submission error: {e}")
        return jsonify({"error": f"Blockchain submission failed: {str(e)}"}), 500

if __name__ == '__main__':
    print("🚀 Starting Minimal EcoLedger Backend...")
    print("   Available at: http://localhost:5000")
    print("   Health check: http://localhost:5000/health")
    print("   Press Ctrl+C to stop")
    
    app.run(host='0.0.0.0', port=5000, debug=True)