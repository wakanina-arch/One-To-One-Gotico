import React from 'react';

export default function Nutricion({ calorias = 0, proteinas = 0, carbohidratos = 0 }) {
  return (
    <div style={styles.contenedor}>
      {/* Ítem de Energía (Calorías) */}
      <div style={styles.item}>
        <div style={styles.icono}>🔥</div>
        <div style={styles.datos}>
          <span style={styles.valor}>{calorias}</span>
          <span style={styles.unidad}>KCAL</span>
        </div>
      </div>

      {/* Separador artesanal */}
      <div style={styles.separador} />

      {/* Ítem de Construcción (Proteína) */}
      <div style={styles.item}>
        <div style={styles.icono}>💪</div>
        <div style={styles.datos}>
          <span style={styles.valor}>{proteinas}g</span>
          <span style={styles.unidad}>PROT</span>
        </div>
      </div>

      <div style={styles.separador} />

      {/* Ítem de Combustible (Carbohidratos) */}
      <div style={styles.item}>
        <div style={styles.icono}>🌾</div>
        <div style={styles.datos}>
          <span style={styles.valor}>{carbohidratos}g</span>
          <span style={styles.unidad}>CARB</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  contenedor: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    // ELIMINADO: backgroundColor, border, margin y boxShadow para limpiar el visor
    width: '100%',
    padding: '0', 
    background: 'transparent', 
    fontFamily: "'Cormorant Garamond', serif",
    height: '30px',           // ← ALTURA FIJA
    minHeight: '50px',
    maxHeight: '30px'
  },
  item: {
    textAlign: 'center',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px'
  },
  icono: {
    fontSize: '0.9rem',
    filter: 'grayscale(0.2)'
  },
  datos: {
    display: 'flex',
    flexDirection: 'column'
  },
  valor: {
    fontWeight: '800',
    color: '#0e8f28', 
    fontSize: '0.9rem',
    lineHeight: '1'
  },
  unidad: {
    color: '#8B0000', 
    fontSize: '0.55rem',
    fontWeight: '700',
    letterSpacing: '1px'
  },
  separador: {
    width: '1px',
    height: '25px',
    backgroundColor: 'rgba(255,255,255,0.1)' // Cambiado a blanco tenue para fondo oscuro
  }
};
