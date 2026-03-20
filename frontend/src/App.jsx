import React, { useState } from "react";
import { CartProvider, useCart } from "./CartContext.jsx";
import WelcomeInicio from "./WelcomeInicio"; 
import CategoriaScreen2 from "./components/CategoriaScreen2";
import ResumenPedido from "./ResumenPedido"; 
import SeccionPago from "./components/SeccionPago";
import TicketConfirmacion from "./components/TicketConfirmacion";
import BarraSuperior from "./layout/BarraSuperior";
import PerfilDesplegable from "./layout/PerfilDesplegable";
import MenuDesplegable from "./layout/MenuDesplegable";
import RegisterModal from "./components/RegisterModal";
import './index.css';

// BASE DE DATOS COMPLETA (la misma que tienes)
const database = {
  primero: { 
    titulo: 'COMPLEMENTOS', icono: '🍟',
    platos: [
      { id: 101, nombre: 'Alitas BBQ 1', precio: 8.50, imagen: '/img/primero/Alitas1.png', kcal: 450, prot: 25, carb: 5 },
      { id: 102, nombre: 'Alitas BBQ 2', precio: 9.00, imagen: '/img/primero/Alitas2.png', kcal: 480, prot: 27, carb: 5 },
      { id: 103, nombre: 'Bistec Combinado', precio: 12.50, imagen: '/img/primero/Bistec convinado.png', kcal: 650, prot: 40, carb: 10 },
      { id: 104, nombre: 'Bowl Patatas Fritas', precio: 5.50, imagen: '/img/primero/Bowl Patatas fritas.png', kcal: 400, prot: 4, carb: 55 },
      { id: 105, nombre: 'Combos Especiales', precio: 15.00, imagen: '/img/primero/Combos.png', kcal: 800, prot: 35, carb: 60 },
      { id: 106, nombre: 'Nachos con Queso', precio: 7.50, imagen: '/img/primero/Nachos con queso.png', kcal: 500, prot: 10, carb: 45 },
      { id: 107, nombre: 'Palomitas de Maíz', precio: 3.50, imagen: '/img/primero/Palomitas de maíz.png', kcal: 250, prot: 3, carb: 30 },
      { id: 108, nombre: 'Pincho de Verduras', precio: 6.50, imagen: '/img/primero/Pincho de verduras.png', kcal: 180, prot: 5, carb: 12 },
      { id: 109, nombre: 'Pinchos Morunos', precio: 9.50, imagen: '/img/primero/Pinchos morunos.png', kcal: 420, prot: 35, carb: 2 },
      { id: 110, nombre: 'Pollo Broster', precio: 11.00, imagen: '/img/primero/Pollo broster.png', kcal: 600, prot: 30, carb: 20 },
      { id: 111, nombre: 'Tabla Flamenca', precio: 18.00, imagen: '/img/primero/Tabla flamenca.png', kcal: 750, prot: 45, carb: 10 }
    ]
  },
  segundo: { 
    titulo: 'ENSALADAS', icono: '🥗',
    platos: [
      { id: 201, nombre: 'Ensalada Alemana', precio: 9.50, imagen: '/img/segundo/Ensalada Alemana de Patata.jpg', kcal: 350, prot: 6, carb: 40 },
      { id: 202, nombre: 'Ensalada Caprese', precio: 10.00, imagen: '/img/segundo/Ensalada Caprese.jpg', kcal: 280, prot: 12, carb: 5 },
      { id: 203, nombre: 'Ensalada César', precio: 11.50, imagen: '/img/segundo/Ensalada César.jpg', kcal: 520, prot: 25, carb: 15 },
      { id: 204, nombre: 'Ensalada Coleslaw', precio: 8.00, imagen: '/img/segundo/Ensalada Coleslaw.jpg', kcal: 220, prot: 2, carb: 18 },
      { id: 205, nombre: 'Ensalada Griega', precio: 10.50, imagen: '/img/segundo/Ensalada Griega.jpg', kcal: 310, prot: 8, carb: 10 },
      { id: 206, nombre: 'Ensalada Mimosa', precio: 9.00, imagen: '/img/segundo/Ensalada Mimosa.jpg', kcal: 340, prot: 15, carb: 8 },
      { id: 207, nombre: 'Ensalada Nizarda', precio: 11.00, imagen: '/img/segundo/Ensalada Nizarda.jpg', kcal: 400, prot: 20, carb: 12 },
      { id: 208, nombre: 'Ensalada Tabulé', precio: 8.50, imagen: '/img/segundo/Ensalada Tabulé.jpg', kcal: 260, prot: 6, carb: 35 },
      { id: 209, nombre: 'Ensalada Waldorf', precio: 10.50, imagen: '/img/segundo/Ensalada Waldorf.jpg', kcal: 380, prot: 5, carb: 25 },
      { id: 210, nombre: 'Ensaladilla Rusa', precio: 9.00, imagen: '/img/segundo/Ensaladilla Rusa.jpg', kcal: 450, prot: 8, carb: 30 }
    ]
  },
  postres: { 
    titulo: 'BEBIDAS', icono: '🥤',
    platos: [
      { id: 301, nombre: 'Agua Mineral', precio: 1.50, imagen: '/img/postres/AguaMineral.jpg', kcal: 0, prot: 0, carb: 0 },
      { id: 302, nombre: 'Cerveza Club', precio: 3.50, imagen: '/img/postres/CervezaClub.jpg', kcal: 150, prot: 1, carb: 12 },
      { id: 305, nombre: 'Coca Cola', precio: 2.50, imagen: '/img/postres/CocaCola.jpg', kcal: 140, prot: 0, carb: 35 },
      { id: 309, nombre: 'Zumo de Frutas', precio: 3.00, imagen: '/img/postres/ZumoDeFrutas.jpg', kcal: 110, prot: 1, carb: 25 },
      { id: 306, nombre: 'Fanta Naranja', precio: 2.50, imagen: '/img/postres/FantaNaranja.jpg', kcal: 160, prot: 0, carb: 40 }
    ]
  },
  otras: { 
    titulo: 'PIZZAS AL HORNO', icono: '🍕',
    platos: [
      { id: 401, nombre: 'Pizza Carbonara', precio: 13.50, imagen: '/img/otras/Carbonara.jpg', kcal: 900, prot: 35, carb: 80 },
      { id: 405, nombre: 'Pizza Margherita', precio: 11.00, imagen: '/img/otras/Margherita.jpg', kcal: 700, prot: 22, carb: 80 },
      { id: 408, nombre: 'Pizza Pepperoni', precio: 13.50, imagen: '/img/otras/Pepperoni.jpg', kcal: 950, prot: 32, carb: 85 },
      { id: 410, nombre: 'Pizza Vegetariana', precio: 12.00, imagen: '/img/otras/Vegetariana.jpg', kcal: 750, prot: 28, carb: 80 },
      { id: 411, nombre: 'Pizza Hawaiana', precio: 13.00, imagen: '/img/otras/Hawaiana.jpg', kcal: 850, prot: 30, carb: 80 },
      { id: 412, nombre: 'Pizza Cuatro Quesos', precio: 14.00, imagen: '/img/otras/CuatroQuesos.jpg', kcal: 1000, prot: 40, carb: 90 }
    ] 
  }
};

function AppContent() {
  // Extraemos TODAS las funciones del carrito
  const { cartItems, addToCart, updateQuantity, removeFromCart, clearCart, calculateTotal } = useCart();
  
  console.log('🏠 AppContent - cartItems:', cartItems);
  console.log('🏠 AppContent - total:', calculateTotal());
  
  const [pantalla, setPantalla] = useState('welcome');
  const [categoriaActual, setCategoriaActual] = useState(null);
  const [fraseOraculo, setFraseOraculo] = useState(""); 
  const [datosFinales, setDatosFinales] = useState({ total: 0, metodo: '', ordenId: '' });
  const [tipoEntrega, setTipoEntrega] = useState('local');

  // Estados para menús desplegables
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  
  // Estados para el modal de registro/edición
  const [modalRegisterAbierto, setModalRegisterAbierto] = useState(false);
  const [modoRegistro, setModoRegistro] = useState('registro');

  const [usuario, setUsuario] = useState(() => {
    const savedUser = localStorage.getItem('oneToOneUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const totalNeto = calculateTotal();

  // Funciones para menús (UNA SOLA VEZ CADA UNA)
  const togglePerfil = () => {
    console.log('👤 togglePerfil - actual:', perfilAbierto);
    setPerfilAbierto(!perfilAbierto);
  };
  
  const cerrarPerfil = () => {
    console.log('👤 cerrarPerfil');
    setPerfilAbierto(false);
  };
  
  const toggleMenu = () => {
    console.log('📋 toggleMenu - actual:', menuAbierto);
    setMenuAbierto(!menuAbierto);
  };
  
  const cerrarMenu = () => {
    console.log('📋 cerrarMenu');
    setMenuAbierto(false);
  };

  // Funciones para modal de registro/edición
  const abrirRegistro = () => {
    console.log('📝 Abriendo registro');
    setModoRegistro('registro');
    setModalRegisterAbierto(true);
  };

  const abrirEditarPerfil = () => {
    console.log('🔧 Abriendo edición de perfil');
    setModoRegistro('editar');
    setModalRegisterAbierto(true);
    setPerfilAbierto(false);
  };

  const cerrarModal = () => {
    console.log('❌ Cerrando modal');
    setModalRegisterAbierto(false);
  };

  const manejarRegistro = (usuarioActualizado) => {
    console.log('📝 Usuario actualizado:', usuarioActualizado);
    localStorage.setItem('oneToOneUser', JSON.stringify(usuarioActualizado));
    setUsuario(usuarioActualizado);
    setModalRegisterAbierto(false);
  };

  const irACategoria = (id, fraseRecibida) => {
    console.log('➡️ App - frase recibida:', fraseRecibida);
    if (fraseRecibida) setFraseOraculo(fraseRecibida); 
    setCategoriaActual(id); 
    setPantalla('categoria');
    cerrarMenu();
  };

  const finalizarCompra = (datosPago) => {
    console.log('💳 finalizarCompra - datos:', datosPago);
    console.log('💳 App - frase antes de ticket:', fraseOraculo);
    
    const metodoPago = typeof datosPago === 'string' ? datosPago : datosPago.metodo;
    const datosContacto = typeof datosPago === 'object' ? datosPago.datosContacto : {};
    
    const idGenerado = `QR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    setDatosFinales({ 
      total: totalNeto, 
      metodo: metodoPago, 
      ordenId: idGenerado,
      datosContacto: datosContacto,
      frase: fraseOraculo
    });
    
    setPantalla('ticket');
  };

  return (
    <div className="App" style={{ 
      width: '100vw', height: '100dvh', background: '#000', 
      display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' 
    }}>
      <div style={{
        width: '88%', maxWidth: '480px', height: '88vh', background: '#1a0a0a', 
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        borderRadius: '35px', border: '1px solid rgba(255,215,0,0.15)', boxShadow: '0 0 40px rgba(0,0,0,0.9)'
      }}>
        
        {/* BARRA SUPERIOR - SOLO EN PANTALLAS QUE NO SEAN WELCOME */}
        {pantalla !== 'welcome' && (
          <div style={{ position: 'relative', zIndex: 10 }}>
            <BarraSuperior 
              usuario={usuario} 
              onMenuClick={toggleMenu}
              onCarritoClick={() => setPantalla('resumen')}
              onPerfilClick={togglePerfil}
              carritoCount={cartItems.length} 
            />
          </div>
        )}

        {/* MENÚ DESPLEGABLE */}
<MenuDesplegable 
  abierto={menuAbierto}
  onClose={cerrarMenu}
  onSelectCategoria={(id) => {
    if (id === 'welcome') {
      setPantalla('welcome'); // 🌀 Vuelve al Origen
    } else {
      irACategoria(id, fraseOraculo); // 🍖 Va a la comida
    }
  }}
/>


        {/* PERFIL DESPLEGABLE */}
        <PerfilDesplegable 
          abierto={perfilAbierto}
          onClose={cerrarPerfil}
          usuario={usuario}
          onEditar={abrirEditarPerfil}
          onLogout={() => {
            cerrarPerfil();
            localStorage.removeItem('oneToOneUser');
            setUsuario(null);
          }}
        />

        {/* CONTENIDO PRINCIPAL */}
        <div style={{ flex: 1, overflow: 'auto', position: 'relative', zIndex: 1 }}>
          
          {pantalla === 'welcome' && (
            <WelcomeInicio 
              usuario={usuario} 
              onSelectCategory={irACategoria}
              onAbrirRegistro={abrirRegistro}
            />
          )}

          {pantalla === 'categoria' && categoriaActual && (
            <CategoriaScreen2
              usuario={usuario}
              categoria={database[categoriaActual]}
              onBack={() => {
                console.log('⬅️ onBack');
                setPantalla('welcome');
              }}
              onVerCarrito={() => {
                console.log('🛒 onVerCarrito - items:', cartItems.length);
                setPantalla('resumen');
              }}
              onAddToCart={(item) => {
                console.log('➕ onAddToCart desde CategoriaScreen2:', item);
                addToCart(item);
              }}
              carritoCount={cartItems.length}
            />
          )}

          {pantalla === 'resumen' && (
            <ResumenPedido 
              carrito={cartItems}
              subtotal={calculateTotal().toFixed(2)}
              iva={(calculateTotal() * 0.15).toFixed(2)}
              envio={tipoEntrega === 'domicilio' ? '2.00' : '0.00'}
              total={(calculateTotal() * 1.15 + (tipoEntrega === 'domicilio' ? 2 : 0)).toFixed(2)}
              tipoEntrega={tipoEntrega}
              setTipoEntrega={setTipoEntrega}
              alConfirmar={() => {
                console.log('✅ alConfirmar desde Resumen - yendo a pago');
                setPantalla('pago');
              }}
              alVolver={() => {
                console.log('⬅️ alVolver desde Resumen');
                setPantalla('categoria');
              }}
              modificarCantidad={(id, delta) => {
                console.log('🔄 modificarCantidad:', id, delta);
                updateQuantity(id, delta);
              }}
              eliminarDelCarrito={(id) => {
                console.log('🗑️ eliminarDelCarrito:', id);
                removeFromCart(id);
              }}
            />
          )}

          {pantalla === 'pago' && (
            <SeccionPago
              total={totalNeto}
              carrito={cartItems}
              alVolver={() => {
                console.log('⬅️ alVolver desde Pago');
                setPantalla('resumen');
              }}
              alConfirmar={(metodo) => {
                console.log('💳 alConfirmar desde Pago:', metodo);
                finalizarCompra(metodo);
              }}
            />
          )}

          {pantalla === 'ticket' && (
            <TicketConfirmacion 
              datos={datosFinales}
              pedido={cartItems}
              onCerrar={() => { 
                console.log('🏁 onCerrar - limpiando todo');
                clearCart(); 
                setPantalla('welcome'); 
              }}
            />
          )}
        </div>

        {/* MODAL ÚNICO DE REGISTRO/EDICIÓN */}
        <RegisterModal 
          open={modalRegisterAbierto}
          onClose={cerrarModal}
          onRegister={manejarRegistro}
          modo={modoRegistro}
          usuarioActual={usuario}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}