import React, { useState } from 'react';

export default function PromosDrawer({ open, onClose, menuItems, onSaveMenu }) {
  const [selectedItemId, setSelectedItemId] = useState('');
  const [promoData, setPromoData] = useState({ descuento: 10, tag: 'ANIVERSARIO' });

  if (!open) return null;

  const handleGuardarPromo = () => {
    if (!selectedItemId) return alert("❌ Selecciona un manjar");

    const nuevoMenu = menuItems.map(item => {
      if (item.id === parseInt(selectedItemId)) {
        const precioBase = item.precioOriginal || item.precio;
        const factor = (100 - promoData.descuento) / 100;
        return {
          ...item,
          enOferta: true,
          descuentoAplicado: promoData.descuento,
          tagPromo: promoData.tag.toUpperCase(),
          precioOriginal: precioBase,
          precio: parseFloat((precioBase * factor).toFixed(2))
        };
      }
      return item;
    });

    onSaveMenu(nuevoMenu);
    setSelectedItemId('');
    alert("🔥 ¡Promoción Encendida!");
  };

  const handleEliminarPromo = (id) => {
    const nuevoMenu = menuItems.map(item => {
      if (item.id === id) {
        return {
          ...item,
          enOferta: false,
          precio: item.precioOriginal || item.precio,
          precioOriginal: undefined,
          tagPromo: ''
        };
      }
      return item;
    });
    onSaveMenu(nuevoMenu);
  };

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        
        <div style={styles.header}>
          <h2 style={styles.titulo}>🏷️ GESTIÓN DE GRATIFICACIONES</h2>
          <button onClick={onClose} style={styles.btnClose}>×</button>
        </div>

        <div style={styles.form}>
          <label style={styles.label}>SELECCIONAR PLATO</label>
          <select 
            style={styles.select} 
            value={selectedItemId} 
            onChange={(e) => setSelectedItemId(e.target.value)}
          >
            <option value="">-- Elige del Inventario --</option>
            {menuItems.map(item => (
              <option key={item.id} value={item.id}>{item.nombre}</option>
            ))}
          </select>

          <label style={styles.label}>INTENSIDAD DEL DESCUENTO (%)</label>
          <input 
            type="number" style={styles.input} 
            value={promoData.descuento}
            onChange={(e) => setPromoData({...promoData, descuento: e.target.value})}
          />

          <label style={styles.label}>MOTIVO (TAG)</label>
          <div style={styles.tagCloud}>
            {['OFERTA', '2X1', 'CUMPLE', 'ANIVERSARIO', 'BETA'].map(t => (
              <button 
                key={t} 
                onClick={() => setPromoData({...promoData, tag: t})}
                style={{...styles.tagBtn, background: promoData.tag === t ? '#FF4500' : '#3d0a0a'}}
              >
                {t}
              </button>
            ))}
          </div>

          <button onClick={handleGuardarPromo} style={styles.btnActivar}>
            ACTIVAR EN EL BARRO 🔥
          </button>
        </div>

        <h4 style={styles.sub}>PROMOCIONES EN VIVO</h4>
        <div style={styles.lista}>
          {menuItems.filter(i => i.enOferta).map(item => (
            <div key={item.id} style={styles.promoCard}>
              <div>
                <strong style={{color: '#3d0a0a'}}>{item.nombre}</strong>
                <div style={{fontSize: '0.7rem', color: '#B22222', fontWeight: 800}}>
                  {item.tagPromo} | -{item.descuentoAplicado}%
                </div>
              </div>
              <button onClick={() => handleEliminarPromo(item.id)} style={styles.btnDel}>🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', justifyContent: 'flex-end', backdropFilter: 'blur(5px)' },
  drawer: { width: '380px', background: '#fdfaf6', height: '100%', padding: '2rem', fontFamily: "'Cormorant Garamond', serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #FFD700', paddingBottom: '1rem' },
  titulo: { fontSize: '1.2rem', color: '#3d0a0a', margin: 0, letterSpacing: '1px' },
  btnClose: { background: '#B22222', color: 'white', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' },
  form: { marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  label: { fontSize: '0.75rem', fontWeight: 800, color: '#888', letterSpacing: '1px' },
  select: { padding: '12px', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' },
  input: { padding: '12px', borderRadius: '12px', border: '1px solid #ddd' },
  tagCloud: { display: 'flex', flexWrap: 'wrap', gap: '5px' },
  tagBtn: { padding: '5px 10px', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.65rem', cursor: 'pointer', transition: '0.3s' },
  btnActivar: { padding: '15px', background: 'linear-gradient(135deg, #FF4500, #B22222)', color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' },
  sub: { fontSize: '0.8rem', color: '#666', marginTop: '2.5rem', borderBottom: '1px solid #eee' },
  lista: { marginTop: '1rem' },
  promoCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'white', borderRadius: '12px', marginBottom: '8px', border: '1px solid #FFD700' },
  btnDel: { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }
};
