# GitHub Pages Deployment

## 🌐 Live Demo
**Frontend**: https://01phanto.github.io/EcoLedger/

## 📋 Deployment Status
- ✅ **Frontend**: Deployed on GitHub Pages
- ⚠️ **Backend**: Simulated (Mock API for demo purposes)

## 🔧 How It Works

### GitHub Pages Deployment
This project is configured to automatically deploy to GitHub Pages using GitHub Actions. When you push to the main branch:

1. **GitHub Actions** triggers the deployment workflow
2. **Next.js** builds the static site with proper configuration
3. **GitHub Pages** serves the static files

### Mock API for Demo
Since GitHub Pages only supports static sites, the backend is simulated using:
- Mock API responses for all endpoints
- Realistic data generation
- Simulated processing delays
- Demo blockchain transactions

## 🚀 Deployment Commands

### Manual Build Test
```bash
cd frontend
npm run build
npm run export
```

### Automatic Deployment
Simply push to main branch:
```bash
git add .
git commit -m "Update deployment"
git push origin main
```

## 🔗 API Endpoints (Simulated)
- `/api/health` - Health check
- `/api/treecount` - Tree detection simulation
- `/api/ndvi` - NDVI analysis simulation
- `/api/iot` - IoT data processing simulation
- `/api/co2` - CO2 calculation simulation
- `/api/finalscore` - Final scoring simulation
- `/api/ledger` - Blockchain simulation

## 📊 Features Available in Demo
- ✅ Upload form with validation
- ✅ AI verification simulation
- ✅ Progress tracking
- ✅ Results visualization
- ✅ Project dashboard
- ✅ Admin panel
- ✅ Responsive design

## 🔧 For Production Deployment
To deploy with a real backend:
1. Deploy backend to Heroku/Railway/VPS
2. Update `NEXT_PUBLIC_API_URL` environment variable
3. Remove mock API integration
4. Configure CORS for your domain