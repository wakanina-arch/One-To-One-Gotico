import React from 'react';

export default function OpcionPlato({ nombre, precio, seleccionada, onSeleccion }) {
  return (
    <label style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: seleccionada ? '#fff3e0' : '#f8f9fa',
      border: seleccionada ? '2px solid #ff6b35' : '2px solid #e0e0e0',
      borderRadius: '12px',
      marginBottom: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          checked={seleccionada}
          onChange={onSeleccion}
          style={{
            width: '20px',
            height: '20px',
            cursor: 'pointer',
            accentColor: '#ff6b35'
          }}
        />
        <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{nombre}</span>
      </div>
      <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#01400e' }}>
        ${precio.toFixed(2)}
      </span>
    </label>
  );
}