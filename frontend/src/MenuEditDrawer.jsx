// src/components/EditMenuDrawer.jsx
import React, { useState } from 'react';

export default function EditMenuDrawer({ open, onClose, menuItems, onSave }) {
  const [items, setItems] = useState(menuItems);

  if (!open) return null;

  const renderPreview = (url) => {
    if (!url) return <div style={previewPlaceholderStyle}>Esperando imagen...</div>;
    return (
      <img 
        src={url} 
        alt="Preview" 
        style={previewImageStyle}
        onError={(e) => e.target.style.display = 'none'}
      />
    );
  };

  const handleCategoryChange = (idx, field, value) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [field]: value };
    setItems(updated);
  };

  const handleOptionChange = (itemIdx, optIdx, field, value) => {
    const updated = [...items];
    updated[itemIdx].opciones[optIdx] = {
      ...updated[itemIdx].opciones[optIdx],
      [field]: value
    };
    setItems(updated);
  };

  const handleAddOption = (itemIdx) => {
    const updated = [...items];
    updated[itemIdx].opciones.push({
      nombre: '',
      precio: 0,
      imagen: ''
    });
    setItems(updated);
  };

  const handleRemoveOption = (itemIdx, optIdx) => {
    const updated = [...items];
    updated[itemIdx].opciones = updated[itemIdx].opciones.filter((_, i) => i !== optIdx);
    setItems(updated);
  };

  return (
    <div style={backdropStyle} onClick={onClose}>
      <div style={drawerStyle} onClick={e => e.stopPropagation()}>
        
        <div style={headerStyle}>
          <h2 style={headerTitleStyle}>⚙️ Editar Menú</h2>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(items); onClose(); }}>
          
          <button type="button" onClick={() => {
            setItems([...items, { id: Date.now(), nombre: 'Nueva Categoría', opciones: [] }]);
          }} style={addCategoryStyle}>
            + Añadir Categoría
          </button>

          {items.map((item, idx) => (
            <div key={item.id} style={categoryCardStyle}>
              
              <div style={categoryHeaderStyle}>
                <span style={categoryBadgeStyle}>Categoría</span>
                <input 
                  style={categoryInputStyle}
                  value={item.nombre} 
                  onChange={e => handleCategoryChange(idx, 'nombre', e.target.value)} 
                />
                <button type="button" onClick={() => {
                  setItems(items.filter((_, i) => i !== idx));
                }} style={removeButtonStyle}>🗑️</button>
              </div>

              <div style={optionsSectionStyle}>
                <div style={optionsHeaderStyle}>
                  <span style={optionsTitleStyle}>Platos</span>
                  <button type="button" onClick={() => handleAddOption(idx)} style={addOptionStyle}>
                    + Añadir
                  </button>
                </div>

                {item.opciones.map((opt, oidx) => (
                  <div key={oidx} style={optionCardStyle}>
                    
                    <div style={optionHeaderStyle}>
                      <span style={optionBadgeStyle}>Plato {oidx + 1}</span>
                      <button type="button" onClick={() => handleRemoveOption(idx, oidx)} style={removeOptionStyle}>
                        ✕
                      </button>
                    </div>

                    <div style={optionFieldsStyle}>
                      <input 
                        style={fieldInputStyle}
                        value={opt.nombre || ''} 
                        onChange={e => handleOptionChange(idx, oidx, 'nombre', e.target.value)} 
                        placeholder="Nombre del plato"
                      />

                      <input 
                        type="number" 
                        step="0.01"
                        style={fieldInputStyle}
                        value={opt.precio || 0} 
                        onChange={e => handleOptionChange(idx, oidx, 'precio', parseFloat(e.target.value) || 0)} 
                        placeholder="Precio"
                      />

                      <input 
                        style={fieldInputStyle}
                        value={opt.imagen || ''} 
                        onChange={e => handleOptionChange(idx, oidx, 'imagen', e.target.value)} 
                        placeholder="URL de imagen"
                      />
                      
                      {renderPreview(opt.imagen)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button type="submit" style={saveButtonStyle}>
            💾 Guardar Cambios
          </button>
        </form>
      </div>
    </div>
  );
}

// Estilos
const backdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.6)',
  zIndex: 3000,
  display: 'flex',
  justifyContent: 'flex-end',
  backdropFilter: 'blur(4px)'
};

const drawerStyle = {
  width: '450px',
  background: 'white',
  height: '100%',
  padding: '2rem',
  overflowY: 'auto',
  boxShadow: '-10px 0 30px rgba(0,0,0,0.2)'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const headerTitleStyle = {
  fontSize: '1.5rem',
  color: '#01400e',
  margin: 0
};

const closeButtonStyle = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: '#ef5350',
  color: 'white',
  border: 'none',
  fontSize: '1.5rem',
  cursor: 'pointer'
};

const addCategoryStyle = {
  width: '100%',
  padding: '1rem',
  background: '#f0f0f0',
  border: '2px dashed #01400e',
  borderRadius: '8px',
  color: '#01400e',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginBottom: '2rem'
};

const categoryCardStyle = {
  marginBottom: '2rem',
  padding: '1rem',
  border: '1px solid #eee',
  borderRadius: '12px'
};

const categoryHeaderStyle = {
  display: 'flex',
  gap: '0.5rem',
  marginBottom: '1rem',
  alignItems: 'center'
};

const categoryBadgeStyle = {
  background: '#01400e',
  color: 'white',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.7rem'
};

const categoryInputStyle = {
  flex: 1,
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '1rem'
};

const removeButtonStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1.1rem',
  cursor: 'pointer',
  color: '#999'
};

const optionsSectionStyle = {
  borderTop: '1px dashed #eee',
  paddingTop: '1rem'
};

const optionsHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '1rem'
};

const optionsTitleStyle = {
  fontWeight: 'bold',
  color: '#01400e'
};

const addOptionStyle = {
  background: 'none',
  border: '1px solid #01400e',
  color: '#01400e',
  padding: '0.3rem 0.8rem',
  borderRadius: '4px',
  cursor: 'pointer'
};

const optionCardStyle = {
  marginBottom: '1rem',
  padding: '1rem',
  background: '#f8f9fa',
  borderRadius: '8px'
};

const optionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '0.5rem'
};

const optionBadgeStyle = {
  background: '#666',
  color: 'white',
  padding: '0.2rem 0.5rem',
  borderRadius: '4px',
  fontSize: '0.7rem'
};

const removeOptionStyle = {
  background: 'none',
  border: 'none',
  fontSize: '1rem',
  cursor: 'pointer',
  color: '#999'
};

const optionFieldsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem'
};

const fieldInputStyle = {
  padding: '0.5rem',
  borderRadius: '4px',
  border: '1px solid #ddd',
  fontSize: '0.9rem'
};

const previewPlaceholderStyle = {
  height: '60px',
  background: '#f0f0f0',
  borderRadius: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  color: '#999'
};

const previewImageStyle = {
  width: '100%',
  height: '100px',
  objectFit: 'cover',
  borderRadius: '4px',
  marginTop: '0.5rem'
};

const saveButtonStyle = {
  width: '100%',
  padding: '1rem',
  background: 'linear-gradient(135deg, #01400e, #0a5a1a)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '2rem'
};