// ResumenPedido.jsx
import React from 'react';

const ResumenPedido = ({ 
  carrito, 
  subtotal, 
  iva, 
  envio, 
  total, 
  tipoEntrega, 
  setTipoEntrega, 
  alConfirmar, 
  alVolver,
  modificarCantidad,
  eliminarDelCarrito 
}) => {
  
  console.log('ResumenPedido - props recibidas:', { 
    carrito, subtotal, iva, envio, total, tipoEntrega 
  });

  if (!carrito || carrito.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'white' }}>
        <h2>Tu carrito está vacío</h2>
        <button onClick={alVolver}>Volver al Menú</button>
      </div>
    );
  }

  const handleConfirmar = () => {
    console.log('🟢 Botón CONFIRMAR clickeado - llamando a alConfirmar');
    if (alConfirmar) {
      alConfirmar();
    } else {
      console.error('❌ alConfirmar es undefined');
    }
  };

  return (
    <div className="resumen-contenedor" style={{ 
      padding: '30px', 
      maxWidth: '430px', 
      margin: 'auto', 
      background: 'white', 
      borderRadius: '20px', 
      color: '#333',
      overflowY: 'auto',
      maxHeight: '80vh'
    }}>
      <h2 style={{ textAlign: 'center', color: '#8B0000', fontFamily: "'Cormorant Garamond', serif" }}>
        Revisa tu pedido 🥘
      </h2>
      
      {/* Lista de productos con controles de cantidad */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {carrito.map((item, index) => (
          <li key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            padding: '10px 0', 
            borderBottom: '1px solid #eee' 
          }}>
            <div style={{ flex: 2 }}>
              <span>{item.nombre}</span>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                ${item.precio} c/u
              </div>
            </div>
            
            {/* Controles de cantidad */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button 
                onClick={() => modificarCantidad(item.id, -1)}
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  border: '1px solid #8B0000',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                -
              </button>
              <span>{item.cantidad || 1}</span>
              <button 
                onClick={() => modificarCantidad(item.id, 1)}
                style={{ 
                  width: '30px', 
                  height: '30px', 
                  borderRadius: '50%', 
                  border: '1px solid #8B0000',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                +
              </button>
              <button 
                onClick={() => eliminarDelCarrito(item.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#999',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  marginLeft: '5px'
                }}
              >
                🗑️
              </button>
            </div>
            <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>
              ${((item.precio) * (item.cantidad || 1)).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      {/* SELECTOR DE ENTREGA */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button 
          onClick={() => setTipoEntrega('domicilio')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '10px', 
            border: 'none', 
            background: tipoEntrega === 'domicilio' ? '#8B0000' : '#eee', 
            color: tipoEntrega === 'domicilio' ? 'white' : '#333', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          🛵 Domicilio ($2)
        </button>
        <button 
          onClick={() => setTipoEntrega('local')}
          style={{ 
            flex: 1, 
            padding: '10px', 
            borderRadius: '10px', 
            border: 'none', 
            background: tipoEntrega === 'local' ? '#8B0000' : '#eee', 
            color: tipoEntrega === 'local' ? 'white' : '#333', 
            cursor: 'pointer', 
            fontWeight: 'bold' 
          }}
        >
          🥡 Local ($0)
        </button>
      </div>

      {/* DESGLOSE DE PRECIOS */}
      <div style={{ 
        background: '#fdf2e9', 
        padding: '20px', 
        borderRadius: '15px', 
        marginTop: '20px', 
        border: '1px solid #eee' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>Subtotal:</span>
          <span style={{ fontWeight: 'bold' }}>${subtotal}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <span>IVA (15%):</span>
          <span style={{ fontWeight: 'bold' }}>${iva}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '10px', 
          color: tipoEntrega === 'domicilio' ? '#e67e22' : '#999' 
        }}>
          <span>Envío:</span>
          <span style={{ fontWeight: 'bold' }}>${envio}</span>
        </div>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: '15px', 
          paddingTop: '15px', 
          borderTop: '2px solid #8B0000', 
          fontSize: '1.4rem', 
          color: '#8B0000', 
          fontWeight: 'bold' 
        }}>
          <span>TOTAL:</span>
          <span>${total}</span>
        </div>
      </div>

      {/* BOTÓN PRINCIPAL - CORREGIDO */}
      <button 
        onClick={handleConfirmar}
        style={{ 
          width: '100%', 
          padding: '15px', 
          background: '#e67e22', 
          color: 'white', 
          border: 'none', 
          borderRadius: '12px', 
          fontWeight: 'bold', 
          fontSize: '1.1rem', 
          cursor: 'pointer', 
          marginTop: '20px' 
        }}
      >
        Ir al Formulario de Pago 💳
      </button>

      {/* BOTÓN SECUNDARIO */}
      <button 
        onClick={alVolver} 
        style={{ 
          width: '100%', 
          marginTop: '10px', 
          background: 'none', 
          border: 'none', 
          color: '#666', 
          cursor: 'pointer' 
        }}
      >
        ← Volver al Menú
      </button>
    </div>
  );
};

export default ResumenPedido;