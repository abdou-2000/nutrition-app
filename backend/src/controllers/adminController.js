import prisma from '../prismaClient.js';

export const listUsers = async (req, res) => {
  const users = await prisma.user.findMany({ where: { role: { in: ['nutritionist', 'client'] } }, select: { id: true, name: true, email: true, role: true, is_active: true } });
  res.json(users);
};

export const toggleUser = async (req, res) => {
  const { id } = req.params;
  const current = await prisma.user.findUnique({ where: { id: Number(id) } });
  if (!current) return res.status(404).json({ error: 'Not found' });
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { is_active: !current.is_active },
  });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({ where: { id: Number(id) } });
  res.json({ message: 'Deleted' });
};

export const listContent = async (req, res) => {
  const programmes = await prisma.programme.findMany();
  const plats = await prisma.plat.findMany();
  const conseils = await prisma.conseil.findMany();
  res.json({ programmes, plats, conseils });
};

export const stats = async (req, res) => {
  const usersByRole = await prisma.user.groupBy({ by: ['role'], _count: true });
  const programmeCount = await prisma.programme.count();
  const platCount = await prisma.plat.count();
  const conseilCount = await prisma.conseil.count();
  res.json({ usersByRole, programmeCount, platCount, conseilCount });
};
