import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

export default async function auth(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const token = header.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }
    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ 
      where: { id: payload.userId }, 
      select: { id: true, role: true, is_active: true, email: true, name: true } 
    });
    
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    if (!user.is_active) {
      return res.status(403).json({ error: 'User account is disabled' });
    }
    
    req.user = { 
      userId: user.id, 
      role: user.role, 
      email: user.email, 
      name: user.name 
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
