import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PedidosStats from '../components/admin/PedidosStats';
import PedidosFilters from '../components/admin/PedidosFilters';
import PedidosList from '../components/admin/PedidosList';
import PedidoDetail from '../components/admin/PedidoDetail';
import TrackingModal from '../components/admin/TrackingModal';
import ShippingModal from '../components/admin/ShippingModal';
import { useAuth } from '../context/AuthContext';
import pedidoService from '../services/pedidoService';
import './styles/Pedidos.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { token, isAdmin } = useAuth();

  // Estados para filtros
  const [filters, setFilters] = useState({
    estado: 'todos',
    fechaDesde: '',
    fechaHasta: '',
    busqueda: ''
  });

  // Cargar pedidos desde la API
  useEffect(() => {
    fetchPedidos();
  }, []);

  // Función para aplicar filtros
  const applyFilters = useCallback(() => {
    let filtered = [...pedidos];

    // Filtrar por estado
    if (filters.estado !== 'todos') {
      filtered = filtered.filter(pedido => pedido.estado === filters.estado);
    }

    // Filtrar por búsqueda (número de pedido, cliente, email)
    if (filters.busqueda) {
      const busqueda = filters.busqueda.toLowerCase();
      filtered = filtered.filter(pedido => 
        pedido.numero.toLowerCase().includes(busqueda) ||
        pedido.cliente.nombre.toLowerCase().includes(busqueda) ||
        pedido.cliente.email.toLowerCase().includes(busqueda)
      );
    }

    // Filtrar por fechas
    if (filters.fechaDesde) {
      filtered = filtered.filter(pedido => pedido.fechaPedido >= filters.fechaDesde);
    }
    if (filters.fechaHasta) {
      filtered = filtered.filter(pedido => pedido.fechaPedido <= filters.fechaHasta);
    }

    setFilteredPedidos(filtered);
  }, [pedidos, filters]);

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [pedidos, filters, applyFilters]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      
      if (!token) {
        setError('No estás autenticado');
        return;
      }

      if (!isAdmin) {
        setError('No tienes permisos de administrador');
        return;
      }

      // Conectar con la API real
      const response = await pedidoService.obtenerTodosPedidos(token);
      
      if (response.success) {
        // Transformar datos para que coincidan con el formato esperado por los componentes
        const pedidosTransformados = response.data.map(pedido => ({
          id: pedido._id,
          numero: pedido.numeroPedido,
          cliente: {
            nombre: `${pedido.usuario.nombre} ${pedido.usuario.apellido}`,
            email: pedido.usuario.email,
            telefono: pedido.usuario.telefono || 'No especificado'
          },
          productos: pedido.items.map(item => ({
            id: item.producto,
            nombre: item.nombre,
            cantidad: item.cantidad,
            precio: item.precioUnitario
          })),
          total: pedido.total,
          estado: pedido.estado,
          tipo: pedido.tipoEntrega || 'envio',
          fechaPedido: new Date(pedido.fechaPedido).toISOString().split('T')[0],
          fechaEntrega: pedido.fechaEntrega ? new Date(pedido.fechaEntrega).toISOString().split('T')[0] : null,
          direccionEnvio: pedido.direccionEnvio ? {
            calle: `${pedido.direccionEnvio.calle} ${pedido.direccionEnvio.numero}`,
            ciudad: pedido.direccionEnvio.ciudad,
            provincia: pedido.direccionEnvio.provincia,
            codigoPostal: pedido.direccionEnvio.codigoPostal
          } : null,
          tracking: pedido.tracking || null,
          notas: pedido.observaciones || ''
        }));

        setPedidos(pedidosTransformados);
        setError(null);
      } else {
        setError(response.message || 'Error al cargar los pedidos');
      }
    } catch (err) {
      console.error('Error fetching pedidos:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleFilterByStatus = (estado) => {
    setFilters(prev => ({
      ...prev,
      estado: estado
    }));
  };

  const handlePedidoSelect = (pedido) => {
    setSelectedPedido(pedido);
  };

  const handleStatusUpdate = async (pedidoId, newStatus) => {
    try {
      if (!token || !isAdmin) {
        setError('No tienes permisos para actualizar pedidos');
        return;
      }

      // Actualizar en el backend
      await pedidoService.actualizarEstadoPedido(pedidoId, newStatus, token);
      
      // Actualizar en el estado local
      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, estado: newStatus } : pedido
        )
      );
      
      if (selectedPedido && selectedPedido.id === pedidoId) {
        setSelectedPedido(prev => ({ ...prev, estado: newStatus }));
      }
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      setError(err.message || 'Error al actualizar el estado del pedido');
    }
  };

  const handleTrackingUpdate = (pedidoId, trackingNumber) => {
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id === pedidoId 
          ? { ...pedido, tracking: trackingNumber, estado: 'enviado' }
          : pedido
      )
    );
    
    if (selectedPedido && selectedPedido.id === pedidoId) {
      setSelectedPedido(prev => ({ 
        ...prev, 
        tracking: trackingNumber, 
        estado: 'enviado' 
      }));
    }
  };

  const handleCreateShipping = (pedidoId, shippingData) => {
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id === pedidoId 
          ? { 
              ...pedido, 
              tracking: shippingData.tracking,
              estado: 'enviado',
              fechaEntrega: shippingData.fechaEstimada
            }
          : pedido
      )
    );
  };

  if (loading) {
    return (
      <div className="pedidos-page">
        <Header />
        <div className="pedidos-container">
          <div className="loading">Cargando pedidos...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pedidos-page">
        <Header />
        <div className="pedidos-container">
          <div className="error">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="pedidos-page">
      <Header />
      <div className="pedidos-container">
        <div className="pedidos-header">
          <h1>Gestión de Pedidos</h1>
          <p>Administra envíos, devoluciones y tracking de pedidos</p>
        </div>

        <div className="pedidos-stats-row">
          <PedidosStats
            pedidos={pedidos}
            onFilterByStatus={handleFilterByStatus}
          />
        </div>

        <div className="pedidos-content">
          <div className="pedidos-left">
            <PedidosFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              totalPedidos={filteredPedidos.length}
            />
            
            <PedidosList
              pedidos={filteredPedidos}
              selectedPedido={selectedPedido}
              onPedidoSelect={handlePedidoSelect}
              onStatusUpdate={handleStatusUpdate}
            />
          </div>

          <div className="pedidos-right">
            {selectedPedido ? (
              <PedidoDetail
                pedido={selectedPedido}
                onStatusUpdate={handleStatusUpdate}
                onOpenTracking={() => setShowTrackingModal(true)}
                onOpenShipping={() => setShowShippingModal(true)}
              />
            ) : (
              <div className="no-selection">
                <h3>Selecciona un pedido</h3>
                <p>Elige un pedido de la lista para ver sus detalles y opciones de gestión.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showTrackingModal && selectedPedido && (
        <TrackingModal
          pedido={selectedPedido}
          onClose={() => setShowTrackingModal(false)}
          onTrackingUpdate={handleTrackingUpdate}
        />
      )}

      {showShippingModal && selectedPedido && (
        <ShippingModal
          pedido={selectedPedido}
          onClose={() => setShowShippingModal(false)}
          onCreateShipping={handleCreateShipping}
        />
      )}

      <Footer />
    </div>
  );
}

export default Pedidos;