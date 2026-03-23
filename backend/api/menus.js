// Datos de prueba con los platos principales
const menuCompleto = [
  { _id: "1", nombre: "Alitas BBQ", precio: 8.50, categoria: "entrada", disponible: true, imagen: "/img/primero/Alitas1.png", descripcion: "Alitas glaseadas con salsa BBQ" },
  { _id: "2", nombre: "Bistec Combinado", precio: 12.50, categoria: "plato_fuerte", disponible: true, imagen: "/img/primero/Bistec convinado.png", descripcion: "Bistec con papas y ensalada" },
  { _id: "3", nombre: "Ensalada Alemana", precio: 9.50, categoria: "entrada", disponible: true, imagen: "/img/segundo/Ensalada Alemana de Patata.jpg", descripcion: "Patatas, mayonesa, lechuga, jalapeños, maíz" },
  { _id: "4", nombre: "Pizza Margherita", precio: 11.00, categoria: "plato_fuerte", disponible: true, imagen: "/img/otras/Margherita.jpg", descripcion: "Tomate, mozzarella, albahaca" },
  { _id: "5", nombre: "Coca Cola", precio: 2.50, categoria: "bebida", disponible: true, imagen: "/img/postres/CocaCola.jpg", descripcion: "Refresco de cola" }
];

export default function handler(req, res) {
  // GET: devolver menú
  if (req.method === 'GET') {
    res.status(200).json(menuCompleto);
  }
  // PUT: actualizar plato
  else if (req.method === 'PUT') {
    const { id } = req.query;
    const platoActualizado = { ...req.body, _id: id };
    res.status(200).json(platoActualizado);
  }
  else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}
