import React from 'react';

export default function KitchenKanban({ open, onClose, pendingOrders, setPendingOrders, finishedOrders, setFinishedOrders, addLog }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '400px', background: 'white', padding: '20px', boxShadow: '-2px 0 8px rgba(0,0,0,0.2)', zIndex: 1000, overflow: 'auto' }}>
      <h3>🍳 Cocina - Kanban</h3>
      <h4>Pendientes: {pendingOrders.length}</h4>
      {pendingOrders.map((order, i) => (
        <div key={i} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
          {order.numeroOrden} - {order.items?.length} items
          <button onClick={() => {
            setFinishedOrders([...finishedOrders, order]);
            setPendingOrders(pendingOrders.filter(o => o !== order));
            addLog({ tipo: 'Cocina', pedido: order.numeroOrden, detalle: 'Completado' });
          }}>✓ Completar</button>
        </div>
      ))}
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
