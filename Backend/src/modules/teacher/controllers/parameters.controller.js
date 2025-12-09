import prisma from '../../../config/database.js';

export const getParameters = async (req, res) => {
  try {
    const params = await prisma.parametro.findMany({ select: { id: true, nombre: true } });
    return res.status(200).json({ success: true, data: params });
  } catch (err) {
    console.error('Error fetching parameters:', err);
    return res.status(err.status || 500).json({ success: false, message: err.message || 'Error interno', data: null });
  }
};

export default { getParameters };
