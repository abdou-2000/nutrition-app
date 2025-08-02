import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

const app = express();

// Configuration CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Middleware pour parser JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Route de base
app.get('/', (req, res) => {
  res.json({ 
    message: 'API nutritionnelle', 
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: 'MySQL on port 3307'
  });
});

// Endpoint de connexion
app.post('/api/login', (req, res) => {
  console.log('Login attempt:', req.body);
  
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email et mot de passe requis' 
    });
  }
  
  // Utilisateurs de test
  const users = {
    'admin@example.com': { id: 1, name: 'Admin User', role: 'admin' },
    'nutritionist@example.com': { id: 2, name: 'Nutritionist User', role: 'nutritionist' },
    'client@example.com': { id: 3, name: 'Client User', role: 'client' }
  };
  
  if (users[email] && password === 'password') {
    const user = users[email];
    const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
    
    console.log('✅ Login successful for:', email);
    res.json({ 
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
    res.status(400).json({ error: 'Email ou mot de passe incorrect' });
  }
});

// Endpoint d'inscription
app.post('/api/register', (req, res) => {
  console.log('Register attempt:', req.body);
  
  const { name, email, password, role = 'client' } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      error: 'Nom, email et mot de passe requis' 
    });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ 
      error: 'Le mot de passe doit contenir au moins 6 caractères' 
    });
  }
  
  // Vérification email existant (simulation)
  const existingEmails = ['admin@example.com', 'nutritionist@example.com', 'client@example.com'];
  if (existingEmails.includes(email)) {
    return res.status(400).json({ 
      error: 'Cet email est déjà utilisé' 
    });
  }
  
  const user = {
    id: Math.floor(Math.random() * 1000) + 100,
    name,
    email,
    role
  };
  
  const token = 'mock-jwt-token-' + user.id + '-' + Date.now();
  
  console.log('✅ Registration successful for:', email);
  res.status(201).json({ 
    token, 
    user
  });
});

// Endpoint profil utilisateur
app.get('/api/me', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
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
    
    res.json(user);
  } else {
    res.status(401).json({ error: 'Token invalide' });
  }
});

// Endpoint programmes
app.get('/api/programmes', (req, res) => {
  res.json([
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
  ]);
});

// Gestion d'erreurs globale
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route non trouvée
app.use('*', (req, res) => {
  console.log('❌ Route not found:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
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
