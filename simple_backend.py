"""
Simple Backend Test - Start this first, then test uploads
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import time

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/treecount', methods=['POST'])
def simple_tree_count():
    print("🌳 Tree detection request received")
    
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    print(f"   File received: {file.filename}")
    
    # Simulate processing
    time.sleep(1)
    
    # Return mock results
    result = {
        "tree_count": 25,
        "confidence": 0.89,
        "status": "success",
        "message": "Tree detection completed successfully"
    }
    
    print(f"   ✅ Returning: {result}")
    return jsonify(result)

@app.route('/ndvi', methods=['POST'])
def simple_ndvi():
    print("🛰️ NDVI analysis request received")
    
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400
    
    file = request.files['image']
    print(f"   File received: {file.filename}")
    
    # Simulate processing
    time.sleep(1)
    
    result = {
        "health_score": 82.5,
        "avg_ndvi": 0.72,
        "status": "success",
        "message": "NDVI analysis completed successfully"
    }
    
    print(f"   ✅ Returning: {result}")
    return jsonify(result)

@app.route('/iot', methods=['POST'])
def simple_iot():
    print("📡 IoT processing request received")
    
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    file = request.files['file']
    print(f"   File received: {file.filename}")
    
    # Simulate processing
    time.sleep(1)
    
    result = {
        "iot_score": 87.3,
        "status": "excellent",
        "message": "IoT data processed successfully"
    }
    
    print(f"   ✅ Returning: {result}")
    return jsonify(result)

@app.route('/co2', methods=['POST'])
def simple_co2():
    data = request.get_json()
    tree_count = data.get('tree_count', 25)
    
    result = {
        "co2_absorbed": tree_count * 12.3,  # kg per year
        "status": "success"
    }
    
    return jsonify(result)

@app.route('/finalscore', methods=['POST'])
def simple_final_score():
    data = request.get_json()
    
    result = {
        "final_score": 85.2,
        "verification_status": "verified",
        "carbon_credits": 15.5,
        "status": "success"
    }
    
    return jsonify(result)

if __name__ == '__main__':
    print("🚀 Starting Simple EcoLedger Backend...")
    print("   Available at: http://localhost:5000")
    print("   Health check: http://localhost:5000/health")
    print("   Press Ctrl+C to stop")
    
    app.run(host='0.0.0.0', port=5000, debug=True)