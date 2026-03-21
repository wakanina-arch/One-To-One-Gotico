import express from 'express';

const router = express.Router();

// Versión de prueba sin MongoDB
router.get('/', async (req, res) => {
  try {
    // Datos de prueba
    const menuPrueba = [
      { _id: "1", nombre: "Ensalada Alemana", precio: 9.50, categoria: "entrada", disponible: true, descripcion: "Patatas, mayonesa, lechuga, jalapeños, maíz" },
      { _id: "2", nombre: "Pizza Margherita", precio: 11.00, categoria: "plato_fuerte", disponible: true, descripcion: "Tomate, mozzarella, albahaca" }
    ];
    res.json(menuPrueba);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  res.json({ mensaje: "Actualizado", id: req.params.id });
});

export default router;
