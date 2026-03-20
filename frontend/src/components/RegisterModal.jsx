import React, { useState, useEffect } from 'react';

export default function RegisterModal({ 
  open, onClose, onRegister, modo = 'registro', usuarioActual = null, onCerrar
}) {
  const [formData, setFormData] = useState({
    nombre: '', email: '', password: '', confirmPassword: '',
    telefono: '', fechaNacimiento: '', fechaAdmision: '',
    calle: '', numero: '', bloque: '', escalera: '', piso: '', puerta: '', ciudad: '', cp: '', indicaciones: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      if (modo === 'editar' && usuarioActual) {
        setFormData({ ...usuarioActual, password: '', confirmPassword: '' });
      } else {
        setFormData(prev => ({ 
          ...prev, 
          fechaAdmision: new Date().toLocaleDateString(),
          nombre: '', email: '', telefono: '', password: '', confirmPassword: ''
        }));
      }
    }
  }, [open, modo, usuarioActual]);

  if (!open) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.email || !formData.telefono) {
      return setError('Nombre, Email y Teléfono son imprescindibles');
    }
    if (modo === 'registro' && formData.password !== formData.confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }
    onRegister(formData);
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        
        <div style={styles.headerComercial}>
          <span style={styles.iconoVip}>🔱</span>
          <div>
            <div style={styles.statusTexto}>{modo === 'registro' ? 'NUEVO REGISTRO' : 'MI AGENDA PERSONAL'}</div>
            <div style={styles.fechaIngreso}>Desde: {formData.fechaAdmision || 'Hoy'}</div>
          </div>
        </div>

        {error && <div style={styles.errorBanner}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.formularioScroll}>
          <h2 style={styles.titulo}>Ficha de Cliente VIP</h2>
          
          <div style={styles.seccionLabel}>1. Identidad y Contacto</div>
          <Input label="Nombre y Apellidos" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Juan Pérez" />
          
          <div style={styles.row}>
            <div style={{flex: 1.5, minWidth: '140px'}}>
              <Input label="📞 Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="600 000 000" />
            </div>
            <div style={{flex: 1, minWidth: '120px'}}>
              <Input label="🎂 Cumpleaños" name="fechaNacimiento" type="date" value={formData.fechaNacimiento} onChange={handleChange} />
            </div>
          </div>

          <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
          
          <div style={styles.row}>
            <div style={{flex: 1, minWidth: '140px'}}>
              <Input label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} />
            </div>
            <div style={{flex: 1, minWidth: '140px'}}>
              <Input label="Confirmar" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div style={styles.separador} />

          <div style={styles.seccionLabel}>2. Dirección de Entrega (Opcional)</div>
          <Input label="Calle / Avenida" name="calle" value={formData.calle} onChange={handleChange} placeholder="Nombre de la vía" />
          
          <div style={styles.row}>
            <Input label="Nº" name="numero" value={formData.numero} onChange={handleChange} placeholder="14" />
            <Input label="Bloque" name="bloque" value={formData.bloque} onChange={handleChange} placeholder="B" />
            <Input label="Esc." name="escalera" value={formData.escalera} onChange={handleChange} placeholder="Izq" />
          </div>

          <div style={styles.row}>
            <Input label="Piso" name="piso" value={formData.piso} onChange={handleChange} placeholder="4º" />
            <Input label="Puerta" name="puerta" value={formData.puerta} onChange={handleChange} placeholder="C" />
            <Input label="CP" name="cp" value={formData.cp} onChange={handleChange} placeholder="28001" />
          </div>

          <Input label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleChange} placeholder="Madrid" />

          <div style={{ marginBottom: '1rem' }}>
            <label style={styles.label}>Notas para el Repartidor 🛵</label>
            <textarea name="indicaciones" value={formData.indicaciones} onChange={handleChange} style={styles.textarea} />
          </div>

          {/* BOTONES DE ACCIÓN FINAL */}
          <button type="submit" style={styles.btnPrincipal}>
            {modo === 'registro' ? '¡Unirse ahora!' : 'Actualizar mis datos'}
          </button>

         <button onClick={onCerrar} style={styles.btnVolver}>
            ← Volver al Origen
          </button>
        </form>
      </div>
    </div>
  );
}

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: '0.8rem', flex: 1 }}>
    <label style={styles.label}>{label}</label>
    <input {...props} style={styles.input} />
  </div>
);

const styles = {
  overlay: { 
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', 
    backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', 
    justifyContent: 'center', zIndex: 3000, padding: '10px' 
  },
  modal: { 
    background: '#fff', borderRadius: '30px', padding: '1.5rem 1rem', 
    width: '100%', maxWidth: '400px', border: '1.5px solid #FFD700', 
    maxHeight: '94vh', display: 'flex', flexDirection: 'column' 
  },
  formularioScroll: { 
    overflowY: 'auto', paddingRight: '8px', paddingLeft: '2px', 
    WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain'
  },
  headerComercial: { 
    display: 'flex', alignItems: 'center', gap: '12px', background: '#1a0a0a', 
    padding: '10px 15px', borderRadius: '15px', marginBottom: '12px', color: '#FFD700' 
  },
  statusTexto: { fontSize: '0.7rem', fontWeight: '900', letterSpacing: '1px' },
  fechaIngreso: { fontSize: '0.6rem', color: '#fff', opacity: 0.6 },
  titulo: { fontFamily: 'serif', color: '#3d0a0a', fontSize: '1.3rem', marginBottom: '1rem', textAlign: 'center' },
  seccionLabel: { fontSize: '0.7rem', fontWeight: 'bold', color: '#FF4500', marginBottom: '0.8rem', borderBottom: '1px solid #eee', textTransform: 'uppercase' },
  label: { display: 'block', fontSize: '0.65rem', fontWeight: 'bold', color: '#8B0000', marginBottom: '3px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '16px', height: '60px', resize: 'none', boxSizing: 'border-box' },
  row: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  separador: { height: '1.5rem' },
  btnPrincipal: { 
    width: '100%', padding: '15px', background: 'linear-gradient(135deg, #1a0a0a, #3d0a0a)', 
    color: '#FFD700', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1rem' 
  },
  btnVolver: { 
    width: '100%', marginTop: '15px', background: 'none', border: 'none', 
    color: '#888', cursor: 'pointer', fontSize: '0.9rem', padding: '10px',
    fontFamily: 'serif', fontStyle: 'italic', transition: '0.3s'
  },
  errorBanner: { background: '#ffebee', color: '#c62828', padding: '8px', borderRadius: '8px', fontSize: '0.75rem', marginBottom: '1rem', textAlign: 'center' }
};
