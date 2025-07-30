import prisma from '../prismaClient.js';

export const createPlat = async (req, res) => {
  const { title, description, image, benefits, programmeId } = req.body;
  try {
    const plat = await prisma.plat.create({
      data: {
        title,
        description,
        image,
        benefits,
        is_global: !programmeId,
        programme_id: programmeId ? Number(programmeId) : null,
        created_by: req.user.id,
      },
    });
    res.json(plat);
  } catch {
    res.status(500).json({ error: 'Creation failed' });
  }
};

export const updatePlat = async (req, res) => {
  const { id } = req.params;
  const { title, description, image, benefits } = req.body;
  try {
    const plat = await prisma.plat.update({
      where: { id: Number(id) },
      data: { title, description, image, benefits },
    });
    res.json(plat);
  } catch {
    res.status(500).json({ error: 'Update failed' });
  }
};

export const deletePlat = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.plat.delete({ where: { id: Number(id) } });
    res.json({ message: 'Deleted' });
  } catch {
    res.status(500).json({ error: 'Deletion failed' });
  }
};

export const getGlobalPlats = async (req, res) => {
  const plats = await prisma.plat.findMany({ where: { is_global: true } });
  res.json(plats);
};
