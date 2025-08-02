import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import programmeRoutes from './routes/programmes.js';
import platRoutes from './routes/plats.js';
import conseilRoutes from './routes/conseils.js';
import commentRoutes from './routes/commentaires.js';
import likeRoutes from './routes/likes.js';
import notifRoutes from './routes/notifications.js';
import clientRoutes from './routes/client.js';
import suiviRoutes from './routes/suivis.js';
import nutritionistRoutes from './routes/nutritionist.js';

dotenv.config();

const app = express();

// Configuration CORS plus sécurisée
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/programmes', programmeRoutes);
app.use('/api/plats', platRoutes);
app.use('/api/conseils', conseilRoutes);
app.use('/api/commentaires', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/notifications', notifRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/nutritionist', nutritionistRoutes);
app.use('/api/suivis', suiviRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API nutritionnelle', 
    version: '1.0.0',
    status: 'running'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
});
