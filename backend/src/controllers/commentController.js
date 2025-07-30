import prisma from '../prismaClient.js';

export const createComment = async (req, res) => {
  const { type, target_id, content } = req.body;
  try {
    const comment = await prisma.commentaire.create({
      data: {
        type,
        target_id: Number(target_id),
        content,
        user_id: req.user.id,
      },
    });
    // notify owner
    await createNotificationForTarget(type, target_id, 'new_comment');
    res.json(comment);
  } catch {
    res.status(500).json({ error: 'Creation failed' });
  }
};

export const getMyComments = async (req, res) => {
  const comments = await prisma.commentaire.findMany({
    where: { user_id: req.user.id },
  });
  res.json(comments);
};

export const getCommentsForTarget = async (req, res) => {
  const { type, id } = req.params;
  const comments = await prisma.commentaire.findMany({
    where: { type, target_id: Number(id) },
  });
  res.json(comments);
};

async function createNotificationForTarget(type, target_id, notifType) {
  const mapping = {
    programme: prisma.programme,
    plat: prisma.plat,
    conseil: prisma.conseil,
  };
  const model = mapping[type];
  if (!model) return;
  const item = await model.findUnique({ where: { id: Number(target_id) } });
  if (!item) return;
  const ownerId = item.created_by;
  if (ownerId === undefined) return;
  await prisma.notification.create({
    data: { user_id: ownerId, type: notifType, message: `${type} received a new comment` },
  });
}

export default createNotificationForTarget;
