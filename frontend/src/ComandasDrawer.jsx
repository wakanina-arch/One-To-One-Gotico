// src/components/KitchenKanban.jsx (nuevo nombre, más profesional)
import React, { useState, useEffect } from 'react';

export default function KitchenKanban({ 
  open, 
  onClose, 
  pendingOrders = [], 
  setPendingOrders, 
  finishedOrders = [], 
  setFinishedOrders, 
  addLog 
}) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [timer, setTimer] = useState({});

  // Estados del flujo Kanban
  const KANBAN_COLUMNS = [
    { id: 'nuevo', label: '🆕 RECEPCIÓN', color: '#3498db', icon: '📥', next: 'produccion' },
    { id: 'produccion', label: '👨‍🍳 PRODUCCIÓN', color: '#f39c12', icon: '🔥', next: 'entrega' },
    { id: 'entrega', label: '✅ ENTREGA', color: '#27ae60', icon: '🍽️', next: 'completado' },
    { id: 'gestion', label: '⚙️ GESTIÓN', color: '#9b59b6', icon: '📊', next: null }
  ];

  // Actualizar timers cada minuto para pedidos en producción
  useEffect(() => {
    if (!open) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const newTimers = {};
      
      pendingOrders.forEach(order => {
        if (order.estado === 'produccion' && order.inicioProduccion) {
          const inicio = new Date(order.inicioProduccion);
          const elapsed = Math.floor((now - inicio) / 60000);
          const estimado = order.tiempoEstimado || 15;
          newTimers[order.id] = {
            elapsed,
            estimado,
            progress: Math.min(100, (elapsed / estimado) * 100),
            isOverdue: elapsed > estimado
          };
        }
      });
      
      setTimer(newTimers);
    }, 60000);
    
    return () => clearInterval(interval);
  }, [open, pendingOrders]);

  // Avanzar pedido al siguiente estado
  const avanzarEstado = (order, index, currentState) => {
    const columnIndex = KANBAN_COLUMNS.findIndex(col => col.id === currentState);
    if (columnIndex === -1 || columnIndex >= KANBAN_COLUMNS.length - 1) return;

    const nextState = KANBAN_COLUMNS[columnIndex + 1].id;
    
    const updatedOrder = {
      ...order,
      estado: nextState,
      ...(nextState === 'produccion' && { 
        inicioProduccion: new Date().toISOString(),
        tiempoEstimado: calcularTiempoEstimado(order.items)
      }),
      ...(nextState === 'entrega' && { 
        horaListo: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
    };

    // Si es el último estado (completado), mover a finishedOrders
    if (nextState === 'completado') {
      setFinishedOrders(prev => [...prev, updatedOrder]);
      setPendingOrders(prev => prev.filter((_, i) => i !== index));
      
      addLog?.({
        tipo: 'ENTREGA',
        pedido: order.id,
        usuario: order.cliente || 'Mesa ' + order.mesa,
        hora: new Date().toLocaleTimeString(),
        detalle: `Pedido completado - Total: $${order.total?.toFixed(2)}`
      });
    } else {
      const updatedPending = [...pendingOrders];
      updatedPending[index] = updatedOrder;
      setPendingOrders(updatedPending);
    }

    setExpandedOrder(null);
  };

  // Calcular tiempo estimado basado en items
  const calcularTiempoEstimado = (items) => {
    if (!items?.length) return 15;
    return Math.max(10, items.reduce((acc, item) => acc + (item.tiempo || 5) * (item.cantidad || 1), 0));
  };

  // Renderizar columna Kanban
  const renderColumn = (column) => {
    const ordersInColumn = pendingOrders.filter(o => o.estado === column.id);
    
    return (
      <div key={column.id} style={columnStyle(column.color)}>
        <div style={columnHeaderStyle}>
          <span style={columnIconStyle}>{column.icon}</span>
          <h3 style={columnTitleStyle}>{column.label}</h3>
          <span style={columnCountStyle}>{ordersInColumn.length}</span>
        </div>
        
        <div style={columnContentStyle}>
          {ordersInColumn.length === 0 ? (
            <p style={emptyColumnStyle}>Sin pedidos</p>
          ) : (
            ordersInColumn.map((order, idx) => {
              const originalIndex = pendingOrders.findIndex(o => o.id === order.id);
              const orderTimer = timer[order.id];
              const isExpanded = expandedOrder === order.id;
              
              return (
                <div 
                  key={order.id} 
                  style={{
                    ...orderCardStyle,
                    ...(orderTimer?.isOverdue ? overdueCardStyle : {}),
                    ...(isExpanded ? expandedCardStyle : {})
                  }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div style={orderHeaderStyle}>
                    <span style={orderIdStyle}>#{order.id}</span>
                    <span style={orderTimeStyle}>{order.hora}</span>
                  </div>
                  
                  <div style={orderInfoStyle}>
                    <span>Mesa {order.mesa}</span>
                    <span>{order.cliente || 'Cliente'}</span>
                  </div>

                  {column.id === 'produccion' && orderTimer && (
                    <div style={progressContainerStyle}>
                      <div style={{
                        ...progressBarStyle,
                        width: `${orderTimer.progress}%`,
                        backgroundColor: orderTimer.isOverdue ? '#e74c3c' : '#27ae60'
                      }} />
                      <span style={progressTextStyle}>
                        {orderTimer.elapsed}/{orderTimer.estimado} min
                      </span>
                    </div>
                  )}

                  {isExpanded && (
                    <div style={expandedContentStyle}>
                      <div style={itemsListStyle}>
                        {order.items?.map((item, i) => (
                          <div key={i} style={itemRowStyle}>
                            <span>{item.cantidad}x {item.nombre}</span>
                            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                      
                      {column.next && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            avanzarEstado(order, originalIndex, column.id);
                          }}
                          style={actionButtonStyle(column.color)}
                        >
                          {column.id === 'nuevo' && '▶ Iniciar'}
                          {column.id === 'produccion' && '✅ Terminar'}
                          {column.id === 'entrega' && '🚚 Entregar'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  if (!open) return null;

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div style={headerStyle}>
          <h2 style={headerTitleStyle}>👨‍🍳 COCINA KANBAN</h2>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        {/* Estadísticas rápidas */}
        <div style={statsContainerStyle}>
          <div style={statItemStyle}>
            <span style={statValueStyle}>{pendingOrders.length}</span>
            <span style={statLabelStyle}>En cocina</span>
          </div>
          <div style={statItemStyle}>
            <span style={statValueStyle}>{finishedOrders.length}</span>
            <span style={statLabelStyle}>Completados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statValueStyle}>
              {Object.values(timer).filter(t => t.isOverdue).length}
            </span>
            <span style={statLabelStyle}>Atrasados</span>
          </div>
          <div style={statItemStyle}>
            <span style={statValueStyle}>
              {pendingOrders.filter(o => o.estado === 'entrega').length}
            </span>
            <span style={statLabelStyle}>Listos</span>
          </div>
        </div>

        {/* Tablero Kanban */}
        <div style={kanbanBoardStyle}>
          {KANBAN_COLUMNS.map(renderColumn)}
        </div>

        {/* Pedidos completados (colapsable) */}
        {finishedOrders.length > 0 && (
          <details style={completedSectionStyle}>
            <summary style={completedSummaryStyle}>
              <span>📦 Pedidos Completados ({finishedOrders.length})</span>
              <span style={{ fontSize: '0.8rem' }}>▼</span>
            </summary>
            <div style={completedListStyle}>
              {finishedOrders.slice(-5).map((order, idx) => (
                <div key={order.id || idx} style={completedItemStyle}>
                  <span style={completedIdStyle}>#{order.id}</span>
                  <span style={completedTimeStyle}>{order.horaListo || order.hora}</span>
                  <span style={completedTotalStyle}>${order.total?.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </details>
        )}
      </div>
    </div>
  );
}

// ============================================
// ESTILOS (a tu capricho mi rey)
// ============================================

const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(4px)',
  zIndex: 2000,
  display: 'flex',
  justifyContent: 'flex-end'
};

const drawerStyle = {
  width: '90%',
  maxWidth: '1200px',
  height: '100vh',
  backgroundColor: '#fff',
  boxShadow: '-10px 0 30px rgba(0,0,0,0.2)',
  padding: '2rem',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const headerTitleStyle = {
  fontSize: '1.8rem',
  color: '#01400e',
  fontFamily: "'Cormorant Garamond', serif",
  margin: 0
};

const closeButtonStyle = {
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: '#ef5350',
  color: 'white',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statsContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1rem',
  marginBottom: '2rem'
};

const statItemStyle = {
  background: '#f8f9fa',
  padding: '1rem',
  borderRadius: '12px',
  textAlign: 'center'
};

const statValueStyle = {
  display: 'block',
  fontSize: '2rem',
  fontWeight: 'bold',
  color: '#01400e'
};

const statLabelStyle = {
  fontSize: '0.8rem',
  color: '#666'
};

const kanbanBoardStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '1.5rem',
  flex: 1,
  minHeight: '500px'
};

const columnStyle = (color) => ({
  background: '#f8f9fa',
  borderRadius: '16px',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  borderTop: `4px solid ${color}`
});

const columnHeaderStyle = {
  padding: '1rem',
  background: 'white',
  borderBottom: '1px solid #eee',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
};

const columnIconStyle = {
  fontSize: '1.2rem'
};

const columnTitleStyle = {
  margin: 0,
  fontSize: '0.9rem',
  fontWeight: 'bold',
  color: '#333',
  flex: 1
};

const columnCountStyle = {
  background: '#eee',
  padding: '0.2rem 0.6rem',
  borderRadius: '20px',
  fontSize: '0.8rem',
  fontWeight: 'bold'
};

const columnContentStyle = {
  flex: 1,
  padding: '1rem',
  overflowY: 'auto',
  maxHeight: '500px'
};

const emptyColumnStyle = {
  textAlign: 'center',
  color: '#999',
  padding: '1rem',
  fontSize: '0.9rem'
};

const orderCardStyle = {
  background: 'white',
  borderRadius: '12px',
  padding: '1rem',
  marginBottom: '0.8rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  border: '1px solid #eee',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
};

const overdueCardStyle = {
  borderLeft: '4px solid #e74c3c'
};

const expandedCardStyle = {
  boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
};

const orderHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.5rem'
};

const orderIdStyle = {
  fontWeight: 'bold',
  color: '#01400e'
};

const orderTimeStyle = {
  fontSize: '0.8rem',
  color: '#999'
};

const orderInfoStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.9rem',
  color: '#666',
  marginBottom: '0.5rem'
};

const progressContainerStyle = {
  height: '6px',
  background: '#eee',
  borderRadius: '3px',
  marginTop: '0.5rem',
  position: 'relative'
};

const progressBarStyle = {
  height: '100%',
  borderRadius: '3px',
  transition: 'width 0.3s ease'
};

const progressTextStyle = {
  position: 'absolute',
  top: '-18px',
  right: '0',
  fontSize: '0.7rem',
  color: '#666'
};

const expandedContentStyle = {
  marginTop: '1rem',
  paddingTop: '1rem',
  borderTop: '1px dashed #eee'
};

const itemsListStyle = {
  marginBottom: '1rem'
};

const itemRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.85rem',
  padding: '0.3rem 0'
};

const actionButtonStyle = (color) => ({
  width: '100%',
  padding: '0.6rem',
  background: color,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontWeight: 'bold',
  cursor: 'pointer',
  fontSize: '0.85rem',
  transition: 'all 0.3s ease'
});

const completedSectionStyle = {
  marginTop: '2rem',
  border: '1px solid #eee',
  borderRadius: '12px'
};

const completedSummaryStyle = {
  padding: '1rem',
  cursor: 'pointer',
  fontWeight: 'bold',
  color: '#01400e'
};

const completedListStyle = {
  padding: '1rem',
  maxHeight: '150px',
  overflowY: 'auto'
};

const completedItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.5rem',
  borderBottom: '1px solid #eee',
  fontSize: '0.9rem'
};

const completedIdStyle = {
  fontWeight: 'bold',
  color: '#666'
};

const completedTimeStyle = {
  color: '#999'
};

const completedTotalStyle = {
  fontWeight: 'bold',
  color: '#01400e'
};