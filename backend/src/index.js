import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Autoriser le frontend (http://localhost:5173 pour Vite)
app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.get('/', (req, res) => {
  console.log('🔄 Requête GET reçue sur / depuis le frontend');
  res.json({ message: 'API nutritionnelle en ligne !' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend prêt sur http://localhost:${PORT}`));
