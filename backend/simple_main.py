"""
EcoLedger Simple Flask Application
Simplified version without AI dependencies for demo
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import logging
from flask_socketio import SocketIO

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)

# Configure CORS for production deployment
CORS(app, origins=[
    "https://01phanto.github.io",  # GitHub Pages
    "http://localhost:3000",       # Local development
    "http://localhost:3001",       # Local development alt
    "http://localhost:3002",       # Local development alt
    "*"                           # Allow all origins for demo
])

# Initialize Socket.IO for real-time notifications
socketio = SocketIO(app, cors_allowed_origins="*")

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'csv', 'json'}

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/treecount', methods=['POST'])
def tree_count_endpoint():
    """Mock YOLOv8 Tree Detection API"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            # Mock response
            result = {
                "tree_count": 45,
                "confidence_score": 0.87,
                "detection_boxes": [
                    {"x": 100, "y": 50, "width": 80, "height": 90, "confidence": 0.92},
                    {"x": 250, "y": 120, "width": 75, "height": 85, "confidence": 0.89}
                ],
                "processing_time": 1.2,
                "model_version": "YOLOv8n-demo"
            }
            
            logger.info(f"Mock tree detection completed: {result['tree_count']} trees detected")
            return jsonify(result)
        else:
            return jsonify({"error": "Invalid file type"}), 400
    
    except Exception as e:
        logger.error(f"Tree detection error: {str(e)}")
        return jsonify({"error": "Tree detection failed", "details": str(e)}), 500

@app.route('/ndvi', methods=['POST'])
def ndvi_analysis_endpoint():
    """Mock NDVI Analysis API"""
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No satellite image provided"}), 400
        
        file = request.files['image']
        if file and allowed_file(file.filename):
            # Mock response
            result = {
                "ndvi_score": 0.73,
                "vegetation_health": "Good",
                "coverage_percentage": 68.5,
                "analysis_timestamp": datetime.now().isoformat(),
                "recommendations": [
                    "Vegetation shows healthy growth patterns",
                    "Chlorophyll content within optimal range"
                ]
            }
            
            logger.info(f"Mock NDVI analysis completed: score {result['ndvi_score']}")
            return jsonify(result)
        else:
            return jsonify({"error": "Invalid file type"}), 400
    
    except Exception as e:
        logger.error(f"NDVI analysis error: {str(e)}")
        return jsonify({"error": "NDVI analysis failed", "details": str(e)}), 500

@app.route('/iot', methods=['POST'])
def iot_processing_endpoint():
    """Mock IoT Processing API"""
    try:
        # Mock response
        result = {
            "sensor_readings": 156,
            "average_soil_moisture": 72.3,
            "average_temperature": 28.5,
            "co2_absorption_rate": 15.2,
            "data_quality": "High",
            "timestamp_range": {
                "start": "2024-01-01T00:00:00Z",
                "end": "2024-10-04T12:00:00Z"
            }
        }
        
        logger.info(f"Mock IoT processing completed: {result['sensor_readings']} readings")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"IoT processing error: {str(e)}")
        return jsonify({"error": "IoT processing failed", "details": str(e)}), 500

@app.route('/co2estimate', methods=['POST'])
def co2_estimation_endpoint():
    """Mock CO2 Estimation API"""
    try:
        data = request.get_json()
        tree_count = data.get('tree_count', 50)
        
        # Mock calculation
        co2_per_tree_per_year = 14.7  # kg
        total_co2_absorption = tree_count * co2_per_tree_per_year
        
        result = {
            "tree_count": tree_count,
            "co2_absorption_kg_per_year": total_co2_absorption,
            "co2_absorption_tons_per_year": total_co2_absorption / 1000,
            "carbon_credits_eligible": total_co2_absorption * 0.8,  # 80% efficiency
            "calculation_method": "Standard mangrove absorption rate",
            "confidence": 0.85
        }
        
        logger.info(f"Mock CO2 estimation: {result['co2_absorption_tons_per_year']:.2f} tons/year")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"CO2 estimation error: {str(e)}")
        return jsonify({"error": "CO2 estimation failed", "details": str(e)}), 500

@app.route('/finalscore', methods=['POST'])
def final_score_endpoint():
    """Mock Final Score API"""
    try:
        data = request.get_json()
        
        # Mock final scoring
        result = {
            "final_score": 87.3,
            "component_scores": {
                "yolo_detection": 89.2,
                "ndvi_health": 85.7,
                "iot_verification": 87.1
            },
            "verification_status": "VERIFIED",
            "confidence_level": "HIGH",
            "carbon_credits_issued": 42.5,
            "blockchain_hash": "0x" + "a" * 64,  # Mock hash
            "timestamp": datetime.now().isoformat()
        }
        
        logger.info(f"Mock final verification: {result['final_score']}% score")
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Final scoring error: {str(e)}")
        return jsonify({"error": "Final scoring failed", "details": str(e)}), 500

@app.route('/credits', methods=['POST'])
def issue_credits():
    """Issue carbon credits with blockchain integration"""
    try:
        data = request.get_json()
        
        # Mock credit issuance
        credit_record = {
            "id": f"CC_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
            "project_id": data.get('project_id', 'unknown'),
            "ngo_name": data.get('ngo_name', 'Unknown NGO'),
            "credits_issued": data.get('credits', 50.0),
            "verification_score": data.get('score', 85.0),
            "issue_date": datetime.now().isoformat(),
            "blockchain_status": "recorded",
            "transaction_hash": "0x" + "b" * 64
        }
        
        # Emit real-time notification
        socketio.emit('CREDIT_ISSUED', {
            'credits': credit_record['credits_issued'],
            'ngo': credit_record['ngo_name'],
            'timestamp': credit_record['issue_date']
        })
        
        logger.info(f"Mock credits issued: {credit_record['credits_issued']} credits")
        return jsonify({"success": True, "credit_record": credit_record})
    
    except Exception as e:
        logger.error(f"Credit issuance error: {str(e)}")
        return jsonify({"error": "Credit issuance failed", "details": str(e)}), 500

@app.route('/reports', methods=['GET'])
def get_reports():
    """Get verification reports"""
    try:
        # Mock reports data
        reports = [
            {
                "id": "RPT_001",
                "ngo_name": "Mangrove Trust Foundation",
                "project_name": "Sundarbans Restoration Phase 1",
                "location": "Bangladesh",
                "trees_planted": 1500,
                "verification_score": 87.3,
                "credits": 54.1,
                "status": "Verified",
                "submission_date": "2024-09-15T10:30:00Z"
            },
            {
                "id": "RPT_002",
                "ngo_name": "Ocean Guardians",
                "project_name": "Coastal Protection Initiative",
                "location": "Philippines",
                "trees_planted": 800,
                "verification_score": 82.7,
                "credits": 32.8,
                "status": "Pending",
                "submission_date": "2024-09-20T14:15:00Z"
            }
        ]
        
        return jsonify({"reports": reports, "source": "mock"})
    
    except Exception as e:
        logger.error(f"Reports endpoint error: {str(e)}")
        return jsonify({"error": "Failed to fetch reports", "details": str(e)}), 500

# Health Check Endpoint
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        "status": "healthy",
        "service": "EcoLedger API (Demo Mode)",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
        "mode": "demo"
    })

@app.route('/', methods=['GET'])
def root():
    """Root endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "EcoLedger API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    print("🌱 Starting EcoLedger Backend (Demo Mode)")
    print("🔗 Frontend should connect to: http://localhost:5000")
    print("📡 WebSocket support enabled for real-time notifications")
    
    # Development server with Socket.IO
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)