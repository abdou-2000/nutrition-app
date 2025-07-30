import prisma from '../prismaClient.js';

export const createProgramme = async (req, res) => {
  const { title, description, objective, image } = req.body;
  try {
    const programme = await prisma.programme.create({
      data: { title, description, objective, image, created_by: req.user.id },
    });
    res.json(programme);
  } catch (err) {
    res.status(500).json({ error: 'Creation failed' });
  }
};

export const getProgrammes = async (req, res) => {
  const programmes = await prisma.programme.findMany({
    include: { plats: true, conseils: true },
  });
  res.json(programmes);
};

export const getProgramme = async (req, res) => {
  const { id } = req.params;
  const programme = await prisma.programme.findUnique({
    where: { id: Number(id) },
    include: { plats: true, conseils: true },
  });
  if (!programme) return res.status(404).json({ error: 'Not found' });
  res.json(programme);
};

export const updateProgramme = async (req, res) => {
  const { id } = req.params;
  const { title, description, objective, image } = req.body;
  try {
    const programme = await prisma.programme.update({
      where: { id: Number(id) },
      data: { title, description, objective, image },
    });
    res.json(programme);
  } catch (err) {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deleteProgramme = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.programme.delete({ where: { id: Number(id) } });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

export const followProgramme = async (req, res) => {
  const { id } = req.params;
  try {
    const exist = await prisma.suiviProgramme.findFirst({
      where: { user_id: req.user.id, programme_id: Number(id) },
    });
    if (exist) return res.status(400).json({ error: 'Already following' });
    const suivi = await prisma.suiviProgramme.create({
      data: { user_id: req.user.id, programme_id: Number(id) },
    });
    res.json(suivi);
  } catch {
    res.status(500).json({ error: 'Follow failed' });
  }
};

export const advanceSuivi = async (req, res) => {
  const { id } = req.params;
  try {
    const suivi = await prisma.suiviProgramme.update({
      where: { id: Number(id) },
      data: { current_step: { increment: 1 } },
    });
    res.json(suivi);
  } catch {
    res.status(500).json({ error: 'Advance failed' });
  }
};
