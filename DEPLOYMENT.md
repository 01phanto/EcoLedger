# Production Configuration Guide

## Environment Setup

### Frontend Environment (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_APP_NAME=EcoLedger
```

### Backend Environment (.env)
```env
FLASK_ENV=production
UPLOAD_FOLDER=uploads
MAX_FILE_SIZE=16777216
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## Deployment Platforms

### 1. Vercel (Frontend) + Railway/Heroku (Backend)

**Frontend on Vercel:**
1. Connect your GitHub repository to Vercel
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/.next`
4. Add environment variables in Vercel dashboard

**Backend on Railway:**
1. Connect repository to Railway
2. Set build command: `pip install -r requirements.txt`
3. Set start command: `python simple_backend.py`
4. Add environment variables in Railway dashboard

### 2. Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### 3. VPS Deployment
```bash
# On your VPS:
git clone https://github.com/01phanto/EcoLedger.git
cd EcoLedger
chmod +x setup.sh
./setup.sh

# Install PM2 for process management
npm install -g pm2

# Start backend
pm2 start simple_backend.py --name ecoledger-backend

# Start frontend
cd frontend
pm2 start "npm run start" --name ecoledger-frontend
```

## Security Considerations

### Environment Variables
- Never commit `.env` files
- Use platform-specific secret management
- Generate secure API keys for production

### File Uploads
- Configure file size limits
- Validate file types
- Use cloud storage (AWS S3, Cloudinary) for production

### API Security
- Add rate limiting
- Implement authentication/authorization
- Use HTTPS in production

## Monitoring

### Health Checks
- Backend: `GET /health`
- Frontend: Monitor build status
- Database: Check connection status

### Logging
- Enable production logging
- Monitor error rates
- Set up alerts for critical failures