import React, { useState, useEffect } from 'react';

export default function Carrusel({ imagenes = [], estiloCine = true }) {
  const [indice, setIndice] = useState(0);

  // 1. Pantalla de espera (Mística)
  if (!imagenes || imagenes.length === 0 || !imagenes[0]) {
    return (
      <div style={{
        height: "250px", 
        background: "#1a0101", 
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#2600ff"
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🥘</div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic' }}>
          Preparando la delicia...
        </p>
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "100%", // Se adapta al marco del visor
      overflow: "hidden",
      background: "#000"
    }}>
      {/* Imagen Proyectada: Estilo Cine sin marcos */}
      <img
        key={indice}
        src={Array.isArray(imagenes) ? imagenes[indice] : imagenes}
        alt="Visualización del plato"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover", // Llena todo el salón visual
          display: "block",
          animation: "fadeIn 0.5s ease-in-out"
        }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com";
        }}
      />

      {/* Indicadores: Solo si el banquete tiene varias vistas */}
      {Array.isArray(imagenes) && imagenes.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "8px",
          zIndex: 10
        }}>
          {imagenes.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndice(i)}
              style={{
                width: i === indice ? "24px" : "10px",
                height: "10px",
                borderRadius: "10px",
                background: i === indice ? "#FFD700" : "rgba(255,255,255,0.4)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
