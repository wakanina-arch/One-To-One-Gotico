import React, { useState } from 'react';
import { useCart } from './CartContext';

export default function PaymentModal({ open, onClose, total, addLog, setPendingOrders }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    metodo: 'tarjeta',
  });
  const [qr, setQr] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const { cartItems, clearCart, addOrder } = useCart();

  if (!open) return null;

  // 🎯 GENERAR QR PARA EL PEDIDO
  const generateOrderQR = (orderId) => {
    // URL que lleva al detalle del pedido
    const baseUrl = window.location.origin;
    const orderUrl = `${baseUrl}/order/${orderId}`;
    
    // QR con la URL del pedido
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(orderUrl)}&size=200x200`;
  };

  // 🎯 GENERAR QR PROMOCIONAL (para marketing)
  const generatePromoQR = (promoCode) => {
    const baseUrl = window.location.origin;
    const promoUrl = `${baseUrl}/?promo=${promoCode}`;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(promoUrl)}&size=200x200`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    
    setTimeout(() => {
      const generatedId = `ORD-${Math.floor(Math.random() * 900) + 100}`;
      
      // 📝 LOG
      if (addLog) {
        addLog({
          tipo: 'Entrada', 
          pedido: generatedId,
          usuario: form.nombre,
          hora: new Date().toLocaleTimeString(),
          detalle: `Pago aprobado - Total: $${total}`
        });
      }

      setOrderId(generatedId);
      
      // 🎫 GENERAR QR DEL PEDIDO
      setQr(generateOrderQR(generatedId));
      
      const newOrder = {
        id: generatedId,
        cliente: form.nombre,
        mesa: Math.floor(Math.random()*10)+1,
        estado: 'nuevo',
        hora: new Date().toLocaleTimeString(),
        items: cartItems.map(i => ({ nombre: i.nombre, cantidad: i.cantidad, precio: i.precio })),
        total: parseFloat(total),
        qrCode: generateOrderQR(generatedId) // Guardar QR en la orden
      };

      addOrder(newOrder); 
      if (setPendingOrders) {
        setPendingOrders(prev => [...prev, newOrder]);
      }

      setStep(2);
    }, 1200);
  };

  return (
    <div className="drawer-backdrop">
      <div className="drawer" style={{maxWidth: 420}}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {step === 1 && (
          <>
            <h2>Pago</h2>
            <form onSubmit={handleSubmit}>
              <label>Nombre Completo
                <input name="nombre" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} required />
              </label>
              <label>Email
                <input name="email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </label>
              <label>Método
                <select value={form.metodo} onChange={e => setForm({...form, metodo: e.target.value})}>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="bimo">BIMO</option>
                </select>
              </label>
              <div className="payment-total">Total: <b>${total}</b></div>
              <button className="save-btn" type="submit">Pagar</button>
            </form>
          </>
        )}

        {step === 2 && (
          <div style={{ padding: '0.5rem 0' }}>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
              <button onClick={() => window.print()} style={printButtonStyle}>
                🖨️ Imprimir
              </button>
            </div>

            <div style={summaryStyle}>
              <h3>Resumen</h3>
              {cartItems.map((item, i) => (
                <div key={i} style={itemStyle}>
                  {item.cantidad} x {item.nombre} <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
              <div style={totalStyle}>Total: ${total}</div>
            </div>

            <div style={qrSectionStyle}>
              <img src="/img/The-One.png" alt="Logo" style={logoStyle} />
              <h2>¡Gracias por elegirnos!</h2>
              
              {/* 🎫 QR DEL PEDIDO */}
              <img src={qr} alt="QR Pedido" style={qrStyle} />
              
              <div>
                <span>N° de pedido:</span>
                <div style={orderIdStyle}>{orderId}</div>
              </div>

              {/* 📢 QR PROMOCIONAL (ejemplo) */}
              <div style={promoQRStyle}>
                <p style={{fontSize: '0.8rem', color: '#666'}}>Comparte y gana:</p>
                <img 
                  src={generatePromoQR('COMPARTE10')} 
                  alt="QR Promo" 
                  style={{width: '80px', height: '80px'}} 
                />
                <small style={{color: '#999'}}>Escanea para compartir</small>
              </div>
            </div>

            <button 
              style={finalButtonStyle}
              onClick={() => { clearCart(); onClose(); setStep(1); }}
            >
              Finalizar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Estilos
const printButtonStyle = {
  background: '#f0f0f0', 
  border: '1px solid #ccc', 
  padding: '5px 10px', 
  borderRadius: '5px', 
  cursor: 'pointer'
};

const summaryStyle = {
  marginBottom: '1rem',
  border: '1px solid #ececff',
  borderRadius: 12,
  padding: '1rem',
  background: '#fafaff'
};

const itemStyle = {
  padding: '0.2rem 0',
  borderBottom: '1px solid #eee',
  display: 'flex',
  justifyContent: 'space-between'
};

const totalStyle = {
  textAlign: 'right',
  fontSize: '1.2rem',
  color: '#667eea',
  fontWeight: 'bold',
  marginTop: '8px'
};

const qrSectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  background: '#fff',
  borderRadius: '15px'
};

const logoStyle = {
  width: '100px',
  height: 'auto',
  marginBottom: '1rem'
};

const qrStyle = {
  width: '150px',
  borderRadius: 10,
  border: '4px solid #f0f0f0',
  margin: '1rem 0'
};

const orderIdStyle = {
  fontSize: '1.5rem',
  color: '#333',
  fontWeight: 'bold'
};

const promoQRStyle = {
  marginTop: '1rem',
  padding: '1rem',
  border: '1px dashed #cd7006',
  borderRadius: '8px',
  textAlign: 'center'
};

const finalButtonStyle = {
  marginTop: '1rem',
  width: '100%',
  padding: '1rem',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontWeight: 'bold',
  cursor: 'pointer'
};