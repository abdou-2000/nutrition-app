// Test du serveur corrigé
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testCorrections() {
  console.log('🧪 Test des corrections Prisma...\n');

  try {
    // Test 1: Connexion
    console.log('1️⃣ Test connexion...');
    await prisma.$connect();
    console.log('✅ Connexion réussie');

    // Test 2: Lecture utilisateurs avec bons champs
    console.log('\n2️⃣ Test lecture utilisateurs...');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        is_active: true
      },
      take: 3
    });
    console.log(`✅ Trouvé ${users.length} utilisateurs`);
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.role}`);
    });

    // Test 3: Lecture programmes avec bons champs  
    console.log('\n3️⃣ Test lecture programmes...');
    const programmes = await prisma.programme.findMany({
      orderBy: { createdAt: 'desc' },
      take: 3
    });
    console.log(`✅ Trouvé ${programmes.length} programmes`);
    programmes.forEach(prog => {
      console.log(`   - ${prog.title} (${prog.objective})`);
    });

    // Test 4: Test création utilisateur avec bons champs
    console.log('\n4️⃣ Test création utilisateur test...');
    
    // Vérifier si l'utilisateur test existe déjà
    const existingTest = await prisma.user.findUnique({
      where: { email: 'test@correction.com' }
    });

    if (existingTest) {
      console.log('✅ Utilisateur test existe déjà');
    } else {
      const testUser = await prisma.user.create({
        data: {
          name: 'Test Correction',
          email: 'test@correction.com',
          password: 'password123',
          role: 'client'
        }
      });
      console.log('✅ Utilisateur test créé:', testUser.name);
    }

    console.log('\n🎉 Toutes les corrections fonctionnent !');

  } catch (error) {
    console.error('❌ Erreur détectée:', error.message);
    console.error('📍 Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testCorrections();
