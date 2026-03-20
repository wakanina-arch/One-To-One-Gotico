import React from 'react';
import CodigoQr from './CodigoQR';

export default function CodigoQrPedido({ ordenId, tamaño = 100 }) {
  const rutaPedido = `order/${ordenId}`;
  
  return (
    <div style={containerStyle}>
      <CodigoQr 
        valor={rutaPedido} 
        tamaño={tamaño} 
        etiqueta={`Pedido #${ordenId}`}
      />
      <p style={instruccionStyle}>
        Muestra este QR al recoger tu pedido
      </p>
    </div>
  );
}

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem'
};

const instruccionStyle = {
  fontSize: '0.8rem',
  color: '#666',
  fontStyle: 'italic'
};