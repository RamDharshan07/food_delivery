# PowerShell script to start all services
# Run this script to start all backend services

Write-Host "Starting Food Delivery Services..." -ForegroundColor Green

# Start Python Backend
Write-Host "`n[1/4] Starting Python Backend (Port 6000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\python-backend'; python main.py"

Start-Sleep -Seconds 2

# Start Node.js Backend Instance 1
Write-Host "[2/4] Starting Node.js Backend Instance 1 (Port 4000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\node-backend'; `$env:PORT=4000; npm start"

Start-Sleep -Seconds 2

# Start Node.js Backend Instance 2
Write-Host "[3/4] Starting Node.js Backend Instance 2 (Port 4001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\node-backend'; `$env:PORT=4001; npm start"

Start-Sleep -Seconds 2

# Start Frontend
Write-Host "[4/4] Starting Frontend (Port 3000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host "`n✅ All services started!" -ForegroundColor Green
Write-Host "`nNote: You still need to start NGINX manually:" -ForegroundColor Cyan
Write-Host "  1. Download NGINX for Windows" -ForegroundColor Cyan
Write-Host "  2. Copy nginx/nginx.conf to your NGINX conf folder" -ForegroundColor Cyan
Write-Host "  3. Run: cd C:\nginx && .\nginx.exe" -ForegroundColor Cyan
Write-Host "`nFrontend will be available at: http://localhost:3000" -ForegroundColor Green



