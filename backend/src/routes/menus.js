import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener todo el menú (público)
router.get('/', async (req, res) => {
  try {
    const menu = await MenuItem.find().sort({ categoria: 1, orden: 1 });
    res.json(menu);
  } catch (error) {
    console.error('Error al obtener menú:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener menú por categoría
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    const menu = await MenuItem.find({ categoria, disponible: true }).sort({ orden: 1 });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar plato (admin)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const plato = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    res.json(plato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Crear nuevo plato (admin)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const nuevoPlato = new MenuItem(req.body);
    await nuevoPlato.save();
    res.status(201).json(nuevoPlato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar plato (admin)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const plato = await MenuItem.findByIdAndDelete(req.params.id);
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    res.json({ mensaje: 'Plato eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Estadísticas del menú (admin)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalPlatos = await MenuItem.countDocuments();
    const disponibles = await MenuItem.countDocuments({ disponible: true });
    const porCategoria = await MenuItem.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } }
    ]);
    res.json({ totalPlatos, disponibles, porCategoria });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
