import React, { useState, useEffect } from 'react';
import SimpleItemForm from './SimpleItemForm';
import './styles/AddItemModal.css';

function AddItemModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  catalogos = []
}) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precioVenta: '',
    stock: 0,
    imagenes: [],
    catalogo: ''
  });
  
  const [attributeData, setAttributeData] = useState({});

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setFormData({
        nombre: '',
        descripcion: '',
        precioVenta: '',
        stock: 0,
        imagenes: [],
        catalogo: ''
      });
      setAttributeData({});
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData((prevData) => ({
      ...prevData,
      imagenes: [...prevData.imagenes, ...newImages],
    }));
  };

  const handleImageRemove = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      imagenes: prevData.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let completeData = {
      ...formData,
      ...attributeData
    };
    
    // Si es un combo, enriquecer la descripción con información de los productos
    if (formData.catalogo === 'combos' && attributeData.selectedMate && attributeData.selectedBombilla) {
      const mate = catalogos.find(cat => cat.id === 'mates')?.items?.find(item => item.id === attributeData.selectedMate);
      const bombilla = catalogos.find(cat => cat.id === 'bombillas')?.items?.find(item => item.id === attributeData.selectedBombilla);
      const quantity = attributeData.comboQuantity || 1;
      
      if (mate && bombilla) {
        const comboDescription = `${completeData.descripcion}${completeData.descripcion ? '\n\n' : ''}Incluye:\n- ${quantity}x ${mate.nombre}\n- ${quantity}x ${bombilla.nombre}`;
        completeData = {
          ...completeData,
          descripcion: comboDescription,
          comboDetails: {
            mate: { id: mate.id, nombre: mate.nombre, precio: mate.precioVenta },
            bombilla: { id: bombilla.id, nombre: bombilla.nombre, precio: bombilla.precioVenta },
            quantity: quantity
          }
        };
      }
    }
    
    onSubmit(completeData);
    onClose();
  };

  const handleCatalogChange = (e) => {
    const selectedCatalogId = e.target.value;
    setFormData(prev => ({
      ...prev,
      catalogo: selectedCatalogId
    }));
    // Limpiar atributos cuando cambia la categoría
    setAttributeData({});
  };
  
  // Obtener atributos disponibles para la categoría seleccionada
  const getAvailableAttributes = () => {
    if (!formData.catalogo || !catalogos) return {};
    
    const selectedCatalog = catalogos.find(cat => cat.id === formData.catalogo);
    if (!selectedCatalog || !selectedCatalog.items || selectedCatalog.items.length === 0) return {};
    
    const attributes = {};
    
    selectedCatalog.items.forEach(item => {
      Object.keys(item).forEach(key => {
        // Excluir campos que no son atributos filtrables
        if (['id', 'nombre', 'descripcion', 'imagen', 'imagenHover', 'stock', 'precioVenta', 'precioCosto', 'active', 'categoria', 'catalogoId'].includes(key)) {
          return;
        }
        
        const value = item[key];
        if (value !== undefined && value !== null && value !== '') {
          if (!attributes[key]) {
            attributes[key] = new Set();
          }
          // Si es booleano, convertir a string
          if (typeof value === 'boolean') {
            attributes[key].add(value ? 'Sí' : 'No');
          } else {
            attributes[key].add(String(value));
          }
        }
      });
    });
    
    // Convertir Sets a arrays ordenados
    const result = {};
    Object.keys(attributes).forEach(key => {
      result[key] = Array.from(attributes[key]).sort();
    });
    
    return result;
  };
  
  const handleAttributeChange = (attributeName, value) => {
    setAttributeData(prev => {
      const newData = {
        ...prev,
        [attributeName]: value
      };
      
      // Si es un combo y se seleccionaron ambos productos, calcular precio sugerido
      if (formData.catalogo === 'combos' && (attributeName === 'selectedMate' || attributeName === 'selectedBombilla' || attributeName === 'comboQuantity')) {
        const mate = catalogos.find(cat => cat.id === 'mates')?.items?.find(item => item.id === (attributeName === 'selectedMate' ? value : newData.selectedMate));
        const bombilla = catalogos.find(cat => cat.id === 'bombillas')?.items?.find(item => item.id === (attributeName === 'selectedBombilla' ? value : newData.selectedBombilla));
        const quantity = attributeName === 'comboQuantity' ? value : (newData.comboQuantity || 1);
        
        if (mate && bombilla) {
          const totalIndividual = (mate.precioVenta + bombilla.precioVenta) * quantity;
          const suggestedPrice = Math.floor(totalIndividual * 0.9); // 10% descuento
          
          // Actualizar automáticamente el precio de venta
          setFormData(prevFormData => ({
            ...prevFormData,
            precioVenta: suggestedPrice.toString()
          }));
        }
      }
      
      return newData;
    });
  };

  const handlePreview = () => {
    // Función para preview del item (opcional)
    console.log('Preview:', formData);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="add-modal-overlay" onClick={handleOverlayClick}>
      <div className="add-modal">
        <div className="add-modal-header">
          <h2>Agregar Nuevo Item</h2>
          <button className="add-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="add-modal-content">
          <SimpleItemForm
            formData={formData}
            attributeData={attributeData}
            onInputChange={handleInputChange}
            onImageUpload={handleImageUpload}
            onImageRemove={handleImageRemove}
            onSubmit={handleSubmit}
            onPreview={handlePreview}
            catalogos={catalogos}
            onCatalogChange={handleCatalogChange}
            availableAttributes={getAvailableAttributes()}
            onAttributeChange={handleAttributeChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AddItemModal;