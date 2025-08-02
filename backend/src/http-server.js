import http from 'http';
import url from 'url';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 3001;

// Fonction pour analyser le corps JSON
function parseBody(request) {
  return new Promise((resolve, reject) => {
    let body = '';
    request.on('data', chunk => {
      body += chunk.toString();
    });
    request.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        resolve({});
      }
    });
    request.on('error', reject);
  });
}

// Fonction pour définir les headers CORS
function setCorsHeaders(response) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
}

// Fonction pour envoyer une réponse JSON
function sendJsonResponse(response, statusCode, data) {
  setCorsHeaders(response);
  response.writeHead(statusCode, { 'Content-Type': 'application/json' });
  response.end(JSON.stringify(data));
}

// Utilisateurs de test
const users = {
  'admin@example.com': { id: 1, name: 'Admin User', role: 'admin' },
  'nutritionist@example.com': { id: 2, name: 'Nutritionist User', role: 'nutritionist' },
  'client@example.com': { id: 3, name: 'Client User', role: 'client' }
};

// Programmes de test
const programmes = [
  {
    id: 1,
    title: 'Programme perte de poids',
    description: 'Un programme complet pour perdre du poids sainement',
    objective: 'Perte de poids',
    image: null,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Programme prise de masse',
    description: 'Programme pour développer la masse musculaire',
    objective: 'Prise de masse',
    image: null,
    createdAt: new Date().toISOString()
  }
];

// Créer le serveur
const server = http.createServer(async (request, response) => {
  const parsedUrl = url.parse(request.url, true);
  const path = parsedUrl.pathname;
  const method = request.method;

  console.log(`${new Date().toISOString()} - ${method} ${path}`);

  // Gérer les requêtes OPTIONS (preflight CORS)
  if (method === 'OPTIONS') {
    setCorsHeaders(response);
    response.writeHead(200);
    response.end();
    return;
  }

  // Route de base
  if (path === '/' && method === 'GET') {
    sendJsonResponse(response, 200, {
      message: 'API nutritionnelle',
      version: '1.0.0',
      status: 'running',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Health check
  if (path === '/health' && method === 'GET') {
    sendJsonResponse(response, 200, {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: 'MySQL on port 3307'
    });
    return;
  }

  // Login
  if (path === '/api/login' && method === 'POST') {
    try {
      const body = await parseBody(request);
      const { email, password } = body;

      console.log('Login attempt:', { email });

      if (!email || !password) {
        sendJsonResponse(response, 400, { error: 'Email et mot de passe requis' });
        return;
      }

      if (users[email] && password === 'password') {
        const user = users[email];
        const token = 'mock-jwt-token-' + user.id + '-' + Date.now();

        console.log('✅ Login successful for:', email);
        sendJsonResponse(response, 200, {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: email,
            role: user.role
          }
        });
      } else {
        console.log('❌ Login failed for:', email);
        sendJsonResponse(response, 400, { error: 'Email ou mot de passe incorrect' });
      }
    } catch (error) {
      console.error('Login error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Register
  if (path === '/api/register' && method === 'POST') {
    try {
      const body = await parseBody(request);
      const { name, email, password, role = 'client' } = body;

      console.log('Register attempt:', { name, email, role });

      if (!name || !email || !password) {
        sendJsonResponse(response, 400, { error: 'Nom, email et mot de passe requis' });
        return;
      }

      if (password.length < 6) {
        sendJsonResponse(response, 400, { error: 'Le mot de passe doit contenir au moins 6 caractères' });
        return;
      }

      if (users[email]) {
        sendJsonResponse(response, 400, { error: 'Cet email est déjà utilisé' });
        return;
      }

      const newUser = {
        id: Math.floor(Math.random() * 1000) + 100,
        name,
        email,
        role
      };

      const token = 'mock-jwt-token-' + newUser.id + '-' + Date.now();

      console.log('✅ Registration successful for:', email);
      sendJsonResponse(response, 201, { token, user: newUser });
    } catch (error) {
      console.error('Register error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Get current user
  if (path === '/api/me' && method === 'GET') {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      sendJsonResponse(response, 401, { error: 'Token manquant' });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (token.startsWith('mock-jwt-token-')) {
      const userId = token.split('-')[3];
      
      const mockUsers = {
        '1': { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
        '2': { id: 2, name: 'Nutritionist User', email: 'nutritionist@example.com', role: 'nutritionist' },
        '3': { id: 3, name: 'Client User', email: 'client@example.com', role: 'client' }
      };

      const user = mockUsers[userId] || {
        id: parseInt(userId) || 999,
        name: 'Test User',
        email: 'test@example.com',
        role: 'client'
      };

      sendJsonResponse(response, 200, user);
    } else {
      sendJsonResponse(response, 401, { error: 'Token invalide' });
    }
    return;
  }

  // Get programmes
  if (path === '/api/programmes' && method === 'GET') {
    sendJsonResponse(response, 200, programmes);
    return;
  }

  // Route non trouvée
  console.log('❌ Route not found:', method, path);
  sendJsonResponse(response, 404, { error: 'Route non trouvée' });
});

// Démarrer le serveur
server.listen(PORT, () => {
  console.log('🚀 ================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:8080`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🗄️ MySQL: localhost:3307`);
  console.log('🚀 ================================');
  console.log('✅ Backend ready for development!');
  console.log('\n📋 Available endpoints:');
  console.log('   - GET  /health');
  console.log('   - POST /api/login');
  console.log('   - POST /api/register');
  console.log('   - GET  /api/me');
  console.log('   - GET  /api/programmes');
  console.log('\n🧪 Test accounts:');
  console.log('   - admin@example.com / password');
  console.log('   - nutritionist@example.com / password');
  console.log('   - client@example.com / password');
  console.log('🚀 ================================\n');
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});
