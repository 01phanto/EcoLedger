@echo off
echo 🌱 EcoLedger GitHub Deployment Script
echo =======================================
echo.
echo Step 1: Make sure you've created the repository on GitHub first!
echo Go to: https://github.com/01phanto and create a new repository named "EcoLedger"
echo.
echo Step 2: Run the following commands after creating the repo:
echo.

cd "c:\Users\Sohel Ali\OneDrive\Desktop\EcoLedger"

echo Setting up git remote...
git remote add origin https://github.com/01phanto/EcoLedger.git

echo Pushing to GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo 🎉 Successfully deployed to GitHub!
    echo Repository URL: https://github.com/01phanto/EcoLedger
    echo.
    echo Next steps for deployment:
    echo 1. Frontend: Deploy to Vercel - https://vercel.com
    echo 2. Backend: Deploy to Railway - https://railway.app
    echo.
) else (
    echo.
    echo ❌ Deployment failed. Please check:
    echo 1. Repository exists on GitHub
    echo 2. You have proper permissions
    echo 3. Internet connection is working
    echo.
)

pause