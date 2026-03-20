import React, { useState } from 'react';
import EntregaPedido from './EntregaPedido';
import EditMenuDrawer from './EditMenuDrawer';
import KitchenKanban from './components/KitchenKanban';
import OrdersLogDrawer from './components/OrdersLogDrawer';
import PromosDrawer from './PromosDrawer';

export default function AdminPage({ 
  menuItems, onSaveMenu, log, addLog, 
  pendingOrders, setPendingOrders, 
  finishedOrders, setFinishedOrders 
}) {

  const [drawers, setDrawers] = useState({
    menu: false, orders: false, log: false, promos: false
  });

  const toggleDrawer = (name, val) => setDrawers(prev => ({ ...prev, [name]: val }));

  const totalCaja = finishedOrders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0);

  const handlePayment = () => {
    addLog({
      tipo: 'Salida',
      pedido: 'PAGO-CAJA',
      usuario: 'Administrador',
      hora: new Date().toLocaleTimeString(),
      detalle: `Cobro de caja: $${totalCaja.toFixed(2)}`
    });
    setFinishedOrders([]);
  };

  return (
    <section style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.titulo}>📊 PANEL DE CONTROL <span style={{color: '#FFD700'}}>ONE TO ONE</span></h2>
        <p style={styles.subtitulo}>GESTIÓN ESTRATÉGICA DEL BANQUETE</p>
      </header>
      
      <div style={styles.grid}>
        {/* TARJETA DE CAJA (EGO/ÉXITO) */}
        <div style={{...styles.card, borderTop: '5px solid #27ae60'}}>
          <h3 style={styles.cardTitle}>💰 ESTADO DE CAJA</h3>
          <div style={styles.totalDisplay}>
            <span style={{fontSize: '0.8rem', color: '#666'}}>RECAUDACIÓN ACTUAL</span>
            <strong style={styles.monto}>${totalCaja.toFixed(2)}</strong>
          </div>
          <EntregaPedido 
            finishedOrders={finishedOrders} 
            setFinishedOrders={setFinishedOrders} 
            addLog={addLog} 
          />
          <button 
            style={totalCaja > 0 ? styles.btnCobrarActive : styles.btnDisabled}
            onClick={handlePayment}
            disabled={totalCaja === 0}
          >
            LIQUIDAR CAJA ({finishedOrders.length})
          </button>
        </div>

        {/* TARJETA DE COCINA (ACCIÓN/BRASA) */}
        <div style={{...styles.card, borderTop: '5px solid #FF4500'}}>
          <h3 style={styles.cardTitle}>👨‍🍳 CONTROL DE BRASA</h3>
          <div style={styles.statsRow}>
            <div style={styles.statBox}>
              <span style={styles.statNum}>{pendingOrders.length}</span>
              <span style={styles.statLabel}>EN COLA</span>
            </div>
            <button style={styles.btnAccion} onClick={() => toggleDrawer('orders', true)}>
              ABRIR KANBAN 🔥
            </button>
          </div>
        </div>

        {/* GESTIÓN DE MENÚ Y PROMOS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📝 INVENTARIO</h3>
          <p style={styles.infoText}>{menuItems.length} platos en catálogo</p>
          <div style={{display: 'flex', gap: '10px'}}>
            <button style={styles.btnSecundario} onClick={() => toggleDrawer('menu', true)}>EDITAR MENÚ</button>
            <button style={styles.btnSecundario} onClick={() => toggleDrawer('promos', true)}>PROMOS</button>
          </div>
        </div>

        {/* REGISTRO Y CIERRE */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>⏰ FINALIZAR DÍA</h3>
          <p style={styles.infoText}>{log.length} movimientos hoy</p>
          <div style={{display: 'flex', gap: '10px'}}>
            <button style={styles.btnSecundario} onClick={() => toggleDrawer('log', true)}>VER LOGS</button>
            <button style={styles.btnCierre} onClick={() => {/* Lógica cierre */}}>CIERRE</button>
          </div>
        </div>
      </div>

      {/* DRAWERS - Inyectando los componentes que ya tienes */}
      <EditMenuDrawer open={drawers.menu} onClose={() => toggleDrawer('menu', false)} menuItems={menuItems} onSave={onSaveMenu} />
      <KitchenKanban open={drawers.orders} onClose={() => toggleDrawer('orders', false)} pendingOrders={pendingOrders} setPendingOrders={setPendingOrders} finishedOrders={finishedOrders} setFinishedOrders={setFinishedOrders} addLog={addLog} />
      <OrdersLogDrawer open={drawers.log} onClose={() => toggleDrawer('log', false)} log={log} />
      <PromosDrawer open={drawers.promos} onClose={() => toggleDrawer('promos', false)} menuItems={menuItems} onSaveMenu={onSaveMenu} />
    </section>
  );
}

const styles = {
  container: { padding: '20px', background: '#fdfaf6', minHeight: '100vh', fontFamily: "'Cormorant Garamond', serif" },
  header: { textAlign: 'center', marginBottom: '30px' },
  titulo: { margin: 0, fontSize: '1.8rem', color: '#3d0a0a', letterSpacing: '2px' },
  subtitulo: { fontSize: '0.7rem', color: '#888', letterSpacing: '3px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { background: 'white', padding: '20px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid #eee' },
  cardTitle: { fontSize: '1rem', color: '#3d0a0a', marginBottom: '15px', borderBottom: '1px solid #FFD700', paddingBottom: '5px' },
  totalDisplay: { textAlign: 'center', padding: '20px', background: '#f8f9fa', borderRadius: '15px', marginBottom: '15px' },
  monto: { display: 'block', fontSize: '2.5rem', color: '#27ae60' },
  statsRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  statBox: { textAlign: 'center', padding: '10px 20px', background: '#fff5f2', borderRadius: '15px' },
  statNum: { display: 'block', fontSize: '2rem', color: '#FF4500', fontWeight: '800' },
  statLabel: { fontSize: '0.6rem', color: '#FF4500', fontWeight: '700' },
  btnAccion: { padding: '15px 25px', background: '#3d0a0a', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' },
  btnSecundario: { flex: 1, padding: '10px', background: '#fdfaf6', border: '1px solid #ddd', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem' },
  btnCierre: { flex: 1, padding: '10px', background: '#B22222', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700' },
  btnCobrarActive: { width: '100%', padding: '15px', background: 'linear-gradient(90deg, #27ae60, #2ecc71)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '800', marginTop: '10px' },
  btnDisabled: { width: '100%', padding: '15px', background: '#eee', color: '#aaa', border: 'none', borderRadius: '12px', cursor: 'not-allowed', marginTop: '10px' },
  infoText: { fontSize: '0.9rem', color: '#666', marginBottom: '15px' }
};
