const http = require('http');

const PORT = 3001;

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'API nutritionnelle backend',
      status: 'running',
      port: PORT,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  if (req.url === '/api/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { email, password } = JSON.parse(body);
        
        if (email === 'admin@example.com' && password === 'password') {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            token: 'mock-jwt-token-123',
            user: { id: 1, name: 'Admin User', email, role: 'admin' }
          }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Identifiants incorrects' }));
        }
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Données invalides' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route non trouvée' }));
});

server.listen(PORT, () => {
  console.log('✅ Serveur démarré sur le port', PORT);
  console.log('🌐 URL: http://localhost:' + PORT);
  console.log('📱 Frontend: http://localhost:8080');
});

module.exports = server;
