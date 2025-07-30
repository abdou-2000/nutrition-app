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
app.use(cors());
app.use(express.json());

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
  res.json({ message: 'API nutritionnelle' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
