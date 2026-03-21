import React, { useState } from 'react';
import EntregaPedido from './EntregaPedido';

export default function Acordeon({ 
  menuItems, 
  finishedOrders, 
  setFinishedOrders,
  pendingOrders, 
  log,
  addLog,
  total,
  onOpenDrawer,
  onOpenOrders,
  onOpenLog,
  onOpenPromos,
  onCierreJornada
}) {
  const [openSection, setOpenSection] = useState(null);

  const sections = [
    {
      id: 'caja',
      title: '💰 Caja Rápida',
      icon: '💰',
      badge: finishedOrders.length > 0 ? finishedOrders.length : null,
      badgeColor: '#27ae60',
      content: (
        <>
          <div style={styles.totalDisplay}>
            <span style={styles.totalLabel}>Total en caja:</span>
            <span style={styles.totalAmount}>${total.toFixed(2)}</span>
          </div>
          {finishedOrders.length > 0 ? (
            <EntregaPedido 
              finishedOrders={finishedOrders}
              setFinishedOrders={setFinishedOrders}
              addLog={addLog}
            />
          ) : (
            <p style={styles.sinPedidos}>✨ No hay pedidos pendientes de cobro</p>
          )}
        </>
      )
    },
    {
      id: 'menu',
      title: '📝 Menú del Día',
      icon: '📝',
      badge: menuItems.length,
      badgeColor: '#8b5cf6',
      content: (
        <>
          <p style={styles.cardDescription}>Configura Menú Diario y agrega precios e imágenes</p>
          <button style={styles.actionBtn} onClick={onOpenDrawer}>
            🚀 Editar Menú
          </button>
        </>
      )
    },
    {
      id: 'promos',
      title: '🏷️ Promociones',
      icon: '🏷️',
      badge: menuItems.filter(i => i.enOferta).length || null,
      badgeColor: '#FFB347',
      content: (
        <>
          <p style={styles.cardDescription}>Configura ofertas y descuentos especiales</p>
          <button style={styles.actionBtn} onClick={onOpenPromos}>
            🚀 Gestionar Promos
          </button>
        </>
      )
    },
    {
      id: 'comandas',
      title: '👨‍🍳 Comandas',
      icon: '👨‍🍳',
      badge: pendingOrders.length || null,
      badgeColor: '#FF8C42',
      content: null,
      onClick: onOpenOrders
    },
    {
      id: 'registro',
      title: '📊 Registro',
      icon: '📊',
      badge: log.length,
      badgeColor: '#95a5a6',
      content: (
        <>
          <p style={styles.cardDescription}>Auditoría de entradas y salidas</p>
          <button style={styles.actionBtn} onClick={onOpenLog}>
            📜 Ver Registro
          </button>
        </>
      )
    },
    {
      id: 'cierre',
      title: '⏰ Cierre de Turno',
      icon: '⏰',
      badge: null,
      content: (
        <>
          <p style={styles.cardDescription}>Calcula ventas y genera reporte</p>
          <div style={styles.resumenVentas}>
            <span>Ventas hoy:</span>
            <strong style={styles.ventasTotal}>
              ${log
                .filter(entry => entry.tipo === 'Entrada')
                .reduce((acc, entry) => {
                  const match = entry.detalle?.match(/\$(\d+\.?\d*)/);
                  return acc + (match ? parseFloat(match[1]) : 0);
                }, 0).toFixed(2)}
            </strong>
          </div>
          <button style={styles.cierreBtn} onClick={onCierreJornada}>
            📥 Finalizar Día
          </button>
        </>
      )
    }
  ];

  return (
    <div style={styles.acordeonContainer}>
      {sections.map((section) => (
        <div key={section.id} style={styles.itemAcordeon}>
          <button
            style={styles.acordeonHeader(openSection === section.id)}
            onClick={() => {
              if (section.onClick) {
                section.onClick();
              } else {
                setOpenSection(openSection === section.id ? null : section.id);
              }
            }}
          >
            <div style={styles.headerLeft}>
              <span style={styles.headerIcon}>{section.icon}</span>
              <span style={styles.headerTitle}>{section.title}</span>
            </div>
            
            <div style={styles.headerRight}>
              {section.badge && (
                <span style={styles.badge(section.badgeColor)}>
                  {section.badge}
                </span>
              )}
              {!section.onClick && (
                <span style={styles.chevron}>
                  {openSection === section.id ? '▼' : '▶'}
                </span>
              )}
            </div>
          </button>

          {!section.onClick && openSection === section.id && section.content && (
            <div style={styles.accordionContent}>
              {section.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  acordeonContainer: {
    width: '100%',
    maxWidth: '400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '1rem'
  },
  itemAcordeon: {
    background: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
    border: '1px solid rgba(255, 215, 0, 0.3)'
  },
  acordeonHeader: (isOpen) => ({
    width: '100%',
    padding: '1rem 1.2rem',
    background: isOpen ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
    border: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'background 0.2s ease'
  }),
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  headerIcon: {
    fontSize: '1.3rem'
  },
  headerTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#3d0a0a'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  badge: (color) => ({
    background: color,
    color: 'white',
    padding: '4px 10px',
    borderRadius: '30px',
    fontSize: '0.7rem',
    fontWeight: '700',
    minWidth: '24px',
    textAlign: 'center'
  }),
  chevron: {
    fontSize: '0.8rem',
    color: '#FFD700'
  },
  accordionContent: {
    padding: '1.2rem 1.5rem 1.5rem',
    background: 'rgba(0, 0, 0, 0.02)',
    borderTop: '1px solid rgba(255, 215, 0, 0.2)'
  },
  totalDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    background: 'white',
    borderRadius: '20px',
    marginBottom: '1rem',
    border: '1px solid rgba(255, 215, 0, 0.3)'
  },
  totalLabel: {
    color: '#666',
    fontWeight: '600',
    fontSize: '0.9rem'
  },
  totalAmount: {
    color: '#27ae60',
    fontSize: '1.6rem',
    fontWeight: '700'
  },
  cardDescription: {
    color: '#666',
    fontSize: '0.9rem',
    marginBottom: '1rem'
  },
  actionBtn: {
    width: '100%',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
    color: 'white'
  },
  sinPedidos: {
    textAlign: 'center',
    color: '#999',
    padding: '1.5rem',
    fontStyle: 'italic'
  },
  resumenVentas: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.8rem 1rem',
    background: 'white',
    borderRadius: '16px',
    marginBottom: '1rem'
  },
  ventasTotal: {
    color: '#ff3b30',
    fontSize: '1.1rem',
    fontWeight: '700'
  },
  cierreBtn: {
    background: 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
    color: 'white',
    width: '100%',
    padding: '0.8rem 1.5rem',
    borderRadius: '30px',
    border: 'none',
    fontWeight: '600',
    fontSize: '0.95rem',
    cursor: 'pointer'
  }
};
