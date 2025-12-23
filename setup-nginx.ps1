# Script to copy NGINX config file

Write-Host "Setting up NGINX configuration..." -ForegroundColor Green

$nginxPath = "C:\Users\RAM DHARSHAN.E\Downloads\nginx-1.29.4"
$configSource = "C:\Users\RAM DHARSHAN.E\Desktop\foodDelivery\nginx\nginx.conf"
$configDest = "$nginxPath\conf\nginx.conf"

if (Test-Path $configSource) {
    if (Test-Path "$nginxPath\conf") {
        Copy-Item -Path $configSource -Destination $configDest -Force
        Write-Host "✅ NGINX config copied successfully!" -ForegroundColor Green
        Write-Host "`nTo start NGINX, run:" -ForegroundColor Yellow
        Write-Host "cd $nginxPath" -ForegroundColor Cyan
        Write-Host ".\nginx.exe" -ForegroundColor Cyan
    } else {
        Write-Host "❌ NGINX conf folder not found at: $nginxPath\conf" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Config file not found at: $configSource" -ForegroundColor Red
}



