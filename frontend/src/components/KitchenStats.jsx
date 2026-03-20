// src/components/KitchenStats.jsx
import React from 'react';

export default function KitchenStats({ pendingOrders, finishedOrders, timer }) {
  // Calcular métricas
  const totalEnCocina = pendingOrders.length;
  const enProduccion = pendingOrders.filter(o => o.estado === 'produccion').length;
  const listos = pendingOrders.filter(o => o.estado === 'entrega').length;
  const atrasados = Object.values(timer).filter(t => t.isOverdue).length;
  
  // Tiempo promedio
  const tiempoPromedio = pendingOrders.reduce((acc, order) => {
    return acc + (order.tiempoEstimado || 15);
  }, 0) / (pendingOrders.length || 1);

  return (
    <div style={statsGridStyle}>
      <div style={statCardStyle('#3498db')}>
        <span style={statIconStyle}>🆕</span>
        <div>
          <span style={statLabelStyle}>Nuevos</span>
          <span style={statValueStyle}>{totalEnCocina - enProduccion - listos}</span>
        </div>
      </div>
      
      <div style={statCardStyle('#f39c12')}>
        <span style={statIconStyle}>🔥</span>
        <div>
          <span style={statLabelStyle}>En cocina</span>
          <span style={statValueStyle}>{enProduccion}</span>
        </div>
      </div>
      
      <div style={statCardStyle('#27ae60')}>
        <span style={statIconStyle}>✅</span>
        <div>
          <span style={statLabelStyle}>Listos</span>
          <span style={statValueStyle}>{listos}</span>
        </div>
      </div>
      
      <div style={statCardStyle('#e74c3c')}>
        <span style={statIconStyle}>⚠️</span>
        <div>
          <span style={statLabelStyle}>Atrasados</span>
          <span style={statValueStyle}>{atrasados}</span>
        </div>
      </div>
      
      <div style={statCardStyle('#9b59b6')}>
        <span style={statIconStyle}>⏱️</span>
        <div>
          <span style={statLabelStyle}>Tiempo prom.</span>
          <span style={statValueStyle}>{Math.round(tiempoPromedio)} min</span>
        </div>
      </div>
      
      <div style={statCardStyle('#01400e')}>
        <span style={statIconStyle}>📊</span>
        <div>
          <span style={statLabelStyle}>Completados</span>
          <span style={statValueStyle}>{finishedOrders.length}</span>
        </div>
      </div>
    </div>
  );
}

// Estilos
const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '1rem',
  marginBottom: '2rem'
};

const statCardStyle = (color) => ({
  background: '#f8f9fa',
  padding: '1rem',
  borderRadius: '12px',
  borderLeft: `4px solid ${color}`,
  display: 'flex',
  alignItems: 'center',
  gap: '1rem'
});

const statIconStyle = {
  fontSize: '1.8rem'
};

const statLabelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#666',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const statValueStyle = {
  display: 'block',
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: '#333',
  lineHeight: 1.2
};