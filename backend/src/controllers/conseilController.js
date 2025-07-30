import prisma from '../prismaClient.js';

export const createConseil = async (req, res) => {
  const { title, content, programmeId } = req.body;
  try {
    const conseil = await prisma.conseil.create({
      data: {
        title,
        content,
        is_global: !programmeId,
        programme_id: programmeId ? Number(programmeId) : null,
        created_by: req.user.id,
      },
    });
    res.json(conseil);
  } catch {
    res.status(500).json({ error: 'Creation failed' });
  }
};

export const updateConseil = async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  try {
    const conseil = await prisma.conseil.update({
      where: { id: Number(id) },
      data: { title, content },
    });
    res.json(conseil);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deleteConseil = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.conseil.delete({ where: { id: Number(id) } });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

export const getGlobalConseils = async (req, res) => {
  const conseils = await prisma.conseil.findMany({ where: { is_global: true } });
  res.json(conseils);
};
