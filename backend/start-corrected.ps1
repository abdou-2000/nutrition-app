Write-Host "🔧 Démarrage du serveur corrigé..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "✅ Corrections appliquées:" -ForegroundColor Yellow
Write-Host "   - Champs Prisma corrigés (nom → name, motDePasse → password)" -ForegroundColor Gray
Write-Host "   - Requêtes database mises à jour" -ForegroundColor Gray
Write-Host "   - OrderBy corrigé (dateCreation → createdAt)" -ForegroundColor Gray
Write-Host ""

Set-Location "C:\src\nutrition-app\backend"

Write-Host "🚀 Lancement du serveur Prisma corrigé..." -ForegroundColor Blue
node src/prisma-server.js
