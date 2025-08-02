# Script de configuration MySQL pour Nutrition App

Write-Host "🗄️ Configuration MySQL pour Nutrition App" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Vérifier si MySQL est accessible
Write-Host "🔍 Vérification de la connexion MySQL..." -ForegroundColor Yellow

try {
    # Test de connexion MySQL
    $mysqlTest = mysql -u root -p -P 3307 -h localhost -e "SELECT VERSION();" 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MySQL est accessible sur le port 3307" -ForegroundColor Green
    } else {
        Write-Host "❌ MySQL n'est pas accessible. Vérifiez qu'il est démarré sur le port 3307" -ForegroundColor Red
        Write-Host "💡 Commandes pour démarrer MySQL :" -ForegroundColor Yellow
        Write-Host "   - Via XAMPP : Démarrer le service MySQL" -ForegroundColor Gray
        Write-Host "   - Via MySQL Workbench : Démarrer la connexion" -ForegroundColor Gray
        Write-Host "   - Via Services Windows : Démarrer le service MySQL" -ForegroundColor Gray
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du test MySQL : $_" -ForegroundColor Red
    Write-Host "💡 Assurez-vous que MySQL est installé et accessible" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔧 Étapes suivantes :" -ForegroundColor White
Write-Host "1. Créer la base de données 'nutrition_app'" -ForegroundColor Gray
Write-Host "2. Exécuter les migrations Prisma" -ForegroundColor Gray
Write-Host "3. Peupler avec des données de test" -ForegroundColor Gray

Write-Host ""
Write-Host "📋 Commandes à exécuter :" -ForegroundColor White
Write-Host "mysql -u root -p -P 3307 -e 'CREATE DATABASE IF NOT EXISTS nutrition_app;'" -ForegroundColor Gray
Write-Host "npx prisma db push" -ForegroundColor Gray
Write-Host "npm run seed" -ForegroundColor Gray
