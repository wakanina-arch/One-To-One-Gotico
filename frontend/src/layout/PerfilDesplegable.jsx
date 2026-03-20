import React from 'react';

export default function PerfilDesplegable({ abierto, onClose, usuario, onEditar, onLogout }) {
  if (!abierto) return null;

  // Cálculo rápido de nivel o estatus (puedes ampliarlo luego)
  const esVip = usuario?.historialPedidos > 5;

  return (
    <div style={styles.container} onClick={onClose}>
      <div style={styles.perfilCard} onClick={e => e.stopPropagation()}>
        
        {/* Badge de Estatus (El toque del "Salón Reservado") */}
        {usuario && (
          <div style={styles.badgeEstatus}>
            {esVip ? '🔱 MIEMBRO VIP' : '🔥 BETA TESTER'}
          </div>
        )}

        {/* Avatar con inicial */}
        <div style={styles.avatarMarco}>
          <div style={styles.avatar}>
            {usuario?.nombre?.charAt(0)?.toUpperCase() || '?'}
          </div>
        </div>
        
        <h4 style={styles.nombre}>{usuario?.nombre || 'Invitado'}</h4>
        <p style={styles.email}>{usuario?.email || 'Inicia sesión para pedidos'}</p>
        
        {/* Mini Agenda / Salón de Recompensas */}
        {usuario && (
          <div style={styles.salonPrivado}>
            <div style={styles.datoAgenda}>
              <span style={styles.agendaEmoji}>🎁</span>
              <span style={styles.agendaTexto}>{usuario.puntos_beta || 0} Puntos</span>
            </div>
            <div style={styles.datoAgenda}>
              <span style={styles.agendaEmoji}>🛵</span>
              <span style={styles.agendaTexto}>{usuario.historialPedidos || 0} Pedidos</span>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div style={styles.acciones}>
          <button onClick={onEditar} style={styles.botonPrincipal}>
            <span style={styles.iconoBoton}>📜</span> Mi Agenda y Perfil
          </button>
          
          <button onClick={onLogout} style={styles.botonLogout}>
            <span style={styles.iconoBoton}>🚪</span> Salir
          </button>
        </div>
        
        <div style={styles.respiro} />
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 2500, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)"
  },
  perfilCard: {
    position: "fixed", top: "80px", right: "20px",
    width: "280px", background: "#1a0a0a",
    borderRadius: "25px 5px 25px 5px", padding: "2rem 1.2rem 1.2rem",
    border: "1.5px solid #FFD700", boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
    textAlign: "center", color: "#fff"
  },
  badgeEstatus: {
    position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
    background: 'linear-gradient(90deg, #FF4500, #FFD700)', color: '#000',
    fontSize: '0.65rem', fontWeight: 'bold', padding: '4px 12px',
    borderRadius: '20px', boxShadow: '0 4px 10px rgba(255,69,0,0.4)'
  },
  avatarMarco: {
    width: "70px", height: "70px", margin: "0 auto 12px",
    borderRadius: "50%", background: "linear-gradient(135deg, #FFD700, #FF4500)",
    padding: "2px"
  },
  avatar: {
    width: "100%", height: "100%", borderRadius: "50%",
    background: "#1a0a0a", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "1.8rem", color: "#FFD700"
  },
  nombre: { margin: 0, fontSize: "1.2rem", fontFamily: "serif", color: "#FFD700" },
  email: { fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem" },
  
  salonPrivado: {
    display: 'flex', justifyContent: 'space-around', background: 'rgba(255,215,0,0.05)',
    borderRadius: '15px', padding: '12px 5px', marginBottom: '1.5rem',
    border: '1px border rgba(255,215,0,0.1)'
  },
  datoAgenda: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  agendaEmoji: { fontSize: '1.1rem', marginBottom: '4px' },
  agendaTexto: { fontSize: '0.7rem', color: '#FFD700', fontWeight: 'bold' },

  acciones: { display: 'flex', flexDirection: 'column', gap: '8px' },
  botonPrincipal: {
    padding: "10px", background: "#FFD700", color: "#000", border: "none",
    borderRadius: "12px", cursor: "pointer", fontWeight: "bold",
    fontFamily: "serif", fontSize: "0.9rem", transition: "0.3s"
  },
  botonLogout: {
    padding: "10px", background: "transparent", color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)", borderRadius: "12px",
    cursor: "pointer", fontSize: "0.8rem", opacity: 0.7
  },
  respiro: {
    height: "2px", width: "40px", margin: "15px auto 0",
    background: "#FFD700", opacity: 0.2
  }
};
