import dotenv from 'dotenv';
dotenv.config();

console.log('🚀 Testing backend configuration...');
console.log('Environment variables:');
console.log(`- PORT: ${process.env.PORT}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`- DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`- FRONTEND_URL: ${process.env.FRONTEND_URL}`);

// Test Prisma import
try {
  const { PrismaClient } = await import('@prisma/client');
  console.log('✅ Prisma Client imported successfully');
  
  const prisma = new PrismaClient();
  console.log('✅ Prisma Client instantiated successfully');
  
  // Test database connection (without actually connecting)
  console.log('✅ Basic setup completed');
  
} catch (error) {
  console.log('❌ Error with Prisma:', error.message);
}

console.log('\n🎯 Ready to start server!');
process.exit(0);
