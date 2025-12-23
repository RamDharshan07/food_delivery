# 🚀 START HERE - How to Run the Application

## ✅ Step 1: Dependencies Installed
All dependencies are already installed! ✓

## 📋 Step 2: Setup NGINX (One-time setup)

1. **Download NGINX for Windows:**
   - Go to: http://nginx.org/en/download.html
   - Download the "Windows" version (e.g., `nginx/Windows-1.25.3`)
   - Extract to `C:\nginx` (or any folder you prefer)

2. **Copy NGINX config:**
   - Copy `nginx/nginx.conf` from this project
   - Paste it to `C:\nginx\conf\nginx.conf` (replace existing file)

3. **Create logs folder:**
   - Create folder: `C:\nginx\logs\` (if it doesn't exist)

## 🎯 Step 3: Start All Services

You need to open **5 separate PowerShell/Command Prompt windows**:

### Terminal 1: Python Backend (Port 6000)
```powershell
cd C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\python-backend
python main.py
```
**Wait for:** `🚀 Starting Python Restaurant Service on port 6000`

### Terminal 2: Node.js Instance 1 (Port 4000)
```powershell
cd C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\node-backend
$env:PORT=4000
npm start
```
**Wait for:** `🚀 Node.js API Gateway running on port 4000`

### Terminal 3: Node.js Instance 2 (Port 4001)
```powershell
cd C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\node-backend
$env:PORT=4001
npm start
```
**Wait for:** `🚀 Node.js API Gateway running on port 4001`

### Terminal 4: NGINX
```powershell
cd C:\nginx
.\nginx.exe
```
(No output = success! If you see an error, port 80 might be in use)

### Terminal 5: Frontend (Next.js)
```powershell
cd C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\frontend
npm run dev
```
**Wait for:** `Ready - started server on 0.0.0.0:3000`

## 🌐 Step 4: Open the App

Open your browser and go to: **http://localhost:3000**

## ✨ What You Can Do

1. **View Restaurants** - See list of 5 restaurants
2. **Search** - Type in search box to filter restaurants
3. **View Menu** - Click on any restaurant to see menu
4. **Add to Cart** - Click "Add" on menu items
5. **Place Order** - Click "Place Order" button
6. **Check Status** - View order status page

## 🔍 Verify Load Balancing

1. Open browser DevTools (F12) → Network tab
2. Refresh the restaurants page multiple times
3. Check Terminal 2 and Terminal 3 - you'll see requests distributed between port 4000 and 4001!

## 🛑 To Stop Services

- **NGINX**: `.\nginx.exe -s stop` (in NGINX directory)
- **Others**: Press `Ctrl+C` in each terminal

## ❓ Troubleshooting

- **Port 80 in use**: Run NGINX as Administrator, or change port in nginx.conf
- **Can't connect**: Make sure all 5 services are running
- **Python errors**: Make sure you're in the correct directory

---

**Need help?** Check `README.md` for detailed documentation!



