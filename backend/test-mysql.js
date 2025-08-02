// Test de connexion MySQL avec Prisma
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('🔧 Configuration MySQL:');
console.log('📊 DATABASE_URL:', process.env.DATABASE_URL);
console.log('');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('🔌 Test de connexion à MySQL...');
    
    // Test de connexion basique
    await prisma.$connect();
    console.log('✅ Connexion à MySQL réussie !');
    
    // Test de requête simple
    console.log('🧪 Test de requête...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Requête test réussie:', result);
    
    // Vérifier les tables existantes
    console.log('📋 Vérification des tables...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'nutrition_app'
    `;
    console.log('📊 Tables trouvées:', tables);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.code === 'P1001') {
      console.log('🔍 Problème de connectivité. Vérifiez que MySQL fonctionne sur le port 3307');
    } else if (error.code === 'P1000') {
      console.log('🔍 Problème d\'authentification. Vérifiez le nom d\'utilisateur et mot de passe');
    } else if (error.code === 'P1003') {
      console.log('🔍 Base de données "nutrition_app" n\'existe pas encore');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Connexion fermée.');
  }
}

testConnection();
