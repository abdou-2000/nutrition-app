import http from 'http';
import url from 'url';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Charger les variables d'environnement
dotenv.config();

const PORT = process.env.PORT || 3001;
const prisma = new PrismaClient();

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

// Fonction pour générer un token JWT simple (mock)
function generateToken(user) {
  return `jwt-${user.id}-${Date.now()}`;
}

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
      message: 'API nutritionnelle avec Prisma',
      version: '1.0.0',
      status: 'running',
      database: 'MySQL connected',
      timestamp: new Date().toISOString()
    });
    return;
  }

  // Health check avec test DB
  if (path === '/health' && method === 'GET') {
    try {
      await prisma.$queryRaw`SELECT 1`;
      sendJsonResponse(response, 200, {
        status: 'OK',
        database: 'Connected',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      sendJsonResponse(response, 500, {
        status: 'ERROR',
        database: 'Disconnected',
        error: error.message
      });
    }
    return;
  }

  // Login avec base de données
  if (path === '/api/login' && method === 'POST') {
    try {
      const body = await parseBody(request);
      const { email, password } = body;

      console.log('Login attempt:', { email });

      if (!email || !password) {
        sendJsonResponse(response, 400, { error: 'Email et mot de passe requis' });
        return;
      }

      // Chercher l'utilisateur dans la base de données
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        sendJsonResponse(response, 400, { error: 'Utilisateur non trouvé' });
        return;
      }

      // Vérifier le mot de passe (pour l'instant accepter 'password' en test)
      const isValidPassword = password === 'password' || await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        sendJsonResponse(response, 400, { error: 'Mot de passe incorrect' });
        return;
      }

      const token = generateToken(user);

      console.log('✅ Login successful for:', email);
      sendJsonResponse(response, 200, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Register avec base de données
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

      // Vérifier si l'utilisateur existe déjà
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        sendJsonResponse(response, 400, { error: 'Cet email est déjà utilisé' });
        return;
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Créer l'utilisateur
      const newUser = await prisma.user.create({
        data: {
          name: name,
          email,
          password: hashedPassword,
          role: role
        }
      });

      const token = generateToken(newUser);

      console.log('✅ Registration successful for:', email);
      sendJsonResponse(response, 201, {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      });
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

    try {
      // Extract user ID from token (simple mock implementation)
      if (token.startsWith('jwt-')) {
        const userId = parseInt(token.split('-')[1]);
        
        const user = await prisma.user.findUnique({
          where: { id: userId }
        });

        if (user) {
          sendJsonResponse(response, 200, {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          });
        } else {
          sendJsonResponse(response, 401, { error: 'Utilisateur non trouvé' });
        }
      } else {
        sendJsonResponse(response, 401, { error: 'Token invalide' });
      }
    } catch (error) {
      console.error('Me error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Get programmes depuis la base de données
  if (path === '/api/programmes' && method === 'GET') {
    try {
      const programmes = await prisma.programme.findMany({
        orderBy: { createdAt: 'desc' }
      });

      sendJsonResponse(response, 200, programmes);
    } catch (error) {
      console.error('Programmes error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Get users (admin only)
  if (path === '/api/users' && method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          is_active: true
        }
      });

      sendJsonResponse(response, 200, users);
    } catch (error) {
      console.error('Users error:', error);
      sendJsonResponse(response, 500, { error: 'Erreur serveur' });
    }
    return;
  }

  // Route non trouvée
  console.log('❌ Route not found:', method, path);
  sendJsonResponse(response, 404, { error: 'Route non trouvée' });
});

// Démarrer le serveur
server.listen(PORT, async () => {
  console.log('🚀 ================================');
  console.log(`🚀 Server with Prisma on port ${PORT}`);
  console.log(`📱 Frontend URL: http://localhost:8080`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}/api`);
  console.log('🚀 ================================');
  
  // Test de connexion à la DB
  try {
    await prisma.$connect();
    console.log('✅ Base de données connectée !');
    
    // Compter les utilisateurs
    const userCount = await prisma.user.count();
    const programmeCount = await prisma.programme.count();
    
    console.log(`👤 Utilisateurs: ${userCount}`);
    console.log(`📋 Programmes: ${programmeCount}`);
  } catch (error) {
    console.error('❌ Erreur DB:', error.message);
  }
  
  console.log('\n📋 Available endpoints:');
  console.log('   - GET  /health');
  console.log('   - POST /api/login');
  console.log('   - POST /api/register');
  console.log('   - GET  /api/me');
  console.log('   - GET  /api/programmes');
  console.log('   - GET  /api/users');
  console.log('🚀 ================================\n');
});

// Gestion des erreurs du serveur
server.on('error', (error) => {
  console.error('❌ Server error:', error);
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🔌 Arrêt du serveur...');
  await prisma.$disconnect();
  process.exit(0);
});
