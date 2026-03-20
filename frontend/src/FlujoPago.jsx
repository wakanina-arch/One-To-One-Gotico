import React, { useState } from 'react';
import { useCart } from './CartContext.jsx';
import ResumenPedido from './ResumenPedido';
import SeccionPago from './components/SeccionPago';

export default function FlujoPago({ onVolverAlMenu, onFinalizarCompra }) {
  // 1. Extraemos las herramientas del carrito
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    calculateTotal 
  } = useCart();

  // 2. Estados locales para el flujo interno
  const [paso, setPaso] = useState('resumen'); // 'resumen' o 'pago'
  const [tipoEntrega, setTipoEntrega] = useState('local'); 

  // Cálculos de dinero
  const subtotal = calculateTotal();
  const iva = subtotal * 0.15;
  const costoEnvio = tipoEntrega === 'domicilio' ? 2.00 : 0.00;
  const totalFinal = subtotal + iva + costoEnvio;

  // 3. Pantalla de Vasija Vacía (Estética "Desde el Barro")
  if (!cartItems || cartItems.length === 0) {
    return (
      <div style={styles.contenedorVacio}>
        <div style={{ fontSize: "4rem", marginBottom: '20px' }}>🏺</div>
        <h2 style={{ fontFamily: "serif", color: "#FFD700" }}>Tu vasija está vacía</h2>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>El fuego espera por tu elección...</p>
        <button onClick={onVolverAlMenu} style={styles.btnPrimario}>VOLVER AL MENÚ</button>
      </div>
    );
  }

  return (
    <div style={styles.mainWrapper}>
      
      {/* PASO 1: REVISIÓN DEL PEDIDO */}
      {paso === 'resumen' && (
        <ResumenPedido 
          carrito={cartItems} 
          subtotal={subtotal.toFixed(2)} 
          iva={iva.toFixed(2)} 
          envio={costoEnvio.toFixed(2)} 
          total={totalFinal.toFixed(2)}
          tipoEntrega={tipoEntrega}
          setTipoEntrega={setTipoEntrega}
          // Esta función cambia al paso de Pago
          alConfirmar={() => setPaso('pago')} 
          alVolver={onVolverAlMenu}
          modificarCantidad={updateQuantity}
          eliminarDelCarrito={removeFromCart}
        />
      )}

      {/* PASO 2: FORMULARIO DE PAGO Y TARJETA */}
      {paso === 'pago' && (
        <SeccionPago 
          total={totalFinal}
          carrito={cartItems}
          alVolver={() => setPaso('resumen')}
          // Esta función conecta con el motor de App.jsx para generar el Ticket
          alConfirmar={(datosPago) => {
            if (onFinalizarCompra) {
              onFinalizarCompra(datosPago.metodo);
            }
          }}
        />
      )}

    </div>
  );
}

const styles = {
  mainWrapper: {
    width: '100%',
    height: '100%',
    background: 'transparent', 
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  contenedorVacio: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '20px',
    background: '#1a0a0a'
  },
  btnPrimario: {
    marginTop: '20px',
    padding: '15px 30px',
    background: 'linear-gradient(135deg, #FF4500, #B22222)',
    color: 'white',
    border: 'none',
    borderRadius: '15px',
    fontWeight: '900',
    cursor: 'pointer'
  }
};
