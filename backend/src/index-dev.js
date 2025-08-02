import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configuration CORS
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes de base
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
    database: 'Not connected yet'
  });
});

// Mock auth endpoints pour commencer
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Mock users
  const users = {
    'admin@example.com': { id: 1, name: 'Admin User', role: 'admin' },
    'nutritionist@example.com': { id: 2, name: 'Nutritionist User', role: 'nutritionist' },
    'client@example.com': { id: 3, name: 'Client User', role: 'client' }
  };
  
  if (users[email] && password === 'password') {
    const user = users[email];
    const token = 'mock-jwt-token-' + user.id;
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
    res.status(400).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  
  const user = {
    id: Math.floor(Math.random() * 1000),
    name,
    email,
    role
  };
  
  const token = 'mock-jwt-token-' + user.id;
  
  res.status(201).json({ 
    token, 
    user
  });
});

app.get('/api/me', (req, res) => {
  // Simple mock pour /me
  res.json({
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    role: 'client'
  });
});

// Mock programmes endpoint
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

// Middleware de gestion d'erreurs global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route non trouvée
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/health`);
  console.log(`\n✅ Backend ready for development!`);
});
