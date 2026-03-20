import React, { useState, useEffect } from 'react';
// import KitchenStats from './KitchenStats'; // Descomenta si lo usas

export default function KitchenKanban({ 
  open, 
  onClose, 
  pendingOrders = [], 
  setPendingOrders, 
  // Eliminamos 'finishedOrders' de aquí si no se usa para evitar el error TS(6133)
  setFinishedOrders, 
  addLog 
}) {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [timer, setTimer] = useState({});

  const COLUMNAS = [
    { id: 'nuevo', label: '🔥 ENTRANTE', color: '#FF4500' },
    { id: 'produccion', label: '👨‍🍳 BRASA', color: '#f39c12' },
    { id: 'entrega', label: '🥡 LISTO', color: '#27ae60' }
  ];

  useEffect(() => {
    if (!open) return;
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimers = {};
      pendingOrders.forEach(order => {
        const inicio = order.inicioProduccion ? new Date(order.inicioProduccion).getTime() : new Date(order.fecha).getTime();
        const elapsed = Math.floor((now - inicio) / 60000);
        const estimado = order.tiempoEstimado || 15;
        newTimers[order.id] = {
          elapsed,
          estimado,
          isOverdue: elapsed > estimado
        };
      });
      setTimer(newTimers);
    }, 15000); 
    return () => clearInterval(interval);
  }, [open, pendingOrders]);

  const avanzarEstado = (order) => {
    const estados = ['nuevo', 'produccion', 'entrega', 'completado'];
    const index = estados.indexOf(order.estado);
    const nextState = estados[index + 1];
    
    let updatedOrder = { ...order, estado: nextState };
    if (nextState === 'produccion') updatedOrder.inicioProduccion = new Date().toISOString();
    if (nextState === 'entrega') updatedOrder.horaListo = new Date().toLocaleTimeString();

    if (nextState === 'completado') {
      // Aquí sí usamos setFinishedOrders para mover el pedido al historial
      setFinishedOrders(prev => [...prev, updatedOrder]);
      setPendingOrders(prev => prev.filter(o => o.id !== order.id));
      addLog?.({ tipo: 'ENTREGA', pedido: order.id, detalle: `Pedido entregado con éxito` });
    } else {
      setPendingOrders(prev => prev.map(o => o.id === order.id ? updatedOrder : o));
    }
  };

  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        
        <header style={styles.header}>
          <div style={{ flex: 1 }}>
            <h2 style={styles.titulo}>CONTROL DE BRASA 🔱</h2>
            <span style={styles.subtitulo}>Sincronización en tiempo real</span>
          </div>
          <button onClick={onClose} style={styles.btnClose}>CERRAR</button>
        </header>

        <div style={styles.board}>
          {COLUMNAS.map(col => (
            <div key={col.id} style={styles.column}>
              <div style={{...styles.colHeader, borderBottom: `3px solid ${col.color}`}}>
                <span style={{fontSize: '0.8rem'}}>{col.label}</span>
                <span style={styles.countBadge}>{pendingOrders.filter(o => o.estado === col.id).length}</span>
              </div>

              <div style={styles.scrollArea} className="scroll-hidden">
                {pendingOrders.filter(o => o.estado === col.id).map(order => (
                  <div 
                    key={order.id} 
                    style={{
                      ...styles.card,
                      borderLeft: `4px solid ${timer[order.id]?.isOverdue ? '#ff0000' : col.color}`,
                    }}
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div style={styles.cardInfo}>
                      <strong style={{fontSize: '0.9rem'}}>#{order.id.slice(-4)}</strong>
                      <span style={{...styles.timeTag, color: timer[order.id]?.isOverdue ? 'red' : '#666'}}>
                        {timer[order.id]?.elapsed || 0} min
                      </span>
                    </div>
                    
                    <div style={styles.itemsResumen}>
                      {order.items?.map(i => i.nombre).join(', ')}
                    </div>

                    {expandedOrder === order.id && (
                      <div style={styles.detalles}>
                        {order.items?.map((item, idx) => (
                          <div key={idx} style={styles.itemRow}>
                            <span style={{fontSize: '0.85rem'}}>{item.cantidad}x <strong>{item.nombre}</strong></span>
                          </div>
                        ))}
                        <button 
                          onClick={(e) => { e.stopPropagation(); avanzarEstado(order); }}
                          style={{...styles.btnNext, background: col.color}}
                        >
                          AVANZAR ➔
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .scroll-hidden::-webkit-scrollbar { display: none; }
        @keyframes pulse-alert { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 5000, display: 'flex', justifyContent: 'center', alignItems: 'center' },
  drawer: { width: '95vw', maxWidth: '1000px', height: '90vh', background: '#0a0a0a', borderRadius: '24px', padding: '15px', overflow: 'hidden', border: '1px solid #333', display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', alignItems: 'center', marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #222' },
  titulo: { color: '#FFD700', fontSize: '1.2rem', margin: 0, letterSpacing: '1px' },
  subtitulo: { color: '#666', fontSize: '0.6rem', letterSpacing: '1px' },
  btnClose: { background: '#333', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 'bold' },
  board: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', flex: 1, overflow: 'hidden' },
  column: { background: 'rgba(255,255,255,0.02)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  colHeader: { padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' },
  countBadge: { background: '#222', padding: '2px 8px', borderRadius: '8px', color: '#FFD700', fontSize: '0.75rem' },
  scrollArea: { padding: '8px', overflowY: 'auto', flex: 1 },
  card: { background: 'white', padding: '12px', borderRadius: '14px', marginBottom: '8px', cursor: 'pointer' },
  cardInfo: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' },
  timeTag: { fontSize: '0.65rem', background: '#f0f0f0', padding: '2px 6px', borderRadius: '6px' },
  itemsResumen: { fontSize: '0.75rem', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  detalles: { marginTop: '8px', borderTop: '1px solid #eee', paddingTop: '8px' },
  itemRow: { marginBottom: '4px', color: '#333' },
  btnNext: { width: '100%', padding: '10px', border: 'none', borderRadius: '10px', color: 'white', fontWeight: 'bold', marginTop: '8px', fontSize: '0.8rem' }
};
