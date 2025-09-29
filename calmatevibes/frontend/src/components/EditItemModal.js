import React, { useState, useEffect } from 'react';
import './styles/EditItemModal.css';

function EditItemModal({ 
  item, 
  isOpen, 
  onClose, 
  onSave,
  categories = []
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioVenta: '',
    stock: 0,
    categoria: '',
    imagen: '',
    imagenHover: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Cargar datos del item cuando se abre el modal
  useEffect(() => {
    if (item && isOpen) {
      setFormData({
        nombre: item.nombre || '',
        descripcion: item.descripcion || '',
        precioVenta: item.precioVenta || '',
        stock: item.stock || 0,
        categoria: item.categoria || '',
        imagen: item.imagen || '',
        imagenHover: item.imagenHover || ''
      });
      setErrors({});
    }
  }, [item, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error específico cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (!formData.precioVenta || formData.precioVenta <= 0) {
      newErrors.precioVenta = 'El precio debe ser mayor a 0';
    }
    
    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updatedItem = {
        ...item,
        ...formData,
        precioVenta: parseFloat(formData.precioVenta),
        stock: parseInt(formData.stock)
      };
      
      await onSave(updatedItem);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
      setErrors({ submit: 'Error al guardar los cambios' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <div className="edit-modal-header">
          <h2>Editar Item</h2>
          <button 
            className="close-btn"
            onClick={handleCancel}
            type="button"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className={errors.nombre ? 'error' : ''}
                placeholder="Nombre del producto"
              />
              {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="categoria">Categoría</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.nombre}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descripcion">Descripción *</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className={errors.descripcion ? 'error' : ''}
              placeholder="Descripción del producto"
              rows="3"
            />
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="precioVenta">Precio de Venta *</label>
              <input
                type="number"
                id="precioVenta"
                name="precioVenta"
                value={formData.precioVenta}
                onChange={handleInputChange}
                className={errors.precioVenta ? 'error' : ''}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.precioVenta && <span className="error-message">{errors.precioVenta}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="stock">Stock</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className={errors.stock ? 'error' : ''}
                placeholder="0"
                min="0"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="imagen">URL Imagen Principal</label>
              <input
                type="url"
                id="imagen"
                name="imagen"
                value={formData.imagen}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <div className="form-group">
              <label htmlFor="imagenHover">URL Imagen Hover</label>
              <input
                type="url"
                id="imagenHover"
                name="imagenHover"
                value={formData.imagenHover}
                onChange={handleInputChange}
                placeholder="https://ejemplo.com/imagen-hover.jpg"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel}
              className="btn-cancel"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-save"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditItemModal;