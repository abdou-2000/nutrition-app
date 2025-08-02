console.log('🧪 Test de démarrage du serveur...');

try {
  const http = require('http');
  console.log('✅ Module HTTP chargé avec succès');
  
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World!');
  });
  
  console.log('✅ Serveur créé avec succès');
  
  server.listen(3001, () => {
    console.log('✅ SUCCÈS: Serveur démarré sur le port 3001');
    console.log('🌐 URL de test: http://localhost:3001');
    console.log('🎯 Le backend est maintenant prêt !');
  });
  
  server.on('error', (error) => {
    console.error('❌ Erreur serveur:', error);
  });
  
} catch (error) {
  console.error('❌ Erreur lors du démarrage:', error);
}
