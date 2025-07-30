import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

export default async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token' });
  const token = header.split(' ')[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: payload.userId }, select: { id: true, role: true, is_active: true } });
    if (!user || !user.is_active) return res.status(403).json({ error: 'User disabled' });
    req.user = { id: user.id, role: user.role };
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}
