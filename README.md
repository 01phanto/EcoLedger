# 🌱 EcoLedger - Mangrove Carbon Credit Verification System

A comprehensive web application for verifying mangrove plantation projects and issuing carbon credits using AI-powered analysis and blockchain technology.

![EcoLedger Dashboard](https://img.shields.io/badge/Status-Active-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3+-green)

## 🚀 Features

### 🤖 AI-Powered Verification
- **YOLOv8 Object Detection**: Automated mangrove tree counting from ground-level images
- **NDVI Analysis**: Satellite imagery processing for vegetation health assessment
- **IoT Data Processing**: Real-time environmental sensor data analysis
- **CO2 Estimation**: Accurate carbon sequestration calculations

### 🔗 Blockchain Integration
- **Hyperledger Fabric Simulation**: Immutable ledger for carbon credit tracking
- **Smart Contracts**: Automated credit issuance based on verification results
- **Transparency**: Complete audit trail for all transactions

### 📊 Dashboard & Analytics
- **Project Management**: Comprehensive project tracking and status monitoring
- **Real-time Analytics**: Live charts and metrics
- **Admin Panel**: System administration and user management
- **Responsive UI**: Modern, mobile-friendly interface
- **API Testing**: Complete Postman collection for end-to-end workflow testing

## 🏗️ Architecture

```
EcoLedger/
├── frontend/           # Next.js React application
├── backend/           # Python Flask API server
├── testing/          # Comprehensive test suites
├── data/            # Sample datasets and training data
└── docs/           # Documentation and guides
```

### Tech Stack
- **Frontend**: Next.js 15.5.4, React, TypeScript, Tailwind CSS
- **Backend**: Python Flask, FastAPI
- **AI/ML**: YOLOv8, OpenCV, NumPy, Pandas
- **Blockchain**: Hyperledger Fabric (simulated)
- **Database**: JSON-based data management (easily adaptable to SQL/NoSQL)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- Git

### 1. Clone Repository
```bash
git clone https://github.com/01phanto/EcoLedger.git
cd EcoLedger
```

### 2. Setup Backend
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows:
.venv\Scripts\activate
# macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install flask flask-cors opencv-python ultralytics numpy pandas requests pillow

# Start backend server
python simple_backend.py
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Upload Page**: http://localhost:3000/upload
- **Dashboard**: http://localhost:3000/dashboard
- **Admin Panel**: http://localhost:3000/admin

## 📖 Usage Guide

### 🌱 Submitting a Project
1. Navigate to the **Upload Page**
2. Fill in project details (NGO name, location, trees planted)
3. Upload supporting evidence:
   - Ground-level images (for tree counting)
   - Satellite/aerial images (for NDVI analysis)
   - IoT sensor data (CSV format - optional)
4. Click "Start AI Verification"
5. Wait for AI analysis completion
6. View results in Dashboard

### � Monitoring Projects
- **Dashboard**: View all submitted projects and their verification status
- **Analytics**: Track carbon credit generation and environmental impact
- **Admin Panel**: Manage system settings and user permissions

### 🔌 API Integration
The backend provides RESTful APIs for:
- Project submission and verification
- AI model predictions
- Data analytics and reporting
- Blockchain simulation

## 🧪 Testing

### Run Frontend Tests
```bash
cd frontend
npm test
```

### Run Backend Tests
```bash
python -m pytest testing/
```

### Integration Testing
```bash
python test_workflow.py
```

## 🔧 Configuration

### Environment Variables
Create `.env` files for configuration:

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=EcoLedger
```

**Backend (.env)**:
```env
FLASK_ENV=development
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=16777216
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🌍 Impact

EcoLedger contributes to:
- **Climate Action**: Verified carbon credit generation
- **Environmental Protection**: Mangrove conservation tracking
- **Transparency**: Blockchain-based verification
- **Innovation**: AI-powered environmental monitoring

---

**Built with ❤️ for a sustainable future 🌍**
- `POST /ledger/transfer` - Transfer carbon credits

## 🌱 Project Flow

1. NGO uploads drone images, NDVI data, and IoT sensor CSV
2. AI models process data and generate verification scores
3. System calculates final score and carbon credits
4. Verified report is stored on blockchain ledger
5. Companies can view and purchase credits via dashboard

## 📄 License

MIT License - Built for hackathons and educational purposes

## 👥 Contributing

This project is hackathon-ready! Feel free to extend and improve the AI models, add new features, or enhance the UI/UX.