# Quick Start Guide

## Step-by-Step Setup

### 1. Install Dependencies

**Frontend:**
```powershell
cd frontend
npm install
```

**Node.js Backend:**
```powershell
cd node-backend
npm install
```

**Python Backend:**
```powershell
cd python-backend
pip install -r requirements.txt
```

### 2. Setup NGINX

1. Download NGINX for Windows: http://nginx.org/en/download.html
2. Extract to `C:\nginx` (or any folder)
3. Copy `nginx/nginx.conf` to `C:\nginx\conf\nginx.conf`
4. Create `C:\nginx\logs\` folder if it doesn't exist

### 3. Start Services (in order)

Open **5 separate terminals**:

#### Terminal 1: Python Service
```powershell
cd python-backend
python main.py
```
Wait for: `🚀 Starting Python Restaurant Service on port 6000`

#### Terminal 2: Node.js Instance 1
```powershell
cd node-backend
$env:PORT=4000
npm start
```
Wait for: `🚀 Node.js API Gateway running on port 4000`

#### Terminal 3: Node.js Instance 2
```powershell
cd node-backend
$env:PORT=4001
npm start
```
Wait for: `🚀 Node.js API Gateway running on port 4001`

#### Terminal 4: NGINX
```powershell
cd C:\nginx
.\nginx.exe
```
(No output means it started successfully)

#### Terminal 5: Frontend
```powershell
cd frontend
npm run dev
```
Wait for: `Ready - started server on 0.0.0.0:3000`

### 4. Open Browser

Go to: **http://localhost:3000**

## Verify Load Balancing

1. Open browser DevTools (F12) → Network tab
2. Refresh the page multiple times
3. Check Terminal 2 and Terminal 3 - you should see requests distributed between port 4000 and 4001

## Troubleshooting

- **Port 80 in use**: Run NGINX as Administrator or change port in nginx.conf
- **Cannot connect**: Make sure all 5 services are running
- **Python not found**: Make sure Python is in your PATH

## Stop Services

- **NGINX**: `.\nginx.exe -s stop` (in NGINX directory)
- **Others**: Press `Ctrl+C` in each terminal



