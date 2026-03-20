import React, { useState } from 'react';

export default function OrdersLogDrawer({ open, onClose, log = [] }) {
  const [filter, setFilter] = useState('');

  if (!open) return null;

  const filteredLog = log.filter(entry => {
    const term = filter.toLowerCase();
    return (
      entry.pedido?.toLowerCase().includes(term) ||
      entry.usuario?.toLowerCase().includes(term) ||
      entry.tipo?.toLowerCase().includes(term) ||
      entry.detalle?.toLowerCase().includes(term)
    );
  });

  const handleExport = () => {
    const text = log.map(e => 
      `[${e.hora}] ${e.tipo} | ${e.pedido} | ${e.detalle}`
    ).join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `log_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        
        <div style={headerStyle}>
          <h2>📋 Registro</h2>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <div style={toolbarStyle}>
          <input
            type="text"
            placeholder="Buscar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={searchStyle}
          />
          <button onClick={handleExport} style={exportStyle}>
            Exportar
          </button>
        </div>

        <div style={statsStyle}>
          <span>Total: {log.length}</span>
          <span>Filtrados: {filteredLog.length}</span>
        </div>

        <div style={listStyle}>
          {filteredLog.map((entry, i) => (
            <div key={i} style={entryStyle(entry.tipo)}>
              <div style={entryHeaderStyle}>
                <strong>#{entry.pedido}</strong>
                <small>{entry.hora}</small>
              </div>
              <div>{entry.tipo} · {entry.usuario}</div>
              <small>{entry.detalle}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.5)',
  backdropFilter: 'blur(4px)',
  zIndex: 2000,
  display: 'flex',
  justifyContent: 'flex-end'
};

const drawerStyle = {
  width: '400px',
  background: 'white',
  height: '100vh',
  padding: '2rem',
  overflowY: 'auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const closeButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#e74c3c',
  color: 'white',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer'
};

const toolbarStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1rem'
};

const searchStyle = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const exportStyle = {
  padding: '0.5rem 1rem',
  background: '#01400e',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

const statsStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
  background: '#f8f9fa',
  borderRadius: '4px',
  marginBottom: '1rem',
  fontSize: '0.9rem'
};

const listStyle = {
  maxHeight: 'calc(100vh - 200px)',
  overflowY: 'auto'
};

const entryStyle = (tipo) => ({
  padding: '0.8rem',
  marginBottom: '0.5rem',
  background: tipo === 'Entrada' ? '#e8f8f5' : tipo === 'Salida' ? '#fdeaea' : '#fff3e0',
  borderRadius: '6px',
  borderLeft: `4px solid ${
    tipo === 'Entrada' ? '#27ae60' : tipo === 'Salida' ? '#e74c3c' : '#f39c12'
  }`
});

const entryHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.3rem'
};