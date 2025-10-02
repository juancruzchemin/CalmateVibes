import React, { useState, useEffect } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import PedidosStats from '../components/admin/PedidosStats';
import PedidosFilters from '../components/admin/PedidosFilters';
import PedidosList from '../components/admin/PedidosList';
import PedidoDetail from '../components/admin/PedidoDetail';
import TrackingModal from '../components/admin/TrackingModal';
import ShippingModal from '../components/admin/ShippingModal';
import './styles/Pedidos.css';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Aplicar filtros
  useEffect(() => {
    applyFilters();
  }, [pedidos, filters]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      // Por ahora uso datos mock, después se conecta a la API real
      const mockPedidos = [
        {
          id: 1,
          numero: 'PED-2024-001',
          cliente: {
            nombre: 'Juan Pérez',
            email: 'juan@email.com',
            telefono: '+54 11 1234-5678'
          },
          productos: [
            { id: 1, nombre: 'Mate Calabaza Premium', cantidad: 2, precio: 15000 },
            { id: 2, nombre: 'Bombilla Alpaca', cantidad: 1, precio: 8000 }
          ],
          total: 38000,
          estado: 'pendiente',
          tipo: 'envio',
          fechaPedido: '2024-10-01',
          fechaEntrega: null,
          direccionEnvio: {
            calle: 'Av. Corrientes 1234',
            ciudad: 'Buenos Aires',
            provincia: 'CABA',
            codigoPostal: '1043'
          },
          tracking: null,
          notas: 'Cliente solicita entrega por la mañana'
        },
        {
          id: 2,
          numero: 'PED-2024-002',
          cliente: {
            nombre: 'María García',
            email: 'maria@email.com',
            telefono: '+54 11 9876-5432'
          },
          productos: [
            { id: 3, nombre: 'Set Mate Completo', cantidad: 1, precio: 25000 }
          ],
          total: 25000,
          estado: 'enviado',
          tipo: 'envio',
          fechaPedido: '2024-09-28',
          fechaEntrega: '2024-10-02',
          direccionEnvio: {
            calle: 'San Martín 567',
            ciudad: 'La Plata',
            provincia: 'Buenos Aires',
            codigoPostal: '1900'
          },
          tracking: 'AR123456789',
          notas: ''
        },
        {
          id: 3,
          numero: 'PED-2024-003',
          cliente: {
            nombre: 'Carlos López',
            email: 'carlos@email.com',
            telefono: '+54 11 5555-1234'
          },
          productos: [
            { id: 2, nombre: 'Bombilla Alpaca', cantidad: 1, precio: 8000 }
          ],
          total: 8000,
          estado: 'pendiente',
          tipo: 'devolucion',
          fechaPedido: '2024-10-01',
          fechaEntrega: null,
          direccionEnvio: null,
          tracking: null,
          notas: 'Producto llegó defectuoso, solicita cambio'
        }
      ];

      setPedidos(mockPedidos);
      setError(null);
    } catch (err) {
      setError('Error al cargar los pedidos');
      console.error('Error fetching pedidos:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
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

  const handleStatusUpdate = (pedidoId, newStatus) => {
    setPedidos(prevPedidos =>
      prevPedidos.map(pedido =>
        pedido.id === pedidoId ? { ...pedido, estado: newStatus } : pedido
      )
    );
    
    if (selectedPedido && selectedPedido.id === pedidoId) {
      setSelectedPedido(prev => ({ ...prev, estado: newStatus }));
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