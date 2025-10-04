"""
EcoLedger Main Flask Application
Verifies mangrove plantation projects and issues carbon credits
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import json
from datetime import datetime
import logging

# Import AI model modules
from ai_models.yolo_detection import TreeDetectionAPI
from ai_models.ndvi_analysis import NDVIAnalysisAPI
from ai_models.iot_processing import IoTProcessingAPI
from ai_models.co2_estimator import CO2EstimatorAPI
from ai_models.final_score import FinalScoreAPI

# Import blockchain module
from blockchain.ledger_service import LedgerService

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize AI model APIs
tree_detector = TreeDetectionAPI()
ndvi_analyzer = NDVIAnalysisAPI()
iot_processor = IoTProcessingAPI()
co2_estimator = CO2EstimatorAPI()
final_scorer = FinalScoreAPI()

# Initialize blockchain service
ledger_service = LedgerService()

# Configure upload settings
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'csv', 'json'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "EcoLedger API",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/treecount', methods=['POST'])
def tree_count_endpoint():
    """
    YOLOv8 Tree Detection API
    Accepts image upload and returns tree count with bounding boxes
    """
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            # Process image with YOLOv8
            result = tree_detector.detect_trees(file)
            return jsonify(result)
        
        return jsonify({"error": "Invalid file format"}), 400
    
    except Exception as e:
        logger.error(f"Tree detection error: {str(e)}")
        return jsonify({"error": "Tree detection failed", "details": str(e)}), 500

@app.route('/ndvi', methods=['POST'])
def ndvi_endpoint():
    """
    NDVI Analysis API
    Accepts satellite/drone images and returns vegetation health score
    """
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image file provided"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400
        
        if file and allowed_file(file.filename):
            # Process image for NDVI analysis
            result = ndvi_analyzer.calculate_ndvi(file)
            return jsonify(result)
        
        return jsonify({"error": "Invalid file format"}), 400
    
    except Exception as e:
        logger.error(f"NDVI analysis error: {str(e)}")
        return jsonify({"error": "NDVI analysis failed", "details": str(e)}), 500

@app.route('/iot', methods=['POST'])
def iot_endpoint():
    """
    IoT Sensor Data Processing API
    Accepts JSON or CSV with soil moisture, temperature, salinity
    """
    try:
        # Handle JSON data
        if request.is_json:
            data = request.get_json()
            result = iot_processor.process_json_data(data)
            return jsonify(result)
        
        # Handle CSV file upload
        elif 'file' in request.files:
            file = request.files['file']
            if file and file.filename.endswith('.csv'):
                result = iot_processor.process_csv_data(file)
                return jsonify(result)
        
        return jsonify({"error": "Invalid data format. Provide JSON or CSV file"}), 400
    
    except Exception as e:
        logger.error(f"IoT processing error: {str(e)}")
        return jsonify({"error": "IoT processing failed", "details": str(e)}), 500

@app.route('/co2', methods=['POST'])
def co2_endpoint():
    """
    CO₂ Absorption Estimator API
    Accepts tree count and returns CO₂ absorption in kg
    """
    try:
        data = request.get_json()
        if not data or 'tree_count' not in data:
            return jsonify({"error": "tree_count parameter required"}), 400
        
        tree_count = data['tree_count']
        result = co2_estimator.calculate_co2_absorption(tree_count)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"CO2 estimation error: {str(e)}")
        return jsonify({"error": "CO2 estimation failed", "details": str(e)}), 500

@app.route('/finalscore', methods=['POST'])
def final_score_endpoint():
    """
    Final Score & Carbon Credits API
    Combines all metrics to calculate final score and carbon credits
    """
    try:
        data = request.get_json()
        required_fields = ['tree_count', 'claimed_trees', 'ndvi_score', 'iot_score']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                "error": f"Required fields: {required_fields}"
            }), 400
        
        result = final_scorer.calculate_final_score(data)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Final score calculation error: {str(e)}")
        return jsonify({"error": "Final score calculation failed", "details": str(e)}), 500

# Blockchain/Ledger endpoints
@app.route('/ledger/submit', methods=['POST'])
def ledger_submit():
    """Submit verified report to blockchain ledger"""
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        result = ledger_service.submit_report(data)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Ledger submit error: {str(e)}")
        return jsonify({"error": "Ledger submission failed", "details": str(e)}), 500

@app.route('/ledger/query/<report_id>', methods=['GET'])
def ledger_query(report_id):
    """Query report from blockchain ledger"""
    try:
        result = ledger_service.query_report(report_id)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Ledger query error: {str(e)}")
        return jsonify({"error": "Ledger query failed", "details": str(e)}), 500

@app.route('/ledger/issue', methods=['POST'])
def ledger_issue_credits():
    """Issue carbon credits to NGO"""
    try:
        data = request.get_json()
        required_fields = ['ngo_id', 'credits_amount', 'report_id']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                "error": f"Required fields: {required_fields}"
            }), 400
        
        result = ledger_service.issue_credits(data)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Credit issuance error: {str(e)}")
        return jsonify({"error": "Credit issuance failed", "details": str(e)}), 500

@app.route('/ledger/transfer', methods=['POST'])
def ledger_transfer_credits():
    """Transfer carbon credits from NGO to company"""
    try:
        data = request.get_json()
        required_fields = ['from_id', 'to_id', 'credits_amount', 'price']
        
        if not data or not all(field in data for field in required_fields):
            return jsonify({
                "error": f"Required fields: {required_fields}"
            }), 400
        
        result = ledger_service.transfer_credits(data)
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Credit transfer error: {str(e)}")
        return jsonify({"error": "Credit transfer failed", "details": str(e)}), 500

@app.route('/ledger/marketplace', methods=['GET'])
def ledger_marketplace():
    """Get available carbon credits in marketplace"""
    try:
        result = ledger_service.get_marketplace_credits()
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Marketplace query error: {str(e)}")
        return jsonify({"error": "Marketplace query failed", "details": str(e)}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)