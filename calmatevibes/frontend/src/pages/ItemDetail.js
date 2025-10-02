import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/layout/Header.js';
import Footer from '../components/layout/Footer.js';
import Notification from '../components/ui/Notification.js'; // Importa el componente Notification
import { CarritoContext } from '../context/CarritoContext.js';
import './styles/ItemDetail.css';

function ItemDetail() {
  const { catalogoId, itemId } = useParams();
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('materiales');
  const [cantidad, setCantidad] = useState(1);
  const [showNotification, setShowNotification] = useState(false); // Estado para controlar la notificación
  const { agregarAlCarrito } = useContext(CarritoContext);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const data = await import(`../data/catalogo-${catalogoId}.json`);
        setCatalogo(data);
      } catch (err) {
        console.error('Error al cargar el catálogo:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogo();
  }, [catalogoId]);

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!catalogo || !catalogo.items) {
    return <p>El catálogo no está disponible.</p>;
  }

  const item = catalogo.items.find((item) => item.id === itemId);

  if (!item) {
    return <p>Item no encontrado.</p>;
  }

  const handleAgregarAlCarrito = () => {
    if (cantidad > 0) {
      agregarAlCarrito({ ...item, cantidad });
      setShowNotification(true); // Muestra la notificación
    }
  };

  return (
    <div className="item-detail-page">
      <Header />
      <div className="item-detail">
        <div className="item-detail-image">
          <img src={item.imagen} alt={item.nombre} />
        </div>
        <div className="item-detail-info">
          <h1 className="item-detail-title">{item.nombre}</h1>
          <p className="item-detail-price">${item.precioVenta}</p>

          {/* Descripción */}
          <div className="item-detail-section">
            <h2 className="item-detail-section-title">Descripción</h2>
            <p className="item-detail-description">{item.descripcion}</p>
          </div>

          {/* Tabs */}
          <div className="item-detail-tabs">
            <button
              className={`item-detail-tab ${activeTab === 'materiales' ? 'active' : ''}`}
              onClick={() => setActiveTab('materiales')}
            >
              Materiales
            </button>
            <button
              className={`item-detail-tab ${activeTab === 'detalles' ? 'active' : ''}`}
              onClick={() => setActiveTab('detalles')}
            >
              Detalles técnicos
            </button>
          </div>

          {/* Contenido de los tabs */}
          {activeTab === 'materiales' && (
            <div className="item-detail-tab-content">
              <p className="item-detail-material"><strong>Material:</strong> {item.material}</p>
              <p className="item-detail-material-interno"><strong>Material interno:</strong> {item.materialInterno}</p>
            </div>
          )}
          {activeTab === 'detalles' && (
            <div className="item-detail-tab-content">
              <p className="item-detail-tamaño"><strong>Tamaño:</strong> {item.tamaño}</p>
              <p className="item-detail-virola"><strong>Virola:</strong> {item.virola}</p>
              <p className="item-detail-terminacion"><strong>Terminación:</strong> {item.terminacion}</p>
              <p className="item-detail-grabado"><strong>Grabado:</strong> {item.grabado}</p>
              <p className="item-detail-grabado-descripcion"><strong>Descripción del grabado:</strong> {item.grabadoDescripcion}</p>
              <p className="item-detail-base"><strong>Base:</strong> {item.base}</p>
              <p className="item-detail-color"><strong>Color:</strong> {item.color}</p>
            </div>
          )}

          {/* Botones */}
          <div className="item-detail-buttons">
            <div className="item-detail-add-to-cart">
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={(e) => setCantidad(Number(e.target.value))}
                className="item-detail-quantity-input"
              />
              <button className="item-detail-button secondary" onClick={handleAgregarAlCarrito}>
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notificación */}
      {showNotification && (
        <Notification
          message="¡Producto agregado al carrito!"
          onClose={() => setShowNotification(false)}
        />
      )}

      <Footer />
    </div>
  );
}

export default ItemDetail;