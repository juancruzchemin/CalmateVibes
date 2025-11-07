import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './styles/MisPedidos.css';

function MisPedidos() {
  const { user, getAuthHeaders, isAuthenticated } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMisPedidos();
    }
  }, [isAuthenticated, user]);

  const fetchMisPedidos = async () => {
    try {
      setLoading(true);
      setError(null);

      // Llamada a la API para obtener los pedidos del usuario logueado
      const response = await fetch('http://localhost:5001/api/pedidos/mis-pedidos', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        if (response.status === 404) {
          // Usuario no tiene pedidos
          setPedidos([]);
          return;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        // Transformar los datos de la API al formato que espera el componente
        const pedidosFormateados = data.data.map(pedido => ({
          id: pedido._id,
          numero: pedido.numeroPedido,
          fecha: pedido.fechaPedido,
          estado: pedido.estado,
          total: pedido.total,
          productos: pedido.items.map(item => ({
            id: item.producto._id || item.producto,
            nombre: item.nombre || item.producto?.nombre || 'Producto',
            cantidad: item.cantidad,
            precio: item.precioUnitario,
            imagen: item.producto?.imagenes?.[0]?.url || item.imagen || '/placeholder.svg'
          })),
          direccionEnvio: pedido.datosContacto?.direccion ? {
            calle: pedido.datosContacto.direccion.calle,
            ciudad: pedido.datosContacto.direccion.ciudad,
            provincia: pedido.datosContacto.direccion.provincia,
            codigoPostal: pedido.datosContacto.direccion.codigoPostal
          } : null,
          tracking: pedido.envio?.numeroTracking || null,
          fechaEntrega: pedido.fechaEntrega || null,
          fechaEntregaEstimada: pedido.fechaEntregaEstimada || null,
          metodoPago: pedido.metodoPago?.tipo ? 
            (pedido.metodoPago.tipo === 'tarjeta' ? 'Tarjeta de Crédito' :
             pedido.metodoPago.tipo === 'transferencia' ? 'Transferencia Bancaria' :
             pedido.metodoPago.tipo === 'mercadopago' ? 'MercadoPago' :
             pedido.metodoPago.tipo === 'efectivo' ? 'Efectivo' : 'Método de Pago'
            ) : 'No especificado',
          envio: pedido.envio?.costo || 0
        }));

        setPedidos(pedidosFormateados);
      } else {
        throw new Error(data.message || 'Error al cargar los pedidos');
      }

    } catch (err) {
      console.error('Error fetching pedidos:', err);
      
      if (err.message.includes('Failed to fetch') || err.message.includes('Network')) {
        setError('Error de conexión. Verifica tu conexión a internet.');
      } else {
        setError(err.message || 'Error al cargar tus pedidos');
      }
      
      // En caso de error, mostrar datos mock para desarrollo
      if (process.env.NODE_ENV === 'development') {
        setPedidos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'procesando': return '#ffc107';
      case 'enviado': return '#007bff';
      case 'entregado': return '#28a745';
      case 'cancelado': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'procesando': return 'bi-clock-history';
      case 'enviado': return 'bi-truck';
      case 'entregado': return 'bi-check-circle';
      case 'cancelado': return 'bi-x-circle';
      default: return 'bi-question-circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  const filteredPedidos = pedidos.filter(pedido =>
    pedido.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pedido.productos.some(producto => 
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Mostrar loading mientras se verifica la autenticación o se cargan los pedidos
  if (loading || !isAuthenticated) {
    return (
      <div className="mis-pedidos-wrapper">
        <Header />
        <div className="mis-pedidos-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>{!isAuthenticated ? 'Verificando autenticación...' : 'Cargando tus pedidos...'}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mis-pedidos-wrapper">
        <Header />
        <div className="mis-pedidos-container">
          <div className="error-message">
            <i className="bi bi-exclamation-triangle"></i>
            <p>{error}</p>
            <button onClick={fetchMisPedidos} className="retry-btn">
              Reintentar
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="mis-pedidos-wrapper">
      <Header />
      
      <div className="mis-pedidos-container">
        <div className="mis-pedidos-header">
          <div className="header-content">
            <div className="header-text">
              <h1>
                Mis Pedidos
              </h1>
              <p>Aquí puedes ver el estado y detalles de todos tus pedidos, {user?.nombre}</p>
            </div>
            <button 
              className="refresh-btn"
              onClick={fetchMisPedidos}
              disabled={loading}
              title="Actualizar pedidos"
            >
              <i className="bi bi-arrow-clockwise"></i>
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Buscar por número de pedido o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {filteredPedidos.length === 0 ? (
          <div className="no-pedidos">
            <i className="bi bi-bag-x"></i>
            <h3>
              {searchTerm 
                ? `No se encontraron pedidos que coincidan con "${searchTerm}"` 
                : pedidos.length === 0 
                ? `¡Hola ${user?.nombre}! No tienes pedidos aún` 
                : 'No se encontraron pedidos'
              }
            </h3>
            <p>
              {searchTerm 
                ? 'Intenta con otros términos de búsqueda' 
                : '¡Explora nuestros productos y realiza tu primer pedido!'
              }
            </p>
            {!searchTerm && (
              <a href="/catalog" className="btn-primary">
                Ver Catálogo
              </a>
            )}
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="btn-secondary"
              >
                Limpiar Búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="pedidos-grid">
            {filteredPedidos.map(pedido => (
              <div key={pedido.id} className="pedido-card">
                <div className="pedido-header">
                  <div className="pedido-info">
                    <h3>#{pedido.numero}</h3>
                    <span className="pedido-fecha">{formatDate(pedido.fecha)}</span>
                  </div>
                  <div 
                    className="pedido-estado"
                    style={{ color: getEstadoColor(pedido.estado) }}
                  >
                    <i className={`bi ${getEstadoIcon(pedido.estado)}`}></i>
                    <span>{pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}</span>
                  </div>
                </div>

                <div className="pedido-productos">
                  {pedido.productos.map(producto => (
                    <div key={producto.id} className="producto-item">
                      <div className="producto-imagen">
                        <img 
                          src={producto.imagen || '/placeholder.svg'} 
                          alt={producto.nombre}
                          onError={(e) => {
                            e.target.src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="producto-info">
                        <h4>{producto.nombre}</h4>
                        <span className="producto-cantidad">Cantidad: {producto.cantidad}</span>
                        <span className="producto-precio">{formatPrice(producto.precio)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pedido-resumen">
                  <div className="resumen-item">
                    <span>Subtotal:</span>
                    <span>{formatPrice(pedido.total - pedido.envio)}</span>
                  </div>
                  {pedido.envio > 0 && (
                    <div className="resumen-item">
                      <span>Envío:</span>
                      <span>{formatPrice(pedido.envio)}</span>
                    </div>
                  )}
                  <div className="resumen-item total">
                    <span>Total:</span>
                    <span>{formatPrice(pedido.total)}</span>
                  </div>
                </div>

                {pedido.tracking && (
                  <div className="tracking-info">
                    <i className="bi bi-geo-alt"></i>
                    <span>Código de seguimiento: <strong>{pedido.tracking}</strong></span>
                  </div>
                )}

                <div className="pedido-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => setSelectedPedido(pedido)}
                  >
                    <i className="bi bi-eye"></i>
                    Ver Detalles
                  </button>
                  
                  {pedido.tracking && (
                    <a 
                      href={`https://www.correoargentino.com.ar/formularios/ondnc?codigo=${pedido.tracking}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <i className="bi bi-truck"></i>
                      Rastrear Envío
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de detalles */}
      {selectedPedido && (
        <div className="modal-overlay" onClick={() => setSelectedPedido(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Pedido #{selectedPedido.numero}</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedPedido(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-section">
                <h3>Estado del Pedido</h3>
                <div 
                  className="estado-badge"
                  style={{ backgroundColor: getEstadoColor(selectedPedido.estado) }}
                >
                  <i className={`bi ${getEstadoIcon(selectedPedido.estado)}`}></i>
                  {selectedPedido.estado.charAt(0).toUpperCase() + selectedPedido.estado.slice(1)}
                </div>
              </div>

              <div className="detail-section">
                <h3>Información del Pedido</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Fecha:</span>
                    <span>{formatDate(selectedPedido.fecha)}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Método de Pago:</span>
                    <span>{selectedPedido.metodoPago}</span>
                  </div>
                  {selectedPedido.fechaEntrega && (
                    <div className="info-item">
                      <span className="label">Fecha de Entrega:</span>
                      <span>{formatDate(selectedPedido.fechaEntrega)}</span>
                    </div>
                  )}
                  {selectedPedido.fechaEntregaEstimada && !selectedPedido.fechaEntrega && (
                    <div className="info-item">
                      <span className="label">Entrega Estimada:</span>
                      <span>{formatDate(selectedPedido.fechaEntregaEstimada)}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="detail-section">
                <h3>Dirección de Envío</h3>
                <div className="direccion-info">
                  <p>{selectedPedido.direccionEnvio.calle}</p>
                  <p>{selectedPedido.direccionEnvio.ciudad}, {selectedPedido.direccionEnvio.provincia}</p>
                  <p>CP: {selectedPedido.direccionEnvio.codigoPostal}</p>
                </div>
              </div>

              <div className="detail-section">
                <h3>Productos</h3>
                <div className="productos-detalle">
                  {selectedPedido.productos.map(producto => (
                    <div key={producto.id} className="producto-detalle-item">
                      <img 
                        src={producto.imagen || '/placeholder.svg'} 
                        alt={producto.nombre}
                        onError={(e) => {
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                      <div className="producto-detalle-info">
                        <h4>{producto.nombre}</h4>
                        <p>Cantidad: {producto.cantidad}</p>
                        <p className="precio">{formatPrice(producto.precio)} c/u</p>
                      </div>
                      <div className="producto-total">
                        {formatPrice(producto.precio * producto.cantidad)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <h3>Resumen de Pago</h3>
                <div className="pago-resumen">
                  <div className="pago-item">
                    <span>Subtotal:</span>
                    <span>{formatPrice(selectedPedido.total - selectedPedido.envio)}</span>
                  </div>
                  <div className="pago-item">
                    <span>Envío:</span>
                    <span>{selectedPedido.envio > 0 ? formatPrice(selectedPedido.envio) : 'Gratis'}</span>
                  </div>
                  <div className="pago-item total">
                    <span>Total:</span>
                    <span>{formatPrice(selectedPedido.total)}</span>
                  </div>
                </div>
              </div>

              {selectedPedido.tracking && (
                <div className="detail-section">
                  <h3>Información de Envío</h3>
                  <div className="tracking-detail">
                    <p><strong>Código de seguimiento:</strong> {selectedPedido.tracking}</p>
                    <a 
                      href={`https://www.correoargentino.com.ar/formularios/ondnc?codigo=${selectedPedido.tracking}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <i className="bi bi-truck"></i>
                      Rastrear en Correo Argentino
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default MisPedidos;