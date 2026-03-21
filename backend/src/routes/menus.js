import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const menu = await MenuItem.find().sort({ categoria: 1 });
    res.json(menu);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const plato = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!plato) return res.status(404).json({ error: 'No encontrado' });
    res.json(plato);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
