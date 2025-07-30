import prisma from '../prismaClient.js';
import createNotificationForTarget from './commentController.js';

export const like = async (req, res) => {
  const { type, target_id } = req.body;
  try {
    const existing = await prisma.like.findFirst({
      where: { user_id: req.user.id, type, target_id: Number(target_id) },
    });
    if (existing) return res.status(400).json({ error: 'Already liked' });
    const like = await prisma.like.create({
      data: { user_id: req.user.id, type, target_id: Number(target_id) },
    });
    await createNotificationForTarget(type, target_id, 'new_like');
    res.json(like);
  } catch {
    res.status(500).json({ error: 'Like failed' });
  }
};

export const getLikesForNutritionist = async (req, res) => {
  const programmes = await prisma.programme.findMany({
    where: { created_by: req.user.id },
    select: { id: true },
  });
  const ids = programmes.map(p => p.id);
  const likes = await prisma.like.findMany({
    where: {
      OR: [
        { type: 'programme', target_id: { in: ids } },
        { type: 'plat', target_id: { in: (await prisma.plat.findMany({where:{created_by:req.user.id},select:{id:true}})).map(p=>p.id) } },
        { type: 'conseil', target_id: { in: (await prisma.conseil.findMany({where:{created_by:req.user.id},select:{id:true}})).map(c=>c.id) } },
      ],
    },
  });
  res.json(likes);
};
