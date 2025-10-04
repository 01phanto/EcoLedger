#!/bin/bash
# EcoLedger Deployment Script

echo "🌱 Setting up EcoLedger..."

# Check if Python is installed
if ! command -v python &> /dev/null; then
    echo "❌ Python is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Setup backend
echo "🔧 Setting up backend..."
python -m venv .venv

# Activate virtual environment (Linux/macOS)
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

echo "✅ Backend setup complete"

# Setup frontend
echo "🔧 Setting up frontend..."
cd frontend
npm install
cd ..

echo "✅ Frontend setup complete"

# Create necessary directories
mkdir -p uploads
mkdir -p outputs
mkdir -p data

echo "📁 Created necessary directories"

echo "🎉 EcoLedger setup complete!"
echo ""
echo "To start the application:"
echo "1. Backend: python simple_backend.py"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Access the app at: http://localhost:3000"