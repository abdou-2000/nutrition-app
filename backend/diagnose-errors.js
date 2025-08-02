// Script de diagnostic des erreurs
console.log('🔍 Diagnostic des erreurs du système...\n');

// Test 1: Import Prisma
try {
  console.log('1️⃣ Test import Prisma Client...');
  const { PrismaClient } = await import('@prisma/client');
  console.log('✅ Import Prisma réussi');
  
  const prisma = new PrismaClient();
  console.log('✅ Instance Prisma créée');
  
  // Test de connexion
  await prisma.$connect();
  console.log('✅ Connexion base de données réussie');
  
  await prisma.$disconnect();
  
} catch (error) {
  console.log('❌ Erreur Prisma:', error.message);
}

// Test 2: Import autres dépendances
try {
  console.log('\n2️⃣ Test imports dépendances...');
  
  const http = await import('http');
  console.log('✅ Module http');
  
  const url = await import('url');
  console.log('✅ Module url');
  
  const dotenv = await import('dotenv');
  console.log('✅ Module dotenv');
  
  const bcrypt = await import('bcryptjs');
  console.log('✅ Module bcryptjs');
  
} catch (error) {
  console.log('❌ Erreur dépendances:', error.message);
}

// Test 3: Variables d'environnement
try {
  console.log('\n3️⃣ Test variables d\'environnement...');
  
  const dotenv = await import('dotenv');
  dotenv.config();
  
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Définie' : '❌ Manquante');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Définie' : '❌ Manquante');
  console.log('PORT:', process.env.PORT ? '✅ Définie' : '❌ Manquante');
  
} catch (error) {
  console.log('❌ Erreur env:', error.message);
}

// Test 4: Test du serveur
try {
  console.log('\n4️⃣ Test création serveur...');
  
  const http = await import('http');
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'OK' }));
  });
  
  console.log('✅ Serveur HTTP créé');
  
  // Test d'écoute sur port alternatif
  server.listen(3002, () => {
    console.log('✅ Serveur écoute sur port 3002');
    server.close();
  });
  
} catch (error) {
  console.log('❌ Erreur serveur:', error.message);
}

console.log('\n🎯 Diagnostic terminé !');
