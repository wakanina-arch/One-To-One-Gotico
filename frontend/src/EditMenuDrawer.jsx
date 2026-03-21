import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from "../config.js";

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) cargarDatos();
  }, [open]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/menus`);
      if (!response.ok) throw new Error('Error');
      const data = await response.json();
      setItems(data);
      const totalPlatos = data.length;
      const disponibles = data.filter(i => i.disponible).length;
      const precioPromedio = totalPlatos > 0 ? data.reduce((sum, i) => sum + i.precio, 0) / totalPlatos : 0;
      setStats({ totalPlatos, disponibles, precioPromedio });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const item of items) {
        await fetch(`${BACKEND_URL}/api/menus/${item._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      alert('✅ Menú guardado');
      onSave?.(items);
      onClose();
    } catch (error) {
      alert('❌ Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const updatePlato = (id, campo, valor) => {
    setItems(items.map(item => item._id === id ? { ...item, [campo]: valor } : item));
  };

  const categorias = {
    entrada: { nombre: '🍽️ ENTRADAS', platos: [] },
    plato_fuerte: { nombre: '🍖 PLATOS FUERTES', platos: [] },
    acompañamiento: { nombre: '🥗 ACOMPAÑAMIENTOS', platos: [] },
    bebida: { nombre: '🥤 BEBIDAS', platos: [] },
    postre: { nombre: '🍰 POSTRES', platos: [] }
  };

  items.forEach(item => {
    const cat = item.categoria;
    if (categorias[cat]) categorias[cat].platos.push(item);
  });

  if (loading) {
    return (
      <div style={styles.backdrop} onClick={onClose}>
        <div style={styles.drawer} onClick={e => e.stopPropagation()}>
          <div style={styles.header}>
            <h2>📝 EDITAR MENÚ</h2>
            <button style={styles.closeBtn} onClick={onClose}>×</button>
          </div>
          <div style={{ padding: '2rem', textAlign: 'center', color: '#FFD700' }}>Cargando menú...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.backdrop} onClick={onClose}>
      <div style={styles.drawer} onClick={e => e.stopPropagation()}>
        <div style={styles.header}>
          <h2>📝 EDITAR MENÚ</h2>
          <button style={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div style={styles.content}>
          {stats && (
            <div style={styles.galleta}>
              <h3>🍪 GALETA INFORMATIVA</h3>
              <div style={styles.statsGrid}>
                <div style={styles.statCard}><span style={styles.statNumber}>{stats.totalPlatos}</span><span>Platos</span></div>
                <div style={styles.statCard}><span style={styles.statNumber}>{stats.disponibles}</span><span>Disponibles</span></div>
                <div style={styles.statCard}><span style={styles.statNumber}>${stats.precioPromedio.toFixed(2)}</span><span>Promedio</span></div>
              </div>
            </div>
          )}

          {Object.entries(categorias).map(([catKey, catData]) => catData.platos.length > 0 && (
            <div key={catKey} style={styles.categoriaSection}>
              <button style={styles.categoriaHeader} onClick={() => setActiveCategory(activeCategory === catKey ? null : catKey)}>
                <span>{catData.nombre}</span>
                <span>{catData.platos.length}</span>
                <span>{activeCategory === catKey ? '▲' : '▼'}</span>
              </button>
              {activeCategory === catKey && (
                <div style={styles.platosContainer}>
                  {catData.platos.map(plato => (
                    <div key={plato._id} style={styles.platoCard}>
                      <div style={styles.platoHeader}>
                        <input value={plato.nombre} onChange={e => updatePlato(plato._id, 'nombre', e.target.value)} placeholder="Nombre" />
                        <input type="number" step="0.01" value={plato.precio} onChange={e => updatePlato(plato._id, 'precio', parseFloat(e.target.value))} placeholder="Precio" />
                      </div>
                      {/* Campo de imagen con previsualización */}
                      <div style={styles.imagenContainer}>
                        <input 
                          value={plato.imagen || ''} 
                          onChange={e => updatePlato(plato._id, 'imagen', e.target.value)} 
                          placeholder="URL de la imagen"
                          style={styles.imagenInput}
                        />
                        {plato.imagen && (
                          <div style={styles.previewContainer}>
                            <img src={plato.imagen} alt={plato.nombre} style={styles.previewImage} onError={(e) => e.target.style.display = 'none'} />
                          </div>
                        )}
                      </div>
                      <textarea 
                        value={plato.descripcion || ''} 
                        onChange={e => updatePlato(plato._id, 'descripcion', e.target.value)} 
                        placeholder="Ingredientes: patatas, mayonesa, lechuga, jalapeños, maíz..."
                        rows="3" 
                      />
                      <label><input type="checkbox" checked={plato.disponible} onChange={e => updatePlato(plato._id, 'disponible', e.target.checked)} /> Disponible</label>
                      {/* Botón para eliminar (próximamente) */}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <button style={styles.saveBtn} onClick={handleSave} disabled={saving}>{saving ? '💾 Guardando...' : '💾 Guardar Cambios'}</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', zIndex: 3000, display: 'flex', justifyContent: 'flex-end' },
  drawer: { width: '90%', maxWidth: '500px', background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1a1a 100%)', height: '100%', overflowY: 'auto', boxShadow: '-5px 0 20px rgba(0,0,0,0.3)', borderLeft: '1px solid rgba(255,215,0,0.3)' },
  header: { padding: '1.2rem', background: 'linear-gradient(135deg, #FFD700, #FF4500)', color: '#1a0a0a', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0 },
  closeBtn: { background: 'rgba(0,0,0,0.3)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '1.2rem', cursor: 'pointer', color: 'white' },
  content: { padding: '1rem' },
  galleta: { background: 'rgba(255,215,0,0.1)', borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', border: '1px solid rgba(255,215,0,0.3)' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' },
  statCard: { background: 'rgba(0,0,0,0.5)', padding: '0.6rem', borderRadius: '12px', textAlign: 'center' },
  statNumber: { display: 'block', fontSize: '1.3rem', fontWeight: 'bold', color: '#FFD700' },
  categoriaSection: { marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', overflow: 'hidden' },
  categoriaHeader: { width: '100%', padding: '0.8rem', background: 'rgba(0,0,0,0.5)', border: 'none', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: 'white' },
  platosContainer: { padding: '0.8rem' },
  platoCard: { background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '0.6rem', marginBottom: '0.6rem' },
  platoHeader: { display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', '& input': { padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(0,0,0,0.6)', color: 'white' } },
  imagenContainer: { marginBottom: '0.5rem' },
  imagenInput: { width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid rgba(255,215,0,0.3)', background: 'rgba(0,0,0,0.6)', color: 'white', marginBottom: '0.3rem' },
  previewContainer: { marginTop: '0.3rem' },
  previewImage: { width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,215,0,0.3)' },
  saveBtn: { width: '100%', padding: '0.8rem', background: 'linear-gradient(135deg, #FFD700, #FF4500)', border: 'none', borderRadius: '30px', color: '#1a0a0a', fontWeight: 'bold', marginTop: '1rem', cursor: 'pointer' }
};

export default EditMenuDrawer;
