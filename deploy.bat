@echo off
REM Food Delivery Application Deployment Script for Windows

echo 🚀 Starting Food Delivery Application Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

echo ✅ Docker and Docker Compose are installed

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up -d --build

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak >nul

REM Check service status
echo 📊 Service Status:
docker-compose ps

echo.
echo ✅ Deployment complete!
echo.
echo 🌐 Access your application:
echo    Frontend: http://localhost
echo    Backend API: http://localhost/api
echo    MongoDB: localhost:27017
echo.
echo 📝 View logs: docker-compose logs -f
echo 🛑 Stop services: docker-compose down

pause



