// Script pour tester différentes configurations MySQL
import dotenv from 'dotenv';

dotenv.config();

console.log('🔍 Diagnostic des paramètres MySQL\n');

// Configurations possibles à tester
const configs = [
  {
    name: 'Configuration actuelle (.env)',
    url: process.env.DATABASE_URL
  },
  {
    name: 'MySQL par défaut (port 3306)',
    url: 'mysql://root:@localhost:3306/nutrition_app'
  },
  {
    name: 'MySQL XAMPP (port 3306, pas de mot de passe)',
    url: 'mysql://root:@localhost:3306/nutrition_app'
  },
  {
    name: 'MySQL personnalisé (port 3307, pas de mot de passe)',
    url: 'mysql://root:@localhost:3307/nutrition_app'
  },
  {
    name: 'MySQL avec mot de passe vide',
    url: 'mysql://root@localhost:3307/nutrition_app'
  }
];

console.log('📋 Configurations à tester:');
configs.forEach((config, index) => {
  console.log(`${index + 1}. ${config.name}`);
  console.log(`   URL: ${config.url}`);
  console.log('');
});

console.log('💡 Pour tester une configuration:');
console.log('1. Mettre à jour DATABASE_URL dans .env');
console.log('2. Relancer: node test-database.js');
console.log('');

console.log('🔧 Commandes MySQL utiles:');
console.log('- mysql -u root -p         (se connecter avec mot de passe)');
console.log('- mysql -u root            (se connecter sans mot de passe)');
console.log('- mysql -u root -P 3307    (spécifier le port)');
console.log('- SHOW DATABASES;          (lister les bases)');
console.log('- CREATE DATABASE nutrition_app; (créer la base)');
console.log('');

console.log('📊 Variables d\'environnement actuelles:');
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
