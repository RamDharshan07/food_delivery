# Native Deployment Guide (Without Docker)

This guide explains how to run the Food Delivery application natively on your machine without Docker.

## ✅ Prerequisites

- ✅ Node.js (v20.15.1 or higher)
- ✅ npm (v10.8.2 or higher)
- ✅ MongoDB (v7.0.11 or higher)

## 🚀 Quick Start

### Option 1: Use the Startup Script (Recommended)

**Windows:**
```bash
start-dev.bat
```

**Linux/Mac:**
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual Start

1. **Start MongoDB:**
   ```bash
   mongod --dbpath ./data/db
   ```

2. **Start Backend (in a new terminal):**
   ```bash
   cd node-backend
   npm install  # First time only
   npm start
   ```

3. **Start Frontend (in a new terminal):**
   ```bash
   cd frontend
   npm install  # First time only
   npm run dev
   ```

## 🌐 Access Your Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📁 Project Structure

```
foodDelivery/
├── frontend/          # Next.js frontend
│   ├── app/          # Next.js app directory
│   └── package.json
├── node-backend/      # Node.js/Express backend
│   ├── server.js     # Main server file
│   └── package.json
├── data/             # MongoDB data directory (created automatically)
│   └── db/           # MongoDB database files
└── start-dev.bat     # Windows startup script
```

## 🔧 Configuration

### Backend Environment Variables

Create `node-backend/.env` (optional):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/fooddelivery
```

### Frontend Environment Variables

Create `frontend/.env.local` (optional):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🛑 Stopping Services

1. **Stop Frontend**: Close the frontend terminal window or press `Ctrl+C`
2. **Stop Backend**: Close the backend terminal window or press `Ctrl+C`
3. **Stop MongoDB**: Close the MongoDB terminal window or press `Ctrl+C`

## 📝 Development Commands

### Backend
```bash
cd node-backend
npm start        # Start production server
npm run dev      # Start with nodemon (auto-restart)
```

### Frontend
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
```

## 🔍 Troubleshooting

### MongoDB Not Starting
- Check if MongoDB is already running: `mongod --version`
- Check if port 27017 is available
- Ensure the `data/db` directory exists and has write permissions

### Backend Connection Issues
- Verify MongoDB is running: Check the MongoDB terminal window
- Check the connection string in `server.js` or `.env`
- Ensure backend is running on port 5000

### Frontend Not Loading
- Verify backend is running: Visit http://localhost:5000/api/health
- Check the API URL in `frontend/.env.local`
- Clear browser cache

### Port Already in Use
- Change the port in the respective `package.json` or environment variables
- Kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

## 📊 Service Status

Check if services are running:

```bash
# Check MongoDB
mongosh --eval "db.version()"

# Check Backend
curl http://localhost:5000/api/health

# Check Frontend
curl http://localhost:3000
```

## 🚀 Production Deployment

For production deployment without Docker:

1. **Build Frontend:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Use PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start node-backend/server.js --name backend
   pm2 start frontend --name frontend
   pm2 save
   pm2 startup
   ```

3. **Use Nginx as Reverse Proxy:**
   - Configure Nginx to proxy requests
   - Point `/` to `http://localhost:3000`
   - Point `/api` to `http://localhost:5000`

## 📚 Additional Resources

- [Node.js Documentation](https://nodejs.org/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)



