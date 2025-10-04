@echo off
REM EcoLedger Windows Deployment Script

echo 🌱 Setting up EcoLedger...

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Setup backend
echo 🔧 Setting up backend...
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt

echo ✅ Backend setup complete

REM Setup frontend
echo 🔧 Setting up frontend...
cd frontend
npm install
cd ..

echo ✅ Frontend setup complete

REM Create necessary directories
if not exist "uploads" mkdir uploads
if not exist "outputs" mkdir outputs
if not exist "data" mkdir data

echo 📁 Created necessary directories

echo 🎉 EcoLedger setup complete!
echo.
echo To start the application:
echo 1. Backend: python simple_backend.py
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Access the app at: http://localhost:3000
pause