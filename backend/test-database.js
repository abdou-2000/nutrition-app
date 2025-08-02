// Test de connexion à la base de données MySQL
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  console.log('🧪 Test de connexion à la base de données...');
  console.log('📊 DATABASE_URL:', process.env.DATABASE_URL);
  
  try {
    // Test de connexion simple
    await prisma.$connect();
    console.log('✅ Connexion à MySQL réussie !');
    
    // Test d'une requête simple
    const result = await prisma.$queryRaw`SELECT VERSION() as version, DATABASE() as database_name`;
    console.log('🗄️ Informations MySQL:', result);
    
    // Vérifier si les tables existent
    const tables = await prisma.$queryRaw`SHOW TABLES`;
    console.log('📋 Tables existantes:', tables);
    
    if (tables.length === 0) {
      console.log('⚠️  Aucune table trouvée. Les migrations Prisma sont nécessaires.');
      console.log('💡 Exécutez: npx prisma db push');
    } else {
      console.log('✅ Tables détectées. La base de données semble configurée.');
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error('🔍 Détails:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('💡 MySQL n\'est pas accessible. Vérifiez:');
      console.log('   - MySQL est démarré');
      console.log('   - Le port 3307 est correct');
      console.log('   - Les identifiants root/password sont corrects');
    }
    
    if (error.message.includes('Unknown database')) {
      console.log('💡 La base de données nutrition_app n\'existe pas.');
      console.log('   Créez-la avec: CREATE DATABASE nutrition_app;');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Connexion fermée.');
  }
}

// Exécuter le test
testDatabaseConnection()
  .then(() => {
    console.log('🎉 Test terminé !');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Erreur critique:', error);
    process.exit(1);
  });
