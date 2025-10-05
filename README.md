# 🌱 EcoLedger - Advanced Carbon Credit Verification Platform

A comprehensive web application that transforms mangrove plantation projects from demo mode into a fully functional platform with Hyperledger blockchain integration, featuring NGO project uploads, AI verification, admin review, and carbon credit marketplace.

![EcoLedger Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![Flask](https://img.shields.io/badge/Flask-2.3+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)
![Hyperledger](https://img.shields.io/badge/Hyperledger-Fabric-orange)

## 🚀 Platform Transformation

### From Demo to Production
EcoLedger has been completely transformed from a demonstration application into a **fully functional, production-ready platform** with:

- ✅ **Complete Backend Architecture**: Flask + SQLAlchemy + PostgreSQL
- ✅ **Blockchain Integration**: Hyperledger Fabric with smart contracts
- ✅ **Real-time Communications**: WebSocket-based live notifications
- ✅ **Advanced AI Pipeline**: Orchestrated multi-model verification
- ✅ **Enterprise Authentication**: JWT with role-based access control
- ✅ **Carbon Credit Marketplace**: Complete trading platform
- ✅ **Production Deployment**: Docker containerization with health monitoring

## 🏗️ Enhanced Architecture

### Backend (Python + Flask)
- **Framework**: Flask with SQLAlchemy ORM and PostgreSQL
- **Authentication**: JWT-based with role-based access control (NGO, ADMIN, COMPANY)
- **AI Integration**: Orchestrated YOLOv8, NDVI, IoT sensors, CO2 calculations
- **Blockchain**: Hyperledger Fabric integration with chaincode simulation
- **Real-time**: WebSocket service for live notifications across all user roles
- **File Handling**: Secure multi-file upload with validation
- **Database**: Complete relational schema with indexes and triggers

### Frontend (Next.js + React + TypeScript)
- **Framework**: Next.js 15.5.4 with TypeScript and Tailwind CSS
- **Authentication**: JWT token management with automatic refresh
- **Real-time**: WebSocket integration for live project updates
- **State Management**: React Context with persistent storage
- **Responsive**: Mobile-first design with modern UI components

### Blockchain Layer
- **Network**: Hyperledger Fabric with chaincode smart contracts
- **Features**: Project verification, credit issuance, transfers, audit trails
- **Simulation**: Production-ready simulation mode for development
- **Security**: Cryptographic transaction verification and immutable ledger

## � Key Features

### 🤖 AI-Powered Verification
- **YOLOv8 Object Detection**: Automated mangrove tree counting from ground images
- **NDVI Analysis**: Satellite imagery processing for vegetation health assessment  
- **IoT Data Processing**: Real-time environmental sensor data analysis
- **CO2 Estimation**: Accurate carbon sequestration calculations
- **Parallel Processing**: Coordinated multi-model analysis pipeline

### 🔗 Complete Blockchain Integration
- **Hyperledger Fabric**: Production-ready blockchain network simulation
- **Smart Contracts**: Automated carbon credit lifecycle management
- **Audit Trails**: Immutable verification and transaction history
- **Network Statistics**: Real-time blockchain health monitoring

### 👥 Multi-Role User System
- **NGO Users**: Project upload, status tracking, credit management
- **Admin Users**: Project review, approval workflow, platform analytics
- **Company Users**: Marketplace browsing, credit purchasing, transaction history
- **Secure Authentication**: JWT tokens with automatic refresh and role validation

### 📊 Advanced Dashboard & Analytics
- **Project Management**: Complete lifecycle tracking with status updates
- **Real-time Notifications**: WebSocket-based live updates for all users
- **Admin Analytics**: Platform statistics, user metrics, blockchain monitoring
- **Marketplace Dashboard**: Available credits, transaction history, pricing analytics
- **Responsive UI**: Modern interface optimized for all device sizes

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