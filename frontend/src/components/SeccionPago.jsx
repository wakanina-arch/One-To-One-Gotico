import React, { useState } from 'react';
import { FaCcVisa, FaCcMastercard, FaCcDinersClub } from 'react-icons/fa';

// Función para obtener el logo de la tarjeta usando react-icons
const obtenerLogoTarjeta = (numero) => {
  if (numero.startsWith('4')) {
    return <FaCcVisa size={24} color="#1434CB" />; // Azul de Visa
  }
  if (numero.startsWith('5')) {
    return <FaCcMastercard size={24} color="#FF5F00" />; // Naranja de Mastercard
  }
  if (numero.startsWith('3')) {
    return <FaCcDinersClub size={24} color="#1C1C1C" />; // Negro/gris de Diners
  }
  return <span style={{ fontSize: '1.5rem' }}>?</span>;
};

export default function SeccionPago({ total, alConfirmar, alVolver }) {
  const [metodo, setMetodo] = useState('tarjeta');
  const [datosTarjeta, setDatosTarjeta] = useState({ numero: '', expira: '', cvv: '' });
  const [datosContacto, setDatosContacto] = useState({ nombre: '', telefono: '', email: '' });
  const [errores, setErrores] = useState({});

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'numero' && value.length > 16) return;
    setDatosTarjeta(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosContacto(prev => ({ ...prev, [name]: value }));
  };

  const handlePagar = () => {
    alConfirmar(metodo);
  };

  const renderFormularioPago = () => {
    switch(metodo) {
      case 'tarjeta':
        return (
          <div style={styles.tarjetaForm}>
            <div style={styles.inputConIcono}>
              <input 
                name="numero"
                value={datosTarjeta.numero} 
                onChange={handleCardChange} 
                style={styles.campoNumero} 
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
              />
              <span style={styles.iconoDetector}>
                {obtenerLogoTarjeta(datosTarjeta.numero)}
              </span>
            </div>
            <div style={styles.gridCard}>
              <input 
                name="expira"
                value={datosTarjeta.expira} 
                onChange={handleCardChange} 
                style={styles.input} 
                placeholder="MM/AA"
              />
              <input 
                name="cvv"
                value={datosTarjeta.cvv} 
                onChange={handleCardChange} 
                style={styles.input} 
                placeholder="CVV"
                type="password"
                maxLength="4"
              />
            </div>
          </div>
        );
      
      case 'paypal':
        return (
          <div style={styles.mensajeMetodo}>
            <span style={styles.iconoGrande}>🅿️</span>
            <p>Serás redirigido a PayPal para completar el pago de forma segura.</p>
            <p style={styles.nota}>* No necesitas ingresar datos de tarjeta aquí</p>
          </div>
        );
      
      case 'payphone':
        return (
          <div style={styles.mensajeMetodo}>
            <span style={styles.iconoGrande}>📱</span>
            <p>Paga con PayPhone usando tu saldo o tarjeta vinculada.</p>
            <p style={styles.nota}>* Abrirá la aplicación PayPhone para confirmar</p>
          </div>
        );
      
      case 'deuna':
        return (
          <div style={styles.mensajeMetodo}>
            <span style={styles.iconoGrande}>💎</span>
            <p>Paga con DEUNA de forma rápida y segura.</p>
            <p style={styles.nota}>* Requiere cuenta DEUNA activa</p>
          </div>
        );
      
      default:
        return null;
    }
  };

  // Estilos
  const styles = {
    contenedor: {
      padding: '15px',
      maxWidth: '430px',
      margin: '0 auto',
      background: '#fff',
      borderRadius: '25px',
      fontFamily: "'Cormorant Garamond', serif",
      height: '100%',
      overflowY: 'auto'
    },
    titulo: { 
      textAlign: 'center', 
      color: '#8B0000', 
      fontSize: '1.5rem', 
      marginBottom: '15px',
      fontWeight: '300',
      letterSpacing: '2px'
    },
    seccion: { 
      marginBottom: '15px', 
      padding: '15px', 
      background: '#fcfcfc', 
      borderRadius: '20px', 
      border: '1px solid #eee' 
    },
    label: { 
      display: 'block', 
      marginBottom: '5px', 
      color: '#444', 
      fontWeight: 'bold', 
      fontSize: '0.75rem' 
    },
    input: { 
      width: '100%', 
      padding: '12px', 
      border: '1px solid #ddd', 
      borderRadius: '12px', 
      fontSize: '0.9rem', 
      boxSizing: 'border-box',
      transition: 'border 0.2s ease'
    },
    metodosGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '8px',
      marginBottom: '20px'
    },
    metodoBoton: (active) => ({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '12px 4px',
      background: active ? '#fff5f5' : '#f9f9f9',
      border: active ? '2px solid #8B0000' : '1px solid #ddd',
      borderRadius: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      gap: '6px'
    }),
    metodoIcono: {
      fontSize: '1.5rem'
    },
    metodoTexto: {
      fontSize: '0.7rem',
      fontWeight: '600',
      color: '#333'
    },
    tarjetaForm: { 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '10px',
      animation: 'fadeIn 0.3s ease'
    },
    inputConIcono: { 
      position: 'relative', 
      display: 'flex', 
      alignItems: 'center',
      marginBottom: '10px'
    },
    campoNumero: { 
      width: '100%', 
      padding: '12px', 
      borderRadius: '12px', 
      border: '1px solid #ddd', 
      paddingRight: '60px', 
      boxSizing: 'border-box',
      fontSize: '0.9rem'
    },
    iconoDetector: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.8rem',
      //color: '#000000',
      fontWeight: '600',
      background: 'white',
      padding: '2px 6px',
      borderRadius: '12px',
      border: '1px solid #eee'
    },
    gridCard: { 
      display: 'grid', 
      gridTemplateColumns: '1fr 1fr', 
      gap: '10px', 
      marginTop: '0' 
    },
    mensajeMetodo: {
      textAlign: 'center',
      padding: '20px 10px',
      background: '#f5f5f5',
      borderRadius: '16px',
      border: '1px dashed #8B0000',
      animation: 'fadeIn 0.3s ease'
    },
    iconoGrande: {
      fontSize: '3rem',
      display: 'block',
      marginBottom: '10px'
    },
    nota: {
      fontSize: '0.7rem',
      color: '#888',
      marginTop: '8px',
      fontStyle: 'italic'
    },
    btnPago: {
      width: '100%', 
      marginTop: '20px', 
      padding: '15px',
      background: '#8B0000', 
      color: '#fff', 
      border: 'none',
      borderRadius: '15px', 
      fontWeight: 'bold', 
      cursor: 'pointer',
      fontSize: '1.1rem',
      letterSpacing: '1px',
      transition: 'background 0.2s ease'
    },
    error: { 
      color: 'red', 
      fontSize: '0.65rem', 
      marginTop: '4px',
      marginLeft: '4px'
    }
  };

  // Lista de métodos de pago
  const metodosPago = [
    { id: 'tarjeta', nombre: 'TARJETA', icono: '💳' },
    { id: 'paypal', nombre: 'PayPal', icono: '🅿️' },
    { id: 'payphone', nombre: 'PayPhone', icono: '📱' },
    { id: 'deuna', nombre: 'DEUNA', icono: '💎' }
  ];

  return (
    <div style={styles.contenedor}>
      <h2 style={styles.titulo}>CONFIRMAR PAGO</h2>

      {/* 1. DATOS PERSONALES */}
      <div style={styles.seccion}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
          <div>
            <label style={styles.label}>Nombre</label>
            <input 
              name="nombre" 
              value={datosContacto.nombre} 
              onChange={handleInputChange} 
              style={styles.input} 
              placeholder="Tu nombre" 
            />
            {errores.nombre && <span style={styles.error}>{errores.nombre}</span>}
          </div>
          <div>
            <label style={styles.label}>Teléfono</label>
            <input 
              name="telefono" 
              value={datosContacto.telefono} 
              onChange={handleInputChange} 
              style={styles.input} 
              placeholder="099 999 9999" 
            />
            {errores.telefono && <span style={styles.error}>{errores.telefono}</span>}
          </div>
        </div>
        <label style={{...styles.label, marginTop: '10px'}}>Email</label>
        <input 
          name="email" 
          value={datosContacto.email} 
          onChange={handleInputChange} 
          style={styles.input} 
          placeholder="OneToOne@org.ec" 
        />
        {errores.email && <span style={styles.error}>{errores.email}</span>}
      </div>

      {/* 2. MÉTODOS DE PAGO */}
      <div style={styles.seccion}>
        <div style={styles.metodosGrid}>
          {metodosPago.map(m => (
            <button
              key={m.id}
              onClick={() => setMetodo(m.id)}
              style={styles.metodoBoton(metodo === m.id)}
            >
              <span style={styles.metodoIcono}>{m.icono}</span>
              <span style={styles.metodoTexto}>{m.nombre}</span>
            </button>
          ))}
        </div>

        {/* FORMULARIO DINÁMICO SEGÚN MÉTODO */}
        {renderFormularioPago()}
      </div>

      {/* 3. TOTAL Y ACCIÓN */}
      <div style={{textAlign: 'center', padding: '10px 0'}}>
        <span style={{fontSize: '0.9rem', color: '#666'}}>Total a pagar:</span>
        <div style={{fontSize: '2rem', fontWeight: 'bold', color: '#8B0000'}}>
          ${total.toFixed(2)}
        </div>
      </div>

      <button onClick={handlePagar} style={styles.btnPago}>
        {metodo === 'tarjeta' ? 'PAGAR CON TARJETA' :
         metodo === 'paypal' ? 'PAGAR CON PAYPAL' :
         metodo === 'payphone' ? 'PAGAR CON PAYPHONE' :
         'PAGAR CON DEUNA'}
      </button>
      
      <button 
        onClick={alVolver} 
        style={{
          width: '100%', 
          background: 'none', 
          border: 'none', 
          color: '#888', 
          marginTop: '10px', 
          fontSize: '0.8rem',
          cursor: 'pointer',
          padding: '8px'
        }}
      >
        ← Volver al carrito
      </button>
    </div>
  );
}