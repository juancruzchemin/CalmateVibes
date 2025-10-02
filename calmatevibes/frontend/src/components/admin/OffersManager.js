import React, { useState } from 'react';
import '../styles/OffersManager.css';

function OffersManager({ 
  catalogos, 
  ofertas = [], 
  onAddOferta, 
  onEditOferta, 
  onDeleteOferta 
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingOferta, setEditingOferta] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipoOferta: 'porcentaje', // porcentaje, precioFijo, dosxuno, segundoProducto
    valor: '',
    aplicarA: 'producto', // producto, categoria
    productosSeleccionados: [],
    categoriasSeleccionadas: [],
    fechaInicio: '',
    fechaFin: '',
    activa: true
  });

  const tiposOferta = [
    { value: 'porcentaje', label: 'Descuento %', icon: '🔥' },
    { value: 'precioFijo', label: 'Precio Fijo', icon: '💰' },
    { value: 'dosxuno', label: '2x1', icon: '🎁' },
    { value: 'segundoProducto', label: '% en 2do Producto', icon: '➕' }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProductSelection = (uniqueProductId, checked) => {
    setFormData(prev => ({
      ...prev,
      productosSeleccionados: checked 
        ? [...prev.productosSeleccionados, uniqueProductId]
        : prev.productosSeleccionados.filter(id => id !== uniqueProductId)
    }));
  };

  const handleCategorySelection = (categoryId, checked) => {
    setFormData(prev => ({
      ...prev,
      categoriasSeleccionadas: checked 
        ? [...prev.categoriasSeleccionadas, categoryId]
        : prev.categoriasSeleccionadas.filter(id => id !== categoryId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingOferta) {
      onEditOferta({ ...editingOferta, ...formData });
    } else {
      onAddOferta({ ...formData, id: Date.now() });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      tipoOferta: 'porcentaje',
      valor: '',
      aplicarA: 'producto',
      productosSeleccionados: [],
      categoriasSeleccionadas: [],
      fechaInicio: '',
      fechaFin: '',
      activa: true
    });
    setShowAddForm(false);
    setEditingOferta(null);
  };

  const handleEdit = (oferta) => {
    setEditingOferta(oferta);
    setFormData(oferta);
    setShowAddForm(true);
  };

  const getAllProducts = () => {
    return catalogos.flatMap(catalogo => 
      (catalogo.items || []).map(item => ({
        ...item,
        categoria: catalogo.nombre,
        catalogoId: catalogo.id
      }))
    );
  };

  // Obtener información completa del producto incluyendo imagen por defecto
  const getProductImageUrl = (producto) => {
    if (producto.imagenes && producto.imagenes.length > 0) {
      return producto.imagenes[0];
    }
    return '/placeholder.svg'; // imagen por defecto
  };

  // Determinar estado del stock
  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Sin stock', class: 'out-of-stock' };
    if (stock <= 5) return { label: 'Stock bajo', class: 'low-stock' };
    return { label: 'En stock', class: 'in-stock' };
  };

  const formatOfferValue = (oferta) => {
    switch (oferta.tipoOferta) {
      case 'porcentaje':
        return `${oferta.valor}% OFF`;
      case 'precioFijo':
        return `$${oferta.valor}`;
      case 'dosxuno':
        return '2x1';
      case 'segundoProducto':
        return `${oferta.valor}% OFF en 2do`;
      default:
        return oferta.valor;
    }
  };

  const getOfferDescription = (oferta) => {
    const productos = getAllProducts();
    if (oferta.aplicarA === 'categoria') {
      const categorias = oferta.categoriasSeleccionadas.map(id => 
        catalogos.find(cat => cat.id === id)?.nombre
      ).filter(Boolean);
      return `Aplica a: ${categorias.join(', ')}`;
    } else {
      const productosNombres = oferta.productosSeleccionados.map(uniqueId => {
        // Separar catalogoId e id del producto
        const [catalogoId, productId] = uniqueId.split('-');
        return productos.find(prod => prod.catalogoId === catalogoId && prod.id.toString() === productId)?.nombre;
      }).filter(Boolean);
      return `Aplica a: ${productosNombres.slice(0, 3).join(', ')}${productosNombres.length > 3 ? '...' : ''}`;
    }
  };

  return (
    <div className="offers-manager">
      <div className="offers-header">
        <h2>🔥 Gestión de Ofertas</h2>
        <button 
          className="btn-add-offer"
          onClick={() => setShowAddForm(true)}
        >
          ➕ Nueva Oferta
        </button>
      </div>

      {/* Lista de ofertas existentes */}
      <div className="offers-grid">
        {ofertas.map(oferta => (
          <div key={oferta.id} className={`offer-card ${!oferta.activa ? 'inactive' : ''}`}>
            <div className="offer-header">
              <h3 className="offer-name">{oferta.nombre}</h3>
              <div className="offer-value">
                {formatOfferValue(oferta)}
              </div>
            </div>
            
            <p className="offer-description">{oferta.descripcion}</p>
            <p className="offer-applies-to">{getOfferDescription(oferta)}</p>
            
            {oferta.fechaInicio && oferta.fechaFin && (
              <div className="offer-dates">
                📅 {new Date(oferta.fechaInicio).toLocaleDateString()} - {new Date(oferta.fechaFin).toLocaleDateString()}
              </div>
            )}
            
            <div className="offer-actions">
              <button 
                onClick={() => handleEdit(oferta)}
                className="btn-edit-offer"
              >
                ✏️ Editar
              </button>
              <button 
                onClick={() => onDeleteOferta(oferta.id)}
                className="btn-delete-offer"
              >
                🗑️ Eliminar
              </button>
              <button 
                onClick={() => onEditOferta({ ...oferta, activa: !oferta.activa })}
                className={`btn-toggle-offer ${oferta.activa ? 'active' : 'inactive'}`}
              >
                {oferta.activa ? '⏸️ Pausar' : '▶️ Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Formulario de agregar/editar oferta */}
      {showAddForm && (
        <div className="offer-form-overlay">
          <div className="offer-form">
            <div className="form-header">
              <h3>{editingOferta ? 'Editar Oferta' : 'Nueva Oferta'}</h3>
              <button 
                className="close-form"
                onClick={resetForm}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de la oferta *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ej: Super descuento de verano"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  placeholder="Describe los detalles de la oferta"
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de oferta *</label>
                  <select
                    name="tipoOferta"
                    value={formData.tipoOferta}
                    onChange={handleInputChange}
                    required
                  >
                    {tiposOferta.map(tipo => (
                      <option key={tipo.value} value={tipo.value}>
                        {tipo.icon} {tipo.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>
                    {formData.tipoOferta === 'porcentaje' || formData.tipoOferta === 'segundoProducto' 
                      ? 'Porcentaje de descuento' 
                      : formData.tipoOferta === 'precioFijo' 
                      ? 'Precio fijo' 
                      : 'Valor'}
                  </label>
                  {formData.tipoOferta !== 'dosxuno' && (
                    <input
                      type="number"
                      name="valor"
                      value={formData.valor}
                      onChange={handleInputChange}
                      placeholder={formData.tipoOferta === 'precioFijo' ? '0.00' : '0'}
                      step={formData.tipoOferta === 'precioFijo' ? '0.01' : '1'}
                      min="0"
                      max={formData.tipoOferta === 'porcentaje' || formData.tipoOferta === 'segundoProducto' ? '100' : undefined}
                      required
                    />
                  )}
                  {formData.tipoOferta === 'dosxuno' && (
                    <input type="text" value="2x1" disabled />
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Aplicar oferta a:</label>
                <div className="radio-group">
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="aplicarA"
                      value="producto"
                      checked={formData.aplicarA === 'producto'}
                      onChange={handleInputChange}
                    />
                    <span>Productos específicos</span>
                  </label>
                  <label className="radio-option">
                    <input
                      type="radio"
                      name="aplicarA"
                      value="categoria"
                      checked={formData.aplicarA === 'categoria'}
                      onChange={handleInputChange}
                    />
                    <span>Categorías completas</span>
                  </label>
                </div>
              </div>

              {/* Selección de productos */}
              {formData.aplicarA === 'producto' && (
                <div className="form-group">
                  <label>Seleccionar productos:</label>
                  <div className="products-selection-container">
                    <div className="products-grid-selection">
                      {getAllProducts().map(producto => {
                        const stockStatus = getStockStatus(producto.stock || 0);
                        const uniqueProductId = `${producto.catalogoId}-${producto.id}`;
                        return (
                          <div key={uniqueProductId} className="product-selection-card">
                            <label className="product-checkbox-label">
                              <input
                                type="checkbox"
                                checked={formData.productosSeleccionados.includes(uniqueProductId)}
                                onChange={(e) => handleProductSelection(uniqueProductId, e.target.checked)}
                                className="product-checkbox"
                              />
                              <div className="product-selection-content">
                                <div className="product-image-container">
                                  <img 
                                    src={getProductImageUrl(producto)} 
                                    alt={producto.nombre}
                                    className="product-selection-image"
                                    onError={(e) => {
                                      e.target.src = '/placeholder.svg';
                                    }}
                                  />
                                </div>
                                <div className="product-selection-info">
                                  <h4 className="product-selection-name">{producto.nombre}</h4>
                                  <div className="product-selection-details">
                                    <span className="product-price">${producto.precioVenta || 0}</span>
                                    <span className="product-category">{producto.categoria}</span>
                                  </div>
                                  <div className="product-stock-info">
                                    <span className={`stock-badge ${stockStatus.class}`}>
                                      {stockStatus.label}
                                    </span>
                                    <span className="stock-quantity">({producto.stock || 0} unidades)</span>
                                  </div>
                                </div>
                              </div>
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Selección de categorías */}
              {formData.aplicarA === 'categoria' && (
                <div className="form-group">
                  <label>Seleccionar categorías:</label>
                  <div className="selection-grid">
                    {catalogos.map(categoria => (
                      <label key={categoria.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          checked={formData.categoriasSeleccionadas.includes(categoria.id)}
                          onChange={(e) => handleCategorySelection(categoria.id, e.target.checked)}
                        />
                        <span>{categoria.nombre} ({categoria.items?.length || 0} productos)</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label>Fecha de inicio</label>
                  <input
                    type="date"
                    name="fechaInicio"
                    value={formData.fechaInicio}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Fecha de fin</label>
                  <input
                    type="date"
                    name="fechaFin"
                    value={formData.fechaFin}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="activa"
                    checked={formData.activa}
                    onChange={handleInputChange}
                  />
                  <span>Oferta activa</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn-cancel">
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingOferta ? 'Actualizar Oferta' : 'Crear Oferta'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersManager;