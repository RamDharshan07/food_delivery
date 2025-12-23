@echo off
echo 🚀 Starting Food Delivery Application (Native Mode)
echo.

REM Check if MongoDB is running
echo 📊 Checking MongoDB...
mongod --version >nul 2>&1
if errorlevel 1 (
    echo ❌ MongoDB is not installed or not in PATH
    echo Please install MongoDB or add it to your PATH
    pause
    exit /b 1
)

REM Start MongoDB in a new window
echo 🗄️  Starting MongoDB...
start "MongoDB" cmd /k "mongod --dbpath .\data\db"

REM Wait for MongoDB to start
echo ⏳ Waiting for MongoDB to start...
timeout /t 5 /nobreak >nul

REM Install backend dependencies if needed
echo 📦 Installing backend dependencies...
cd node-backend
if not exist node_modules (
    call npm install
)
cd ..

REM Install frontend dependencies if needed
echo 📦 Installing frontend dependencies...
cd frontend
if not exist node_modules (
    call npm install
)
cd ..

REM Start backend in a new window
echo 🔧 Starting Node.js Backend...
start "Backend Server" cmd /k "cd node-backend && npm start"

REM Wait for backend to start
echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

REM Start frontend in a new window
echo 🎨 Starting Next.js Frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ All services are starting!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000/api
echo    Health Check: http://localhost:5000/api/health
echo.
echo 📝 Close the individual command windows to stop each service
echo 🛑 To stop MongoDB, close the MongoDB window
echo.
pause



