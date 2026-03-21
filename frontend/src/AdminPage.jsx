import React, { useState } from 'react';
import Acordeon from './Acordeon';
import EditMenuDrawer from './EditMenuDrawer';
import KitchenKanban from './components/KitchenKanban';
import OrdersLogDrawer from './components/OrdersLogDrawer';
import PromosDrawer from './PromosDrawer';

export default function AdminPage({ 
  onBack,
  menuItems = [], 
  onSaveMenu, 
  log = [], 
  addLog, 
  pendingOrders = [], 
  setPendingOrders, 
  finishedOrders = [], 
  setFinishedOrders 
}) {
  const [drawers, setDrawers] = useState({
    menu: false, 
    orders: false, 
    log: false, 
    promos: false
  });

  const toggleDrawer = (name, val) => setDrawers(prev => ({ ...prev, [name]: val }));

  const total = finishedOrders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);

  return (
    <div style={styles.container}>
      <button onClick={onBack} style={styles.backButton}>
        ← VOLVER AL ORIIGEN
      </button>
      
      <Acordeon 
        menuItems={menuItems}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        pendingOrders={pendingOrders}
        log={log}
        addLog={addLog}
        total={total}
        onOpenDrawer={() => toggleDrawer('menu', true)}
        onOpenOrders={() => toggleDrawer('orders', true)}
        onOpenLog={() => toggleDrawer('log', true)}
        onOpenPromos={() => toggleDrawer('promos', true)}
        onCierreJornada={() => {
          addLog({
            tipo: 'Cierre',
            detalle: `Cierre de jornada - Total: $${total.toFixed(2)}`
          });
          setFinishedOrders([]);
        }}
      />

      <EditMenuDrawer 
        open={drawers.menu} 
        onClose={() => toggleDrawer('menu', false)} 
        menuItems={menuItems} 
        onSave={onSaveMenu} 
      />
      
      <KitchenKanban 
        open={drawers.orders} 
        onClose={() => toggleDrawer('orders', false)} 
        pendingOrders={pendingOrders}
        setPendingOrders={setPendingOrders}
        finishedOrders={finishedOrders}
        setFinishedOrders={setFinishedOrders}
        addLog={addLog}
      />
      
      <OrdersLogDrawer 
        open={drawers.log} 
        onClose={() => toggleDrawer('log', false)} 
        log={log} 
      />
      
      <PromosDrawer 
        open={drawers.promos} 
        onClose={() => toggleDrawer('promos', false)} 
        menuItems={menuItems} 
        onSaveMenu={onSaveMenu} 
      />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at 30% 30%, #2a0a0a 0%, #0a0a0a 100%)',
    padding: '20px'
  },
  backButton: {
    marginBottom: '20px',
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #FFD700, #FF4500)',
    border: 'none',
    borderRadius: '30px',
    color: '#1a0a0a',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};
