// Test complet de l'API avec Prisma
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001';

async function runTests() {
  console.log('🧪 Tests de l\'API avec Prisma');
  console.log('================================');

  // Test 1: Connexion de base
  try {
    console.log('\n1️⃣ Test de connexion...');
    const response = await fetch(`${API_BASE}/`);
    const data = await response.json();
    console.log('✅ Connexion:', data.message);
  } catch (error) {
    console.log('❌ Connexion échouée:', error.message);
    return;
  }

  // Test 2: Health check
  try {
    console.log('\n2️⃣ Test health check...');
    const response = await fetch(`${API_BASE}/health`);
    const data = await response.json();
    console.log('✅ Health:', data.status, '| DB:', data.database);
  } catch (error) {
    console.log('❌ Health check échoué:', error.message);
  }

  // Test 3: Liste des programmes
  try {
    console.log('\n3️⃣ Test programmes...');
    const response = await fetch(`${API_BASE}/api/programmes`);
    const data = await response.json();
    console.log('✅ Programmes trouvés:', data.length);
    if (data.length > 0) {
      console.log('   Premier programme:', data[0].titre || data[0].nom);
    }
  } catch (error) {
    console.log('❌ Programmes échoués:', error.message);
  }

  // Test 4: Liste des utilisateurs
  try {
    console.log('\n4️⃣ Test utilisateurs...');
    const response = await fetch(`${API_BASE}/api/users`);
    const data = await response.json();
    console.log('✅ Utilisateurs trouvés:', data.length);
    if (data.length > 0) {
      console.log('   Premier utilisateur:', data[0].nom, '(' + data[0].role + ')');
    }
  } catch (error) {
    console.log('❌ Utilisateurs échoués:', error.message);
  }

  // Test 5: Login (si on trouve un utilisateur)
  try {
    console.log('\n5️⃣ Test login...');
    
    // D'abord récupérer un utilisateur
    const usersResponse = await fetch(`${API_BASE}/api/users`);
    const users = await usersResponse.json();
    
    if (users.length > 0) {
      const testUser = users[0];
      
      const loginResponse = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: testUser.email,
          password: 'password' // Password de test
        })
      });
      
      const loginData = await loginResponse.json();
      
      if (loginResponse.ok) {
        console.log('✅ Login réussi pour:', testUser.email);
        console.log('   Token:', loginData.token.substring(0, 20) + '...');
      } else {
        console.log('❌ Login échoué:', loginData.error);
      }
    } else {
      console.log('⚠️ Aucun utilisateur pour tester le login');
    }
  } catch (error) {
    console.log('❌ Login test échoué:', error.message);
  }

  console.log('\n🎉 Tests terminés !');
}

// Attendre un peu que le serveur démarre
setTimeout(runTests, 2000);
