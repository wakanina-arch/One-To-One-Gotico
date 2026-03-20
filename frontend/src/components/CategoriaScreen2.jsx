import React, { useState, useEffect } from "react";
import Nutricion from "./Nutricion"; 

export default function CategoriaScreen2({ 
  categoria, 
  onAddToCart, 
  onVerCarrito,
  carritoCount, 
  onBack, 
  usuario,
}) {
  const platos = categoria?.platos || [];
  const [platoEnFoco, setPlatoEnFoco] = useState(null);

  useEffect(() => {
    if (platos.length > 0) {
      setPlatoEnFoco(platos[0]);
    }
  }, [categoria?.titulo]); 

  const handleAddClick = () => {
    if (platoEnFoco && onAddToCart) {
      onAddToCart(platoEnFoco);
    }
  };

  return (
    <div style={styles.salonContainer}>
      <style dangerouslySetInnerHTML={{ __html: `
        .img-proyeccion { width: 100%; height: 100%; object-fit: cover; }
        .scroll-hidden::-webkit-scrollbar { display: none; }
      `}} />

      <div style={styles.wrapperEscalado}>
        <div style={styles.contenido}>
          
          {/* 🖼️ VISOR DE IMAGEN - MÁS GRANDE PARA OCUPAR EL ESPACIO */}
          <div style={styles.visorCard}>
            <div style={styles.marcoImagen}>
              {platoEnFoco && (
                <img 
                  key={platoEnFoco.id} 
                  src={platoEnFoco.imagen.startsWith('/') ? platoEnFoco.imagen : `/${platoEnFoco.imagen}`} 
                  alt={platoEnFoco.nombre}
                  className="img-proyeccion"
                  onError={(e) => { 
                    e.target.src = "https://via.placeholder.com/300x200?text=Imagen+no+disponible"; 
                  }}
                />
              )}
            </div>
            <div style={styles.detallePlato}>
              <h3 style={styles.nombrePlato}>{platoEnFoco?.nombre?.toUpperCase() || "CARGANDO..."}</h3>
            </div>
          </div>

          {/* 📋 LISTA DE OPCIONES - MÁS ESPACIO */}
          <div style={styles.listaOpciones}>
            <div className="scroll-hidden" style={styles.scrollOpciones}>
              {platos.map((plato) => (
                <div 
                  key={plato.id} 
                  onClick={() => setPlatoEnFoco(plato)}
                  style={{ 
                    ...styles.platoOption,
                    borderColor: platoEnFoco?.id === plato.id ? "#FFD700" : "rgba(255,255,255,0.1)",
                    background: platoEnFoco?.id === plato.id ? "rgba(255, 215, 0, 0.15)" : "rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={styles.textoPlato}>
                    <span style={{color: 'white'}}>{plato.nombre}</span>
                    <span style={{color: '#FFD700', fontWeight: 'bold'}}>${plato.precio.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ⚖️ FOOTER CON ACCIONES */}
          <div style={styles.footerAccion}>
            <div style={styles.bloqueNutricion}>
              <Nutricion 
                calorias={platoEnFoco?.kcal || 0} 
                proteinas={platoEnFoco?.prot || 0} 
                carbohidratos={platoEnFoco?.carb || 0} 
              />
            </div>
            <button onClick={handleAddClick} style={styles.btnAgregar}>
              AÑADIR
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

const styles = {
  salonContainer: { 
    height: "100%", 
    width: "100%", 
    background: "radial-gradient(circle at center, #3d0a0a 0%, #1a0a0a 100%)", 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    overflow: 'hidden' 
  },
  
  wrapperEscalado: {
    width: "90%",  // ← AUMENTADO DE 88% A 90%
    height: "100%", // ← AUMENTADO DE 88% A 92%
    borderRadius: "35px",
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden',
  },
  
  contenido: { 
    flex: 1, 
    padding: "12px 12px 8px 12px", // ← REDUCIDO PADDING INFERIOR
    display: 'flex', 
    flexDirection: 'column', 
    overflow: 'hidden',
    gap: "12px" // ← REDUCIDO DE 12px A 8px
  },
  
  // 🖼️ VISOR MÁS GRANDE
  visorCard: { 
    background: "#fff", 
    borderRadius: "24px", 
    overflow: "hidden", 
    flexShrink: 0,
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
    marginBottom: "4px" // ← REDUCIDO
  },
  
  marcoImagen: { 
    width: "100%", 
    height: "260px", // ← AUMENTADO DE 200px A 220px
    background: "#000", 
    position: 'relative' 
  },
  
  detallePlato: { 
    padding: "6px 5px", // ← REDUCIDO PADDING
    textAlign: 'center', 
    background: '#fff' 
  },
  
  nombrePlato: { 
    color: "#1a0a0a", 
    fontSize: "0.95rem", // ← AUMENTADO LIGERAMENTE
    margin: "0", 
    fontWeight: '600',
    letterSpacing: "0.5px"
  },
  
  // 📋 LISTA DE OPCIONES
  listaOpciones: { 
    flex: 1, 
    overflowY: "auto", 
    marginTop: "2px", // ← REDUCIDO
    marginBottom: "2px" // ← REDUCIDO
  },
  
  scrollOpciones: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '6px', // ← REDUCIDO DE 8px A 6px
    paddingRight: "4px"
  },
  
  platoOption: { 
    display: "flex", 
    alignItems: "center", 
    padding: "10px 12px", // ← REDUCIDO PADDING
    borderRadius: "16px",
    border: "1px solid", 
    transition: "all 0.2s ease", 
    cursor: "pointer",
    backdropFilter: "blur(5px)"
  },
  
  textoPlato: { 
    flex: 1, 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: "center",
    fontSize: '0.9rem' 
  },
  
  // ⚖️ FOOTER MÁS COMPACTO
  footerAccion: { 
    display: "flex", 
    alignItems: "stretch",
    gap: "8px", // ← REDUCIDO DE 10px A 8px
    paddingTop: "2px", // ← REDUCIDO
    flexShrink: 0,
    marginTop: "2px" // ← AÑADIDO PARA SUBIR
  },
  
  bloqueNutricion: { 
    flex: 1, 
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px", 
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,215,0,0.1)",
    padding: "0 5px",
    minHeight: "44px" // ← REDUCIDO DE 48px A 44px
  },
  
  btnAgregar: { 
    flex: 1, 
    padding: "0 5px", 
    background: "linear-gradient(135deg, #B22222, #8B0000)",
    color: "#FFFFFF",
    border: "none", 
    borderRadius: "20px", 
    fontWeight: "600",
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    boxShadow: "0 2px 8px rgba(139, 0, 0, 0.3)",
    cursor: "pointer",
    letterSpacing: "0.5px",
    minHeight: "44px", // ← REDUCIDO DE 48px A 44px
    transition: "all 0.2s ease"
  }
};