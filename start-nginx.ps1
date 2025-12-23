# Script to start NGINX
$nginxPath = "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4\nginx-1.29.4"

Write-Host "Starting NGINX..." -ForegroundColor Green

if (Test-Path "$nginxPath\nginx.exe") {
    Set-Location $nginxPath
    Start-Process -FilePath ".\nginx.exe" -WindowStyle Hidden
    Start-Sleep -Seconds 1
    
    $process = Get-Process -Name nginx -ErrorAction SilentlyContinue
    if ($process) {
        Write-Host "✅ NGINX started successfully!" -ForegroundColor Green
        Write-Host "   Process ID: $($process.Id)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  NGINX may have started but process check failed." -ForegroundColor Yellow
        Write-Host "   Check if port 80 is available or if NGINX is already running." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ NGINX.exe not found at: $nginxPath\nginx.exe" -ForegroundColor Red
}



