import React from 'react';
import './styles/PedidosStats.css';

function PedidosStats({ pedidos, onFilterByStatus }) {
  // Calcular estadísticas basadas en los pedidos
  const stats = {
    pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
    enviados: pedidos.filter(p => p.estado === 'enviado').length,
    entregados: pedidos.filter(p => p.estado === 'entregado').length,
    total: pedidos.length
  };

  const handleStatClick = (estado) => {
    onFilterByStatus(estado);
  };

  return (
    <div className="pedidos-stats">
      <div className="stats-grid">
        <div 
          className="stat-card pendientes clickable"
          onClick={() => handleStatClick('pendiente')}
          title="Clic para filtrar pedidos pendientes"
        >
          <div className="stat-icon">
            <i className="bi bi-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.pendientes}</span>
            <span className="stat-label">Pendientes</span>
          </div>
        </div>

        <div 
          className="stat-card enviados clickable"
          onClick={() => handleStatClick('enviado')}
          title="Clic para filtrar pedidos enviados"
        >
          <div className="stat-icon">
            <i className="bi bi-truck"></i>
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.enviados}</span>
            <span className="stat-label">Enviados</span>
          </div>
        </div>

        <div 
          className="stat-card entregados clickable"
          onClick={() => handleStatClick('entregado')}
          title="Clic para filtrar pedidos entregados"
        >
          <div className="stat-icon">
            <i className="bi bi-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.entregados}</span>
            <span className="stat-label">Entregados</span>
          </div>
        </div>

        <div 
          className="stat-card total clickable"
          onClick={() => handleStatClick('todos')}
          title="Clic para mostrar todos los pedidos"
        >
          <div className="stat-icon">
            <i className="bi bi-box-seam"></i>
          </div>
          <div className="stat-content">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PedidosStats;