import React, { useState, useEffect } from 'react';

export default function EntregaPedido({ finishedOrders = [], setFinishedOrders, addLog }) {
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (finishedOrders.length > 0) {
      setFeedback('🔔 Pedido listo');
      setTimeout(() => setFeedback(''), 3000);
    }
  }, [finishedOrders.length]);

  // 📌 VALIDADOR QR COMPLETO
  const validateQRInput = (input) => {
    const cleanInput = input.trim();
    
    // Caso 1: QR PÚBLICO con promoción
    if (cleanInput.includes('promo=')) {
      const promoMatch = cleanInput.match(/promo=([^&]+)/);
      if (promoMatch) {
        return { type: 'promo', code: promoMatch[1] };
      }
    }
    
    // Caso 2: QR DE PEDIDO (URL con /order/ORD-123)
    const orderMatch = cleanInput.match(/\/order\/(ORD-\d+)/i);
    if (orderMatch) {
      return { type: 'order', id: orderMatch[1] };
    }
    
    // Caso 3: QR con JSON
    if (cleanInput.startsWith('{') && cleanInput.endsWith('}')) {
      try {
        const parsed = JSON.parse(cleanInput);
        if (parsed.orderId) return { type: 'order', id: parsed.orderId };
        if (parsed.promo) return { type: 'promo', code: parsed.promo };
      } catch (e) {}
    }
    
    // Caso 4: Solo ID (ORD-123)
    const idMatch = cleanInput.match(/(ORD-\d+)/i);
    if (idMatch) return { type: 'order', id: idMatch[1] };
    
    return null;
  };

  const handleDelivery = () => {
    if (!code.trim()) {
      setFeedback('❌ Ingresa un código');
      return;
    }

    const qrData = validateQRInput(code);
    
    if (!qrData) {
      setFeedback('❌ Código QR inválido');
      return;
    }
    
    // 🎯 QR PROMOCIONAL
    if (qrData.type === 'promo') {
      setFeedback(`🎉 Promo: ${qrData.code} - Válido en tu próximo pedido`);
      // Abrir modal de promoción
      window.open(`/?promo=${qrData.code}`, '_blank');
      setCode('');
      return;
    }
    
    // 🎯 QR DE PEDIDO
    if (qrData.type === 'order') {
      const order = finishedOrders.find(o => 
        o.id?.toString().toUpperCase() === qrData.id.toUpperCase()
      );

      if (!order) {
        setFeedback('❌ Pedido no encontrado');
        return;
      }

      // Entregar pedido
      setFinishedOrders(prev => prev.filter(o => o.id !== order.id));
      setFeedback(`✅ Orden #${order.id} entregada`);
      setCode('');

      if (addLog) {
        addLog({
          tipo: 'ENTREGA QR',
          pedido: order.id,
          hora: new Date().toLocaleTimeString(),
          detalle: 'Entrega por QR'
        });
      }
    }
  };

  return (
    <div style={containerStyle}>
      
      <div style={counterStyle}>
        <span style={numberStyle}>{finishedOrders.length}</span>
        <span>Listos</span>
      </div>

      <div style={formStyle}>
        <input
          type="text"
          placeholder="Código QR o #orden"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleDelivery()}
          style={inputStyle}
          disabled={isScanning}
        />

        <div style={buttonGroupStyle}>
          <button
            onClick={handleDelivery}
            style={deliveryButtonStyle(!!code.trim())}
            disabled={!code.trim()}
          >
            🚀 ENTREGAR
          </button>
        </div>

        {feedback && (
          <div style={feedbackStyle(feedback)}>
            {feedback}
          </div>
        )}

        {/* Ejemplos de QR para pruebas */}
        <div style={examplesStyle}>
          <p style={examplesTitleStyle}>📱 Prueba estos QR:</p>
          <div style={exampleItemStyle} onClick={() => setCode('https://one-toone.com/order/ORD-123')}>
            <span>📦 Pedido: ORD-123</span>
          </div>
          <div style={exampleItemStyle} onClick={() => setCode('https://one-toone.com/?promo=DESCUENTO15')}>
            <span>🎁 Promo: DESCUENTO15</span>
          </div>
          <div style={exampleItemStyle} onClick={() => setCode('{"orderId":"ORD-456"}')}>
            <span>🔷 JSON: ORD-456</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estilos
const containerStyle = {
  background: 'white',
  padding: '1.5rem',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  border: '1px solid #eee',
  maxWidth: '400px',
  margin: '0 auto'
};

const counterStyle = {
  background: '#01400e',
  color: 'white',
  width: '100px',
  height: '100px',
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 1.5rem',
  border: '4px solid #cd7006'
};

const numberStyle = {
  fontSize: '2.5rem',
  fontWeight: 'bold',
  lineHeight: 1
};

const formStyle = {
  width: '100%'
};

const inputStyle = {
  width: '100%',
  padding: '1rem',
  borderRadius: '8px',
  border: '2px solid #eee',
  fontSize: '1rem',
  marginBottom: '0.5rem'
};

const buttonGroupStyle = {
  marginBottom: '1rem'
};

const deliveryButtonStyle = (active) => ({
  width: '100%',
  padding: '1rem',
  background: active ? '#cd7006' : '#f0f0f0',
  border: active ? '2px solid #b85e00' : '2px dashed #cd7006',
  borderRadius: '8px',
  color: active ? 'white' : '#666',
  fontWeight: 'bold',
  cursor: active ? 'pointer' : 'not-allowed'
});

const feedbackStyle = (feedback) => ({
  marginTop: '1rem',
  padding: '0.8rem',
  borderRadius: '6px',
  background: feedback.includes('✅') ? '#e8f8f5' : feedback.includes('❌') ? '#fdeaea' : '#fff3e0',
  borderLeft: `4px solid ${
    feedback.includes('✅') ? '#27ae60' : feedback.includes('❌') ? '#e74c3c' : '#f39c12'
  }`
});

const examplesStyle = {
  marginTop: '1.5rem',
  padding: '1rem',
  background: '#f8f9fa',
  borderRadius: '8px'
};

const examplesTitleStyle = {
  margin: '0 0 0.5rem 0',
  fontSize: '0.85rem',
  color: '#666'
};

const exampleItemStyle = {
  padding: '0.5rem',
  background: 'white',
  borderRadius: '4px',
  marginBottom: '0.3rem',
  cursor: 'pointer',
  border: '1px solid #eee',
  fontSize: '0.85rem'
};