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
  const usersByRole = await prisma.user.groupBy({ by: ['role'], _count: { _all: true } });
  const programmeCount = await prisma.programme.count();
  const platCount = await prisma.plat.count();
  const conseilCount = await prisma.conseil.count();

  const topFollowed = await prisma.suiviProgramme.groupBy({
    by: ['programme_id'],
    _count: { _all: true },
    orderBy: { _count: { _all: 'desc' } },
    take: 5,
  });
  const progression = await prisma.suiviProgramme.aggregate({ _avg: { current_step: true } });
  const totalSuivi = await prisma.suiviProgramme.count();
  const abandoned = await prisma.suiviProgramme.count({ where: { completed: false } });
  const abandonRate = totalSuivi === 0 ? 0 : abandoned / totalSuivi;

  const topLiked = await prisma.like.groupBy({
    by: ['type', 'target_id'],
    _count: { _all: true },
    orderBy: { _count: { _all: 'desc' } },
    take: 5,
  });
  const topCommented = await prisma.commentaire.groupBy({
    by: ['type', 'target_id'],
    _count: { _all: true },
    orderBy: { _count: { _all: 'desc' } },
    take: 5,
  });

  res.json({
    usersByRole,
    programmeCount,
    platCount,
    conseilCount,
    topFollowed,
    progressionMoyenne: progression._avg.current_step,
    tauxAbandon: abandonRate,
    topLiked,
    topCommented,
  });
};

export const deletePublication = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  try {
    if (type === 'programme') {
      await prisma.programme.delete({ where: { id: Number(id) } });
    } else if (type === 'plat') {
      await prisma.plat.delete({ where: { id: Number(id) } });
    } else if (type === 'conseil') {
      await prisma.conseil.delete({ where: { id: Number(id) } });
    } else {
      return res.status(400).json({ error: 'Invalid type' });
    }
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Deletion failed' });
  }
};
