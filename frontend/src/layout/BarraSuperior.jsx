import React, { useEffect, useState } from 'react';

export default function BarraSuperior({
  usuario,
  onMenuClick,
  onCarritoClick,
  onPerfilClick,
  carritoCount = 0
}) {
  const [pulse, setPulse] = useState(false);
  const [hoverCarrito, setHoverCarrito] = useState(false);
  const [hoverPerfil, setHoverPerfil] = useState(false);

  useEffect(() => {
    if (carritoCount > 0) {
      const timerPulse = setTimeout(() => {
        setPulse(true);
        const timerOff = setTimeout(() => setPulse(false), 300);
        return () => clearTimeout(timerOff);
      }, 50);
      return () => clearTimeout(timerPulse);
    }
  }, [carritoCount]);

  return (
    <nav style={styles.barra}>
      
      {/* 🍔 Lado Izquierdo - Menú Compacto */}
      <button
        onClick={onMenuClick}
        style={styles.btnNav}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        <span style={{ fontSize: "1.8rem", color: "#FFD700" }}>☰</span>
      </button>

      {/* ⚜️ Centro - Título sin saltos de línea */}
      <div style={styles.centro}>
        <h2 style={styles.titulo}>
          <span style={{ color: '#FF4500' }}>ONE</span> TO{' '}
          <span style={{ color: '#FFD700' }}>ONE</span>
        </h2>
      </div>

      {/* 💧 Lado Derecho - Acciones */}
      <div style={styles.acciones}>
        <button
          onClick={onCarritoClick}
          style={{
            ...styles.btnIcono,
            transform: hoverCarrito ? 'scale(1.1)' : 'scale(1)'
          }}
          onMouseEnter={() => setHoverCarrito(true)}
          onMouseLeave={() => setHoverCarrito(false)}
        >
          <span style={styles.iconoCarrito}>🛒</span>
          {carritoCount > 0 && (
            <span style={{
              ...styles.contador,
              transform: pulse ? "scale(1.3)" : "scale(1)",
              background: hoverCarrito ? '#FF4500' : 'linear-gradient(135deg, #FF4500, #B22222)'
            }}>
              {carritoCount}
            </span>
          )}
        </button>

        <button
          onClick={onPerfilClick}
          style={{
            ...styles.btnIcono,
            border: usuario ? "2px solid #FFD700" : "2px solid transparent",
            borderRadius: "50%",
            padding: "2px",
            background: usuario ? "rgba(255, 215, 0, 0.1)" : "transparent",
            transform: hoverPerfil ? 'scale(1.1)' : 'scale(1)'
          }}
          onMouseEnter={() => setHoverPerfil(true)}
          onMouseLeave={() => setHoverPerfil(false)}
        >
          <span style={{
            fontSize: "1.3rem",
            filter: usuario ? "drop-shadow(0 0 8px #FFD700)" : "none",
            color: usuario ? '#FFD700' : '#888'
          }}>
            {usuario ? '🔱' : '👤'}
          </span>
        </button>
      </div>
    </nav>
  )
}

const styles = {
  barra: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 0.5rem", // Padding reducido para ganar espacio lateral
    background: "linear-gradient(145deg, rgba(20, 8, 8, 0.98), rgba(40, 12, 12, 0.95))",
    backdropFilter: "blur(15px)",
    borderBottom: "2px solid rgba(255, 215, 0, 0.25)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    height: "70px",
    width: "100%",
    boxSizing: "border-box",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
  },
  btnNav: {
    background: "transparent", // Eliminado el fondo para máxima discreción
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 5px", // Padding mínimo
    minWidth: "40px", // Reducido de 70px a 40px
    transition: "all 0.2s ease"
  },
  centro: {
    textAlign: 'center',
    flex: 2, // Aumentado para que el título tenga prioridad de espacio
    display: "flex",
    justifyContent: "center"
  },
  titulo: {
    color: "#fff",
    margin: 0,
    fontSize: "1.2rem", // Ajustado para que se vea imponente pero quepa
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: "2px",
    fontWeight: 800,
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
    whiteSpace: "nowrap" // ⚡ EVITA EL SALTO DE LÍNEA
  },
  acciones: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  btnIcono: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    position: "relative",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease"
  },
  iconoCarrito: {
    fontSize: "1.4rem",
    filter: "brightness(0) invert(1) drop-shadow(0 0 3px rgba(255,215,0,0.3))"
  },
  contador: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    background: "linear-gradient(135deg, #FF4500, #B22222)",
    color: "white",
    fontSize: "0.55rem",
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1.5px solid #FFD700",
    fontWeight: "bold",
    zIndex: 2
  }
};
