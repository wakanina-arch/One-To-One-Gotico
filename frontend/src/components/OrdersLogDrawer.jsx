import React from 'react';

export default function OrdersLogDrawer({ open, onClose, log }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'white', padding: '20px', boxShadow: '-2px 0 8px rgba(0,0,0,0.2)', zIndex: 1000, overflow: 'auto' }}>
      <h3>📋 Registro de Actividad</h3>
      {log.length === 0 && <p>No hay movimientos registrados</p>}
      {log.map((entry, i) => (
        <div key={i} style={{ borderBottom: '1px solid #eee', padding: '8px 0', fontSize: '0.8rem' }}>
          <strong>{entry.hora}</strong> - {entry.tipo}: {entry.detalle || entry.pedido}
        </div>
      ))}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
