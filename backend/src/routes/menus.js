import express from 'express';

const router = express.Router();

// Datos de prueba con los 32 platos de tu app
const menuCompleto = [
  { _id: "1", nombre: "Alitas BBQ 1", precio: 8.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Alitas1.png", descripcion: "Alitas glaseadas con salsa BBQ" },
  { _id: "2", nombre: "Alitas BBQ 2", precio: 9.00, categoria: "entrada", disponible: true, imagen: "/img/primero/Alitas2.png", descripcion: "Alitas con salsa BBQ picante" },
  { _id: "3", nombre: "Bistec Combinado", precio: 12.50, categoria: "plato_fuerte", disponible: true, imagen: "/img/primero/Bistec convinado.png", descripcion: "Bistec con papas y ensalada" },
  { _id: "4", nombre: "Bowl Patatas Fritas", precio: 5.50, categoria: "acompañamiento", disponible: true, imagen: "/img/primero/Bowl Patatas fritas.png", descripcion: "Papas fritas crujientes" },
  { _id: "5", nombre: "Combos Especiales", precio: 15.00, categoria: "plato_fuerte", disponible: true, imagen: "/img/primero/Combos.png", descripcion: "Combinación especial de carnes" },
  { _id: "6", nombre: "Nachos con Queso", precio: 7.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Nachos con queso.png", descripcion: "Nachos con queso fundido" },
  { _id: "7", nombre: "Palomitas de Maíz", precio: 3.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Palomitas de maíz.png", descripcion: "Palomitas de maíz" },
  { _id: "8", nombre: "Pincho de Verduras", precio: 6.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Pincho de verduras.png", descripcion: "Pincho de verduras asadas" },
  { _id: "9", nombre: "Pinchos Morunos", precio: 9.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Pinchos morunos.png", descripcion: "Pinchos de cerdo adobado" },
  { _id: "10", nombre: "Pollo Broster", precio: 11.00, categoria: "plato_fuerte", disponible: true, imagen: "/img/primero/Pollo broster.png", descripcion: "Pollo frito crujiente" },
  { _id: "11", nombre: "Tabla Flamenca", precio: 18.00, categoria: "plato_fuerte", disponible: true, imagen: "/img/primero/Tabla flamenca.png", descripcion: "Tabla de embutidos ibéricos" },
  { _id: "12", nombre: "Ensalada Alemana", precio: 9.50, categoria: "entrada", disponible: true, imagen: "/img/segundo/Ensalada Alemana de Patata.jpg", descripcion: "Patatas, mayonesa, lechuga, jalapeños, maíz, aceite de oliva, vinagre, sal, perejil" },
  { _id: "13", nombre: "Ensalada Caprese", precio: 10.00, categoria: "entrada", disponible: true, imagen: "/img/segundo/Ensalada Caprese.jpg", descripcion: "Tomate, mozzarella, albahaca, aceite de oliva" },
  { _id: "14", nombre: "Ensalada César", precio: 11.50, categoria: "entrada", disponible: true, imagen: "/img/segundo/Ensalada César.jpg", descripcion: "Lechuga, pollo, crutones, queso parmesano, salsa César" },
  { _id: "15", nombre: "Agua Mineral", precio: 1.50, categoria: "bebida", disponible: true, imagen: "/img/postres/AguaMineral.jpg", descripcion: "Agua mineral" },
  { _id: "16", nombre: "Cerveza Club", precio: 3.50, categoria: "bebida", disponible: true, imagen: "/img/postres/CervezaClub.jpg", descripcion: "Cerveza rubia" },
  { _id: "17", nombre: "Coca Cola", precio: 2.50, categoria: "bebida", disponible: true, imagen: "/img/postres/CocaCola.jpg", descripcion: "Refresco de cola" },
  { _id: "18", nombre: "Pizza Carbonara", precio: 13.50, categoria: "plato_fuerte", disponible: true, imagen: "/img/otras/Carbonara.jpg", descripcion: "Salsa carbonara, queso, huevo, bacon" },
  { _id: "19", nombre: "Pizza Margherita", precio: 11.00, categoria: "plato_fuerte", disponible: true, imagen: "/img/otras/Margherita.jpg", descripcion: "Tomate, mozzarella, albahaca" }
];

router.get('/', async (req, res) => {
  try {
    res.json(menuCompleto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    // Simular actualización
    const platoActualizado = { ...req.body, _id: req.params.id };
    res.json(platoActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
