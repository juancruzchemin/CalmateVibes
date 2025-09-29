import React from 'react';
import './styles/SimpleItemForm.css';

function SimpleItemForm({ 
  formData, 
  attributeData = {},
  onInputChange, 
  onImageUpload, 
  onImageRemove, 
  onSubmit, 
  onPreview, 
  catalogos, 
  onCatalogChange,
  availableAttributes = {},
  onAttributeChange
}) {
  // Función para obtener etiquetas más legibles para los atributos
  const getAttributeLabel = (attrName) => {
    const labels = {
      'tipo': 'Tipo',
      'material': 'Material',
      'materialInterno': 'Material Interno',
      'tamaño': 'Tamaño',
      'tamañoInterno': 'Tamaño Interno',
      'virola': 'Virola',
      'terminacion': 'Terminación',
      'grabado': 'Grabado',
      'descripcionDelGrabado': 'Descripción del Grabado',
      'base': 'Base',
      'color': 'Color'
    };
    return labels[attrName] || attrName.charAt(0).toUpperCase() + attrName.slice(1);
  };
  return (
    <form onSubmit={onSubmit} className="simple-item-form">
      <div className="form-section">
        <h3>Información Básica</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre del Producto *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={onInputChange}
              placeholder="Ingrese el nombre del producto"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="catalogo">Categoría *</label>
            <select
              id="catalogo"
              name="catalogo"
              value={formData.catalogo}
              onChange={onCatalogChange}
              required
            >
              <option value="">Seleccionar categoría</option>
              {catalogos.map((catalogo) => (
                <option key={catalogo.id} value={catalogo.id}>
                  {catalogo.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={onInputChange}
            placeholder="Describe el producto..."
            rows="3"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Precios y Stock</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="precioVenta">Precio de Venta *</label>
            <input
              type="number"
              id="precioVenta"
              name="precioVenta"
              value={formData.precioVenta}
              onChange={onInputChange}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={onInputChange}
              placeholder="0"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Configuración específica para Combos */}
      {formData.catalogo === 'combos' && (
        <div className="form-section">
          <h3>Productos del Combo</h3>
          <div className="combo-selector">
            <div className="form-group">
              <label htmlFor="selectedMate">Mate:</label>
              <select 
                id="selectedMate"
                name="selectedMate"
                value={attributeData.selectedMate || ''}
                onChange={(e) => onAttributeChange && onAttributeChange('selectedMate', e.target.value)}
              >
                <option value="">Seleccionar mate</option>
                {catalogos.find(cat => cat.id === 'mates')?.items?.map(mate => (
                  <option key={mate.id} value={mate.id}>
                    {mate.nombre} - ${mate.precioVenta}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="selectedBombilla">Bombilla:</label>
              <select 
                id="selectedBombilla"
                name="selectedBombilla"
                value={attributeData.selectedBombilla || ''}
                onChange={(e) => onAttributeChange && onAttributeChange('selectedBombilla', e.target.value)}
              >
                <option value="">Seleccionar bombilla</option>
                {catalogos.find(cat => cat.id === 'bombillas')?.items?.map(bombilla => (
                  <option key={bombilla.id} value={bombilla.id}>
                    {bombilla.nombre} - ${bombilla.precioVenta}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="comboQuantity">Cantidad de cada producto:</label>
              <input
                type="number"
                id="comboQuantity"
                name="comboQuantity"
                min="1"
                value={attributeData.comboQuantity || 1}
                onChange={(e) => onAttributeChange && onAttributeChange('comboQuantity', parseInt(e.target.value) || 1)}
                placeholder="1"
              />
            </div>
            
            {/* Mostrar precio sugerido */}
            {attributeData.selectedMate && attributeData.selectedBombilla && (
              <div className="combo-price-suggestion">
                <h4>Precio Sugerido del Combo:</h4>
                <p className="suggested-price">
                  ${(() => {
                    const mate = catalogos.find(cat => cat.id === 'mates')?.items?.find(item => item.id === attributeData.selectedMate);
                    const bombilla = catalogos.find(cat => cat.id === 'bombillas')?.items?.find(item => item.id === attributeData.selectedBombilla);
                    const quantity = attributeData.comboQuantity || 1;
                    if (mate && bombilla) {
                      const totalIndividual = (mate.precioVenta + bombilla.precioVenta) * quantity;
                      const discountedPrice = Math.floor(totalIndividual * 0.9); // 10% descuento
                      return discountedPrice;
                    }
                    return 0;
                  })()}
                </p>
                <small>
                  Precio individual: ${(() => {
                    const mate = catalogos.find(cat => cat.id === 'mates')?.items?.find(item => item.id === attributeData.selectedMate);
                    const bombilla = catalogos.find(cat => cat.id === 'bombillas')?.items?.find(item => item.id === attributeData.selectedBombilla);
                    const quantity = attributeData.comboQuantity || 1;
                    if (mate && bombilla) {
                      return (mate.precioVenta + bombilla.precioVenta) * quantity;
                    }
                    return 0;
                  })()} (10% descuento aplicado)
                </small>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Atributos específicos para otras categorías */}
      {formData.catalogo && formData.catalogo !== 'combos' && availableAttributes && Object.keys(availableAttributes).length > 0 && (
        <div className="form-section">
          <h3>Atributos Específicos</h3>
          <div className="attributes-grid">
            {Object.entries(availableAttributes).map(([attrName, values]) => (
              <div key={attrName} className="form-group">
                <label htmlFor={attrName}>{getAttributeLabel(attrName)}:</label>
                <select 
                  id={attrName}
                  name={attrName}
                  value={attributeData[attrName] || ''}
                  onChange={(e) => onAttributeChange && onAttributeChange(attrName, e.target.value)}
                >
                  <option value="">Seleccionar {getAttributeLabel(attrName).toLowerCase()}</option>
                  {values.map(value => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="form-section">
        <h3>Imágenes</h3>
        
        <div className="form-group">
          <label htmlFor="imagenes">Subir Imágenes</label>
          <input
            type="file"
            id="imagenes"
            name="imagenes"
            multiple
            accept="image/*"
            onChange={onImageUpload}
            className="file-input"
          />
        </div>

        {formData.imagenes && formData.imagenes.length > 0 && (
          <div className="image-preview-container">
            <h4>Imágenes Subidas:</h4>
            <div className="image-preview-grid">
              {formData.imagenes.map((imagen, index) => (
                <div key={index} className="image-preview-item">
                  <img src={imagen} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => onImageRemove(index)}
                    title="Eliminar imagen"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPreview} className="preview-btn">
          Vista Previa
        </button>
        <button type="submit" className="submit-btn">
          Agregar Producto
        </button>
      </div>
    </form>
  );
}

export default SimpleItemForm;