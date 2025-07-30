import prisma from '../prismaClient.js';

export const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({ where: { role: { in: ['nutritionist', 'client'] } }, select: { id: true, name: true, email: true, role: true, is_active: true } });
  res.json(users);
};
