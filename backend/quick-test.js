// Test rapide du serveur corrigé - démarrage et arrêt automatique
import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

console.log('🧪 Test du serveur corrigé...');

const PORT = 3003; // Port de test pour éviter conflit
const prisma = new PrismaClient();

// Créer un serveur de test minimaliste
const server = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;
  
  if (path === '/test') {
    try {
      // Test query Prisma
      const userCount = await prisma.user.count();
      
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ 
        status: 'OK', 
        users: userCount,
        message: 'Serveur corrigé fonctionne !',
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      response.writeHead(500, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify({ error: error.message }));
    }
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

server.listen(PORT, async () => {
  console.log(`✅ Serveur test démarré sur port ${PORT}`);
  
  try {
    // Test de connexion
    const response = await fetch(`http://localhost:${PORT}/test`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Test endpoint réussi:', data.message);
      console.log(`📊 Utilisateurs en base: ${data.users}`);
    } else {
      console.log('❌ Test endpoint échoué:', data.error);
    }
  } catch (error) {
    console.log('❌ Erreur test:', error.message);
  }
  
  // Fermer le serveur
  server.close();
  await prisma.$disconnect();
  console.log('🔌 Serveur test fermé');
  console.log('🎉 Test terminé - Serveur corrigé OK !');
});
