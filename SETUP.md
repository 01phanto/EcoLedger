# EcoLedger Setup Guide

Complete step-by-step guide to run the EcoLedger application locally.

## Prerequisites

- Python 3.8+ 
- Node.js 16+
- Git

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Create Python Virtual Environment
```bash
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

### 3. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 4. Generate Sample Data
```bash
python generate_sample_data.py
```

### 5. Start Backend Server
```bash
python main.py
```

The backend will be available at: `http://localhost:5000`

### 6. Test Backend APIs

**Health Check:**
```bash
curl http://localhost:5000/
```

**Tree Detection (with sample image):**
```bash
curl -X POST -F "image=@path/to/your/image.jpg" http://localhost:5000/treecount
```

**IoT Processing (with JSON):**
```bash
curl -X POST -H "Content-Type: application/json" -d '{
  "readings": [
    {"soil_moisture": 75, "temperature": 27, "salinity": 25, "ph": 7.5}
  ]
}' http://localhost:5000/iot
```

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## Using the Application

### 1. Home Page
- Visit `http://localhost:3000`
- Overview of EcoLedger features and workflow

### 2. Upload Project Data
- Click "Start Verification" or navigate to `/upload`
- Upload:
  - Tree detection image (drone/satellite photo)
  - NDVI satellite image  
  - IoT sensor CSV file
  - Enter claimed tree count
- Click "Start AI Verification"

### 3. View Results
- AI analysis results are displayed
- Final verification score and carbon credits calculated
- Blockchain record created

### 4. Dashboard
- Navigate to `/dashboard`
- View all your projects
- Monitor verification scores and carbon credits
- Track project performance over time

### 5. Marketplace
- Navigate to `/marketplace`
- Browse available carbon credits from other NGOs
- Filter by price, verification score, location
- Purchase verified carbon credits

## API Testing with Postman

### 1. Import Collection
- Open Postman
- Import `testing/EcoLedger-APIs.postman_collection.json`

### 2. Set Environment Variable
- Create new environment in Postman
- Add variable: `base_url` = `http://localhost:5000`

### 3. Test Complete Workflow
Run requests in order:
1. Health Check
2. IoT Processing
3. CO2 Calculation  
4. Final Score Calculation
5. Submit to Ledger
6. Query from Ledger

## Sample Data Files

Generated in `data/` directory:
- `sample_iot_sensors.csv` - 30 days of sensor readings
- `sample_iot_sensors.json` - Same data in JSON format
- `test_scenarios.json` - Various test scenarios

## File Upload Testing

For testing file uploads, you can use:
- Any JPG/PNG image for tree detection and NDVI
- `data/sample_iot_sensors.csv` for IoT sensor data

## Docker Setup (Optional)

### Backend Docker
```bash
cd backend
docker build -t ecoledger-backend .
docker run -p 5000:5000 ecoledger-backend
```

### Frontend Docker
```bash
cd frontend
docker build -t ecoledger-frontend .
docker run -p 3000:3000 ecoledger-frontend
```

## Troubleshooting

### Common Issues

**Backend won't start:**
- Check Python version: `python --version`
- Verify virtual environment is activated
- Install missing dependencies: `pip install -r requirements.txt`

**Frontend build errors:**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**API connection errors:**
- Ensure backend is running on port 5000
- Check CORS settings in main.py
- Verify firewall settings

**File upload issues:**
- Check file size limits (16MB max)
- Verify file formats (JPG, PNG, CSV)
- Ensure upload directory exists

### YOLO Model Issues
If YOLO model download fails:
```bash
pip install ultralytics --upgrade
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt')"
```

### MongoDB (Optional)
To use MongoDB instead of file storage:
```bash
# Install MongoDB locally or use MongoDB Atlas
# Update ledger_service.py: use_mongodb=True
```

## Environment Variables

Create `.env` file in backend directory:
```
FLASK_ENV=development
MONGODB_URI=mongodb://localhost:27017/
UPLOAD_FOLDER=uploads
```

## Production Deployment

### Backend (Flask)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 main:app
```

### Frontend (Next.js)
```bash
npm run build
npm start
```

## API Documentation

### Endpoints

**AI Models:**
- `POST /treecount` - Tree detection from images
- `POST /ndvi` - NDVI vegetation analysis
- `POST /iot` - IoT sensor data processing
- `POST /co2` - CO₂ absorption calculation
- `POST /finalscore` - Final verification score

**Blockchain:**
- `POST /ledger/submit` - Submit verification report
- `GET /ledger/query/{id}` - Query report by ID
- `POST /ledger/issue` - Issue carbon credits
- `POST /ledger/transfer` - Transfer credits
- `GET /ledger/marketplace` - Get available credits

### Response Formats

All APIs return JSON with:
```json
{
  "status": "success|error",
  "data": {...},
  "error": "error message if applicable"
}
```

## Support

For issues or questions:
1. Check this setup guide
2. Review API documentation
3. Test with provided sample data
4. Verify all dependencies are installed correctly

Happy verifying! 🌱