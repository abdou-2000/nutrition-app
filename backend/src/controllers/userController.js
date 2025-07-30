import bcrypt from 'bcryptjs';
import prisma from '../prismaClient.js';

export const updateProfile = async (req, res) => {
  const { name, bio, avatar } = req.body;
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, bio, avatar },
    select: { id: true, name: true, email: true, role: true, bio: true, avatar: true },
  });
  res.json(user);
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: 'Invalid current password' });
  const hashed = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
  res.json({ message: 'Password updated' });
};
