import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import VentasDashboard from '../components/VentasDashboard';
import VentasFilters from '../components/VentasFilters';
import VentasProductList from '../components/VentasProductList';
import VentasExportModal from '../components/VentasExportModal';
import './styles/Ventas.css';
import '../styles/MobileUtilities.css';

function Ventas() {
  // Estados principales
  const [ventasData, setVentasData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de filtros
  const [dateRange, setDateRange] = useState('30days');
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' });
  const [productFilter, setProductFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados de UI
  const [showExportModal, setShowExportModal] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(null); // Commented out - not currently used
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  // Datos mock para desarrollo (posteriormente conectar con API)
  const mockVentasData = [
    {
      id: 1,
      productoId: 'MATE001',
      nombreProducto: 'Mate Imperial Calabaza',
      categoria: 'Mates',
      cantidadVendida: 15,
      precioCompra: 8000,
      precioVenta: 12000,
      margenGanancia: 4000,
      fechaVenta: '2025-01-15',
      estado: 'normal',
      accesos: 245
    },
    {
      id: 2,
      productoId: 'BOMB001',
      nombreProducto: 'Bombilla Alpaca Premium',
      categoria: 'Bombillas',
      cantidadVendida: 8,
      precioCompra: 5000,
      precioVenta: 8500,
      margenGanancia: 3500,
      fechaVenta: '2025-01-14',
      estado: 'normal',
      accesos: 180
    },
    {
      id: 3,
      productoId: 'YERB001',
      nombreProducto: 'Yerba Premium 1kg',
      categoria: 'Yerbas',
      cantidadVendida: 25,
      precioCompra: 2500,
      precioVenta: 4000,
      margenGanancia: 1500,
      fechaVenta: '2025-01-13',
      estado: 'devuelto',
      accesos: 320
    },
    {
      id: 4,
      productoId: 'MATE002',
      nombreProducto: 'Mate Virola Plata',
      categoria: 'Mates',
      cantidadVendida: 12,
      precioCompra: 15000,
      precioVenta: 22000,
      margenGanancia: 7000,
      fechaVenta: '2025-01-12',
      estado: 'defectuoso',
      accesos: 156
    },
    {
      id: 5,
      productoId: 'ACCE001',
      nombreProducto: 'Set Matero Completo',
      categoria: 'Accesorios',
      cantidadVendida: 6,
      precioCompra: 18000,
      precioVenta: 28000,
      margenGanancia: 10000,
      fechaVenta: '2025-01-11',
      estado: 'normal',
      accesos: 89
    }
  ];

  // Cargar datos al montar el componente
  useEffect(() => {
    setLoading(true);
    // Simular carga de datos
    setTimeout(() => {
      setVentasData(mockVentasData);
      setFilteredData(mockVentasData);
      setLoading(false);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let filtered = [...ventasData];

    // Filtro por rango de fechas
    if (dateRange !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case '7days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case '90days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'custom':
          if (customDateRange.start && customDateRange.end) {
            startDate = new Date(customDateRange.start);
            const endDate = new Date(customDateRange.end);
            filtered = filtered.filter(item => {
              const itemDate = new Date(item.fechaVenta);
              return itemDate >= startDate && itemDate <= endDate;
            });
          }
          break;
        default:
          break;
      }
      
      if (dateRange !== 'custom' && startDate) {
        filtered = filtered.filter(item => new Date(item.fechaVenta) >= startDate);
      }
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => item.estado === statusFilter);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productoId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset página al filtrar
  }, [ventasData, dateRange, customDateRange, statusFilter, searchTerm]);

  // Calcular métricas del dashboard
  const getDashboardMetrics = () => {
    const totalVentas = filteredData.reduce((sum, item) => sum + (item.cantidadVendida * item.precioVenta), 0);
    const totalCompras = filteredData.reduce((sum, item) => sum + (item.cantidadVendida * item.precioCompra), 0);
    const gananciaNeta = totalVentas - totalCompras;
    
    const productosVendidos = filteredData.reduce((sum, item) => sum + item.cantidadVendida, 0);
    const productosDefectuosos = filteredData.filter(item => item.estado === 'defectuoso').length;
    const productosDevueltos = filteredData.filter(item => item.estado === 'devuelto').length;
    
    // Top 5 productos más vendidos
    const productosMasVendidos = [...filteredData]
      .sort((a, b) => b.cantidadVendida - a.cantidadVendida)
      .slice(0, 5);
    
    // Top 5 productos más accedidos
    const productosMasAccedidos = [...filteredData]
      .sort((a, b) => b.accesos - a.accesos)
      .slice(0, 5);

    return {
      totalVentas,
      totalCompras,
      gananciaNeta,
      productosVendidos,
      productosDefectuosos,
      productosDevueltos,
      productosMasVendidos,
      productosMasAccedidos
    };
  };

  // Handlers
  // const handleProductClick = (product) => {
  //   setSelectedProduct(product);
  // };

  const handleExport = (format) => {
    console.log(`Exportando en formato: ${format}`);
    // Implementar lógica de exportación
    setShowExportModal(false);
  };

  const handleDateRangeChange = (range, customRange = null) => {
    setDateRange(range);
    if (customRange) {
      setCustomDateRange(customRange);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="ventas-page safe-top safe-bottom">
          <div className="loading-container mobile-loading">
            <div className="loading-spinner mobile-loading-spinner"></div>
            <p className="mobile-text-md">Cargando datos de ventas...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="ventas-page safe-top safe-bottom">
        <div className="ventas-container mobile-container">
          {/* Header de la página */}
          <div className="ventas-header">
            <h1 className="ventas-title">📊 Dashboard de Ventas</h1>
            <div className="ventas-header-actions">
              <button 
                className="btn-export touch-button touch-friendly-large no-select"
                onClick={() => setShowExportModal(true)}
                aria-label="Exportar reporte de ventas"
              >
                📥 Exportar Reporte
              </button>
            </div>
          </div>

          {/* Dashboard principal */}
          <VentasDashboard 
            metrics={getDashboardMetrics()}
            data={filteredData}
            // onProductClick={handleProductClick}
          />

          {/* Filtros */}
          <VentasFilters
            dateRange={dateRange}
            customDateRange={customDateRange}
            productFilter={productFilter}
            statusFilter={statusFilter}
            searchTerm={searchTerm}
            onDateRangeChange={handleDateRangeChange}
            onProductFilterChange={setProductFilter}
            onStatusFilterChange={setStatusFilter}
            onSearchChange={setSearchTerm}
            totalResults={filteredData.length}
          />

          {/* Lista de productos */}
          <VentasProductList
            products={currentItems}
            // onProductClick={handleProductClick}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredData.length}
          />

          {/* Modal de exportación */}
          {showExportModal && (
            <VentasExportModal
              onClose={() => setShowExportModal(false)}
              onExport={handleExport}
              dataCount={filteredData.length}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default Ventas;