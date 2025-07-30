import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password', 10);
  const admin = await prisma.user.create({ data: { name: 'Admin', email: 'admin@example.com', password, role: 'admin' } });
  const nutri = await prisma.user.create({ data: { name: 'Nutri', email: 'nutri@example.com', password, role: 'nutritionist' } });
  const client = await prisma.user.create({ data: { name: 'Client', email: 'client@example.com', password, role: 'client' } });

  const prog = await prisma.programme.create({ data: { title: 'Perte de poids', description: 'Programme de test', objective: 'perdre', created_by: nutri.id } });
  await prisma.plat.create({ data: { title: 'Salade', description: 'Salade verte', created_by: nutri.id, programme_id: prog.id } });
  await prisma.conseil.create({ data: { title: 'Boire', content: 'Boire de l eau', created_by: nutri.id, programme_id: prog.id } });
}

main().finally(() => prisma.$disconnect());
