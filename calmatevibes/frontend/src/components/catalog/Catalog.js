import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Paginador from './Paginador.js';
import Filtros from './Filtros.js';
import Ordenador from './Ordenador.js';
import Notification from '../ui/Notification.js';
import CategorySelector from './CategorySelector.js';
import MobileFilters from './MobileFilters.js';
import { CarritoContext } from '../../context/CarritoContext.js';
import '../styles/Catalog.css';

function Catalogo({ catalogo, hideFiltersButton = false, filteredItems = [], onItemsChange }) {
  const [items, setItems] = useState(catalogo.items);
  const [currentPage, setCurrentPage] = useState(1);
  const [cantidades, setCantidades] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [hoveredItemId, setHoveredItemId] = useState(null); // Estado para manejar el hover
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false); // Estado para el sidebar móvil
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const itemsToShow = filteredItems.length > 0 ? filteredItems : catalogo.items;
    setItems(itemsToShow);
    setCurrentPage(1);

    const cantidadesIniciales = catalogo.items.reduce((acc, item) => {
      acc[item.id] = 1;
      return acc;
    }, {});
    setCantidades(cantidadesIniciales);
  }, [catalogo, filteredItems]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemClick = (itemId) => {
    navigate(`/item/${catalogo.nombre}/${itemId}`);
  };

  const handleCantidadChange = (itemId, nuevaCantidad) => {
    setCantidades((prevCantidades) => ({
      ...prevCantidades,
      [itemId]: nuevaCantidad,
    }));
  };

  const handleAgregarAlCarrito = (item) => {
    const cantidad = cantidades[item.id];
    if (cantidad > 0) {
      agregarAlCarrito({ ...item, cantidad });
      setNotificationMessage(`¡${item.nombre} agregado al carrito!`);
      setShowNotification(true);
    }
  };

  const handleMouseEnter = (itemId) => {
    setHoveredItemId(itemId); // Establece el ID del ítem que está siendo hovered
  };

  const handleMouseLeave = () => {
    setHoveredItemId(null); // Resetea el hover cuando el mouse sale del ítem
  };

  return (
    <div className="catalogo">
      {/* Controles para desktop */}
      <div className="catalogo-controls desktop-controls">
        <Filtros items={catalogo.items} onFilter={setItems} />
        <div className="controls-row">
          <CategorySelector currentCategory={catalogo.nombre} />
          <Ordenador items={items} onSort={setItems} />
        </div>
      </div>

      {/* Botón para abrir filtros en móvil - solo si no está oculto */}
      {!hideFiltersButton && (
        <>
          <div className="mobile-filters-trigger">
            <button 
              className="mobile-filters-button"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M4 6H20M4 12H16M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="button-text-full">Filtros y Ordenar</span>
              <span className="button-text-short">Filtros</span>
            </button>
          </div>

          {/* Sidebar móvil */}
          <MobileFilters
            isOpen={isMobileFiltersOpen}
            onClose={() => setIsMobileFiltersOpen(false)}
            catalogoItems={catalogo.items}
            currentItems={items}
            currentCategory={catalogo.nombre}
            onFilter={onItemsChange || setItems}
            onSort={onItemsChange || setItems}
          />
        </>
      )}

      <div className="catalogo-items">
        {currentItems.map((item, idx) => (
          <div
            className="catalogo-item"
            key={idx}
            onMouseEnter={() => handleMouseEnter(item.id)}
            onMouseLeave={handleMouseLeave}
          >
            {/* Badge de estado */}
            {item.estado && (
              <div className={`product-badge ${item.estado.toLowerCase().replace(' ', '-')}`}>
                {item.estado}
              </div>
            )}

            {/* Container de imagen */}
            <div 
              className="catalogo-item-image-container"
              onClick={() => handleItemClick(item.id)}
            >
              <img
                src={hoveredItemId === item.id && item.imagenHover ? item.imagenHover : item.imagen}
                alt={item.nombre}
                className="catalogo-item-image"
                loading="lazy"
              />
            </div>

            {/* Información del producto */}
            <div className="catalogo-item-content">
              <div className="catalogo-item-info">
                {/* Precio */}
                <div className="catalogo-item-price">
                  ${item.precioVenta}
                </div>

                {/* Nombre del producto */}
                <h3 className="catalogo-item-title" onClick={() => handleItemClick(item.id)}>
                  {item.nombre}
                </h3>

                {/* Categoría/Subcategoría */}
                <div className="catalogo-item-category">
                  {item.categoria || 'Mates y Accesorios'}
                </div>

                {/* Colores disponibles */}
                {item.colores && (
                  <div className="catalogo-item-colors">
                    {item.colores} colores
                  </div>
                )}

                {/* Estado adicional */}
                {item.estadoVenta && (
                  <div className="catalogo-item-status">
                    {item.estadoVenta}
                  </div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="catalogo-item-actions">
                <div className="quantity-controls">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleCantidadChange(item.id, Math.max(1, cantidades[item.id] - 1))}
                  >
                    -
                  </button>
                  <span className="quantity-display">{cantidades[item.id] || 1}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleCantidadChange(item.id, cantidades[item.id] + 1)}
                  >
                    +
                  </button>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => handleAgregarAlCarrito(item)}
                >
                  Comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Paginador
        totalItems={items.length}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {showNotification && (
        <Notification
          message={notificationMessage}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
}

export default Catalogo;