import React from 'react';

export default function CodigoQr({ valor, tamaño = 150, etiqueta = '' }) {
  // URL base para el QR
  const baseUrl = window.location.origin;
  const qrUrl = valor.startsWith('http') 
    ? valor 
    : `${baseUrl}/${valor}`;
  
  const imagenQr = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(qrUrl)}&size=${tamaño}x${tamaño}`;

  return (
    <div style={qrContainerStyle}>
      <img src={imagenQr} alt={`QR ${valor}`} style={{ width: tamaño, height: tamaño }} />
      {etiqueta && <p style={qrLabelStyle}>{etiqueta}</p>}
    </div>
  );
}

const qrContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  background: 'white',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
};

const qrLabelStyle = {
  marginTop: '0.5rem',
  fontSize: '0.8rem',
  color: '#01400e',
  fontWeight: 'bold'
};