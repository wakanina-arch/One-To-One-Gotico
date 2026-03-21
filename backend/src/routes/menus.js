import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener todo el menú (público)
router.get('/', async (req, res) => {
  try {
    const menu = await MenuItem.find().sort({ categoria: 1, fechaCreacion: -1 });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener menú por categoría (público)
router.get('/categoria/:categoria', async (req, res) => {
  try {
    const { categoria } = req.params;
    const menu = await MenuItem.find({ categoria, disponible: true }).sort({ fechaCreacion: -1 });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener estadísticas del menú (admin) - GALETA INFORMATIVA
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalPlatos = await MenuItem.countDocuments();
    const disponibles = await MenuItem.countDocuments({ disponible: true });
    
    // Platos por categoría
    const porCategoria = await MenuItem.aggregate([
      { $group: {
        _id: '$categoria',
        count: { $sum: 1 },
        disponibles: { $sum: { $cond: ['$disponible', 1, 0] } }
      }}
    ]);
    
    // Platos con información nutricional completa
    const conNutricion = await MenuItem.countDocuments({ 'nutricion.calorias': { $exists: true, $ne: null } });
    
    // Platos con historia/ingredientes culturales
    const conHistoria = await MenuItem.countDocuments({ 
      $or: [
        { historiaIngredientes: { $exists: true, $ne: '' } },
        { ingredientePrincipal: { $exists: true, $ne: '' } }
      ]
    });
    
    // Alertas de alergias más comunes
    const alergiasComunes = await MenuItem.aggregate([
      { $unwind: '$contiene' },
      { $group: { _id: '$contiene', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    // Dietas especiales
    const veganos = await MenuItem.countDocuments({ esVegano: true });
    const vegetarianos = await MenuItem.countDocuments({ esVegetariano: true });
    
    res.json({
      totalPlatos,
      disponibles,
      porCategoria,
      conNutricion,
      conHistoria,
      alergiasComunes,
      dietas: {
        veganos,
        vegetarianos
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// Obtener un plato específico
router.get('/:id', async (req, res) => {
  try {
    const plato = await MenuItem.findById(req.params.id);
    if (!plato) {
      return res.status(404).json({ error: 'Plato no encontrado' });
    }
    res.json(plato);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
