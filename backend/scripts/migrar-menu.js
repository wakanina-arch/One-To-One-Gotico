import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../src/models/MenuItem.js';
dotenv.config();

const platos = [
  // PRIMEROS - ENTRADAS
  { nombre: 'Alitas BBQ 1', precio: 8.50, imagen: '/img/primero/Alitas1.png', categoria: 'entrada', disponible: true },
  { nombre: 'Alitas BBQ 2', precio: 9.00, imagen: '/img/primero/Alitas2.png', categoria: 'entrada', disponible: true },
  { nombre: 'Bistec Combinado', precio: 12.50, imagen: '/img/primero/Bistec convinado.png', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Bowl Patatas Fritas', precio: 5.50, imagen: '/img/primero/Bowl Patatas fritas.png', categoria: 'acompañamiento', disponible: true },
  { nombre: 'Combos Especiales', precio: 15.00, imagen: '/img/primero/Combos.png', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Nachos con Queso', precio: 7.50, imagen: '/img/primero/Nachos con queso.png', categoria: 'entrada', disponible: true },
  { nombre: 'Palomitas de Maíz', precio: 3.50, imagen: '/img/primero/Palomitas de maíz.png', categoria: 'entrada', disponible: true },
  { nombre: 'Pincho de Verduras', precio: 6.50, imagen: '/img/primero/Pincho de verduras.png', categoria: 'entrada', disponible: true },
  { nombre: 'Pinchos Morunos', precio: 9.50, imagen: '/img/primero/Pinchos morunos.png', categoria: 'entrada', disponible: true },
  { nombre: 'Pollo Broster', precio: 11.00, imagen: '/img/primero/Pollo broster.png', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Tabla Flamenca', precio: 18.00, imagen: '/img/primero/Tabla flamenca.png', categoria: 'plato_fuerte', disponible: true },
  
  // SEGUNDOS - ENSALADAS (usando 'entrada' porque es el más cercano)
  { nombre: 'Ensalada Alemana', precio: 9.50, imagen: '/img/segundo/Ensalada Alemana de Patata.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Caprese', precio: 10.00, imagen: '/img/segundo/Ensalada Caprese.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada César', precio: 11.50, imagen: '/img/segundo/Ensalada César.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Coleslaw', precio: 8.00, imagen: '/img/segundo/Ensalada Coleslaw.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Griega', precio: 10.50, imagen: '/img/segundo/Ensalada Griega.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Mimosa', precio: 9.00, imagen: '/img/segundo/Ensalada Mimosa.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Nizarda', precio: 11.00, imagen: '/img/segundo/Ensalada Nizarda.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Tabulé', precio: 8.50, imagen: '/img/segundo/Ensalada Tabulé.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensalada Waldorf', precio: 10.50, imagen: '/img/segundo/Ensalada Waldorf.jpg', categoria: 'entrada', disponible: true },
  { nombre: 'Ensaladilla Rusa', precio: 9.00, imagen: '/img/segundo/Ensaladilla Rusa.jpg', categoria: 'entrada', disponible: true },
  
  // POSTRES - BEBIDAS
  { nombre: 'Agua Mineral', precio: 1.50, imagen: '/img/postres/AguaMineral.jpg', categoria: 'bebida', disponible: true },
  { nombre: 'Cerveza Club', precio: 3.50, imagen: '/img/postres/CervezaClub.jpg', categoria: 'bebida', disponible: true },
  { nombre: 'Coca Cola', precio: 2.50, imagen: '/img/postres/CocaCola.jpg', categoria: 'bebida', disponible: true },
  { nombre: 'Zumo de Frutas', precio: 3.00, imagen: '/img/postres/ZumoDeFrutas.jpg', categoria: 'bebida', disponible: true },
  { nombre: 'Fanta Naranja', precio: 2.50, imagen: '/img/postres/FantaNaranja.jpg', categoria: 'bebida', disponible: true },
  
  // OTRAS - PIZZAS
  { nombre: 'Pizza Carbonara', precio: 13.50, imagen: '/img/otras/Carbonara.jpg', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Pizza Margherita', precio: 11.00, imagen: '/img/otras/Margherita.jpg', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Pizza Pepperoni', precio: 13.50, imagen: '/img/otras/Pepperoni.jpg', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Pizza Vegetariana', precio: 12.00, imagen: '/img/otras/Vegetariana.jpg', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Pizza Hawaiana', precio: 13.00, imagen: '/img/otras/Hawaiana.jpg', categoria: 'plato_fuerte', disponible: true },
  { nombre: 'Pizza Cuatro Quesos', precio: 14.00, imagen: '/img/otras/CuatroQuesos.jpg', categoria: 'plato_fuerte', disponible: true }
];

async function migrar() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    await MenuItem.deleteMany({});
    console.log('🗑️  Datos anteriores eliminados');
    
    for (const plato of platos) {
      await MenuItem.create(plato);
      console.log(`   ✅ ${plato.nombre} (${plato.categoria})`);
    }
    
    console.log(`\n🎉 Migración completada: ${platos.length} platos insertados`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

migrar();
