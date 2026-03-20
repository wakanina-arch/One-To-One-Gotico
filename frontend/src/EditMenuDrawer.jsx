import React from 'react';

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', background: 'white', padding: '20px', boxShadow: '-2px 0 8px rgba(0,0,0,0.2)', zIndex: 1000 }}>
      <h3>Editar Menú</h3>
      <p>Próximamente: {menuItems.length} platos</p>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
