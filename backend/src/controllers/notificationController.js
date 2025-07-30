import prisma from '../prismaClient.js';

export const getNotifications = async (req, res) => {
  const notifs = await prisma.notification.findMany({
    where: { user_id: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notifs);
};

export const createNotification = async (data) => {
  return prisma.notification.create({ data });
};
