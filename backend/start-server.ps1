Write-Host "🚀 Starting Nutrition App Backend..." -ForegroundColor Green
Write-Host "📁 Navigating to backend directory..." -ForegroundColor Yellow

Set-Location "C:\src\nutrition-app\backend"

Write-Host "🌐 Starting HTTP server on port 3001..." -ForegroundColor Blue
node src/http-server.js
