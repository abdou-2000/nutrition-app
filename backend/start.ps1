Write-Host "🚀 Démarrage du serveur Nutrition API avec Prisma..." -ForegroundColor Green
Write-Host "📊 Base de données: MySQL sur port 3307" -ForegroundColor Yellow
Write-Host "🌐 Serveur: Port 3001" -ForegroundColor Cyan
Write-Host ""

Set-Location "C:\src\nutrition-app\backend"

Write-Host "▶️ Lancement du serveur..." -ForegroundColor Blue
npm run dev
