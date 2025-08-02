import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prismaClient.js';

export const register = async (req, res) => {
  const { name, email, password, role = 'client' } = req.body;
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already used' });
    
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ 
      data: { name, email, password: hashed, role },
      select: { id: true, name: true, email: true, role: true, is_active: true }
    });
    
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.status(201).json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        password: true, 
        role: true, 
        is_active: true 
      }
    });
    
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    if (!user.is_active) return res.status(403).json({ error: 'User disabled' });
    
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign(
      { userId: user.id, role: user.role }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      token, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.userId }, 
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true, 
        bio: true, 
        avatar: true, 
        is_active: true 
      } 
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Me endpoint error:', err);
    res.status(500).json({ error: 'Failed to get user info' });
  }
};
