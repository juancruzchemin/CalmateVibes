import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Popup from '../components/Popup';
import PreviewItem from '../components/PreviewItem';
// import ItemForm from '../components/ItemForm'; // Commented out - not currently used
import AdminFilters from '../components/AdminFilters';
import AdminItemsView from '../components/AdminItemsView';
import EditItemModal from '../components/EditItemModal';
import AddItemModal from '../components/AddItemModal';
import SimpleCategoryManager from '../components/SimpleCategoryManager';

import './styles/Stock.css';

function Stock() {
  const [catalogos, setCatalogos] = useState([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('nombre');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterByStock, setFilterByStock] = useState('all'); // all, low, out
  const [filterByPrice, setFilterByPrice] = useState('all'); // all, low, medium, high
  const [filterByCategory, setFilterByCategory] = useState('all'); // filtro por categoría
  const [attributeFilters, setAttributeFilters] = useState({}); // filtros por atributos específicos
  const [viewMode, setViewMode] = useState('grid'); // grid, list, table
  const [adminMode, setAdminMode] = useState(false); // toggle entre vista tradicional y admin
  const [editingItem, setEditingItem] = useState(null); // item que se está editando
  const [showEditModal, setShowEditModal] = useState(false); // mostrar modal de edición
  const [offers, setOffers] = useState([]); // estado para las ofertas
  const [showHelpModal, setShowHelpModal] = useState(false); // mostrar modal de ayuda
  
  // const [formData, setFormData] = useState({
  //   nombre: '',
  //   precioVenta: '',
  //   descripcion: '',
  //   stock: 0,
  //   imagenes: [],
  //   catalogo: '',
  // });


  // Cargar catálogos desde archivos JSON
  useEffect(() => {
    const fetchCatalogos = async () => {
      try {
        const mates = await import('../data/catalogo-mates.json');
        const bombillas = await import('../data/catalogo-bombillas.json');
        const combos = await import('../data/catalogo-combos.json');

        const allCatalogos = [
          { id: 'mates', nombre: 'Mates', items: mates.items },
          { id: 'bombillas', nombre: 'Bombillas', items: bombillas.items },
          { id: 'combos', nombre: 'Combos', items: combos.items },
        ];

        setCatalogos(allCatalogos);
      } catch (error) {
        console.error('Error al cargar los catálogos:', error);
      }
    };

    fetchCatalogos();
  }, []);

  // Manejar cambios en el formulario - Commented out (not currently used)
  /*
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
  */

  // Agregar un nuevo catálogo
  const handleAddCatalogo = (nombre) => {
    const newCatalogo = {
      id: Date.now().toString(),
      nombre,
      items: [],
    };
    setCatalogos((prevCatalogos) => [...prevCatalogos, newCatalogo]);
  };

  // Agregar un nuevo item
  const handleAddItem = (newItem) => {
    const catalogoId = newItem.catalogo; // El formulario debe incluir el catálogo seleccionado
    if (!catalogoId) {
      console.error('Debe seleccionar una categoría');
      return;
    }
    
    setCatalogos((prevCatalogos) =>
      prevCatalogos.map((catalogo) =>
        catalogo.id === catalogoId
          ? { ...catalogo, items: [...(catalogo.items || []), { id: Date.now(), ...newItem }] }
          : catalogo
      )
    );
  };

  // Eliminar un item
  const handleDeleteItem = (itemId, catalogoId) => {
    setCatalogos((prevCatalogos) =>
      prevCatalogos.map((catalogo) =>
        catalogo.id === catalogoId
          ? { ...catalogo, items: catalogo.items.filter((item) => item.id !== itemId) }
          : catalogo
      )
    );
  };

  // Confirmar eliminación
  const handleConfirmDelete = () => {
    if (itemToDelete) {
      handleDeleteItem(itemToDelete.id, itemToDelete.catalogoId);
      setShowPopup(false);
      setItemToDelete(null);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = () => {
    setShowPopup(false);
    setItemToDelete(null);
  };

  // Vista previa de un item
  const handlePreviewItem = (item) => {
    setPreviewItem(item);
  };

  const handleClosePreview = () => {
    setPreviewItem(null);
  };

  // Enviar formulario desde el modal
  const handleModalSubmit = (formData) => {
    if (!formData.catalogo) {
      alert('Por favor selecciona una categoría');
      return;
    }
    handleAddItem(formData);
    setShowAddItemModal(false);
  };

  const handleEditCatalogo = (catalogoId, newName) => {
    setCatalogos((prevCatalogos) =>
      prevCatalogos.map((catalogo) =>
        catalogo.id === catalogoId ? { ...catalogo, nombre: newName } : catalogo
      )
    );
  };

  // Eliminar un catálogo
  const handleDeleteCatalogo = (catalogoId) => {
    setCatalogos((prevCatalogos) =>
      prevCatalogos.filter((catalogo) => catalogo.id !== catalogoId)
    );
  };



  // Obtener atributos disponibles para la categoría seleccionada
  const getAvailableAttributes = () => {
    if (filterByCategory === 'all' || !catalogos) return {};
    
    const selectedCatalog = catalogos.find(cat => cat.id === filterByCategory);
    if (!selectedCatalog || !selectedCatalog.items) return {};
    
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

  // Manejar cambio de filtro de categoría
  const handleCategoryFilterChange = (categoryId) => {
    setFilterByCategory(categoryId);
    // Limpiar filtros de atributos cuando cambia la categoría
    setAttributeFilters({});
  };

  // Manejar cambio de filtros de atributos
  const handleAttributeFilterChange = (attributeName, value) => {
    if (attributeName === 'reset') {
      setAttributeFilters({});
      return;
    }
    
    setAttributeFilters(prev => ({
      ...prev,
      [attributeName]: value === 'all' ? undefined : value
    }));
  };

  // Funciones de filtrado y búsqueda
  const getFilteredItems = () => {
    if (!catalogos || catalogos.length === 0) {
      return [];
    }
    
    let allItems = [];
    
    // Siempre mostrar todos los items (tanto en vista admin como tradicional)
    allItems = catalogos.flatMap(catalogo => 
      (catalogo.items || []).map(item => ({ ...item, categoria: catalogo.nombre, catalogoId: catalogo.id }))
    );

    // Aplicar filtro de categoría
    if (filterByCategory !== 'all') {
      allItems = allItems.filter(item => item.catalogoId === filterByCategory);
    }

    // Aplicar filtros de atributos
    if (Object.keys(attributeFilters).length > 0) {
      allItems = allItems.filter(item => {
        return Object.entries(attributeFilters).every(([attrName, attrValue]) => {
          if (!attrValue) return true;
          
          const itemValue = item[attrName];
          if (typeof itemValue === 'boolean') {
            const itemValueStr = itemValue ? 'Sí' : 'No';
            return itemValueStr === attrValue;
          }
          return String(itemValue) === attrValue;
        });
      });
    }

    // Aplicar filtro de búsqueda
    if (searchTerm) {
      allItems = allItems.filter(item =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de stock
    if (filterByStock !== 'all') {
      allItems = allItems.filter(item => {
        if (filterByStock === 'low') return item.stock > 0 && item.stock <= 5;
        if (filterByStock === 'out') return item.stock === 0;
        return true;
      });
    }

    // Aplicar filtro de precio
    if (filterByPrice !== 'all' && filterByPrice !== '') {
      const maxPrice = parseFloat(filterByPrice);
      if (!isNaN(maxPrice) && maxPrice >= 0) {
        allItems = allItems.filter(item => {
          const price = parseFloat(item.precioVenta) || 0;
          return price <= maxPrice;
        });
      }
    }

    // Aplicar ordenamiento
    allItems.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      if (sortBy === 'precioVenta') {
        aValue = parseFloat(aValue);
        bValue = parseFloat(bValue);
      }
      
      if (sortBy === 'stock') {
        aValue = parseInt(aValue);
        bValue = parseInt(bValue);
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return allItems;
  };

  // Obtener estadísticas
  const getStockStats = () => {
    if (!catalogos || catalogos.length === 0) {
      return {
        total: 0,
        lowStock: 0,
        outOfStock: 0,
        categories: 0
      };
    }
    
    const allItems = catalogos.flatMap(catalogo => catalogo.items || []);
    return {
      total: allItems.length,
      lowStock: allItems.filter(item => item.stock > 0 && item.stock <= 5).length,
      outOfStock: allItems.filter(item => item.stock === 0).length,
      categories: catalogos.length
    };
  };

  // Funciones para CRUD en admin mode
  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveItem = async (updatedItem) => {
    try {
      setCatalogos(prevCatalogos =>
        prevCatalogos.map(catalogo => ({
          ...catalogo,
          items: catalogo.items.map(item =>
            item.id === updatedItem.id ? updatedItem : item
          )
        }))
      );
      
      setShowEditModal(false);
      setEditingItem(null);
      
      // Aquí podrías añadir una llamada a la API para guardar en el servidor
      console.log('Item actualizado:', updatedItem);
    } catch (error) {
      console.error('Error al actualizar item:', error);
      throw error;
    }
  };

  const handleDeleteItemAdmin = (item) => {
    setItemToDelete({ 
      id: item.id, 
      catalogoId: item.catalogoId,
      nombre: item.nombre 
    });
    setShowPopup(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  return (
    <div>
      <Header />
      <div className="stock-page">
        <div className="stock-container">
          <div className="stock-header">
            <h1 className="stock-page-title">
              {adminMode ? 'Gestión de Stock' : 'Gestión de Categorías'}
            </h1>
            
            <div className="header-controls">
              {/* Toggle para cambiar entre vistas */}
              <div className="view-toggle">
                <button 
                  className={`toggle-btn ${!adminMode ? 'active' : ''}`}
                  onClick={() => setAdminMode(false)}
                >
                  <span className="desktop-only">Categorías</span>
                  <span className="mobile-only">Categorías</span>
                </button>
                <button 
                  className={`toggle-btn ${adminMode ? 'active' : ''}`}
                  onClick={() => setAdminMode(true)}
                >
                  <span className="desktop-only">Stock</span>
                  <span className="mobile-only">Stock</span>
                </button>
              </div>
              
              {/* Botón de ayuda */}
              <button 
                className="help-btn"
                onClick={() => setShowHelpModal(true)}
                title="Ayuda sobre las vistas"
              >
                ?
              </button>
            </div>
          </div>

          <div className="stock-content">
            {!adminMode ? (
              <>
                {/* VISTA TRADICIONAL SIMPLIFICADA */}
                <SimpleCategoryManager
                  catalogos={catalogos}
                  onAddCatalogo={handleAddCatalogo}
                  onEditCatalogo={handleEditCatalogo}
                  onDeleteCatalogo={handleDeleteCatalogo}
                  offers={offers}
                  setOffers={setOffers}
                />
              </>
            ) : (
          <>
            {/* VISTA ADMIN */}
            <AdminFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              sortBy={sortBy}
              onSortChange={setSortBy}
              sortOrder={sortOrder}
              onSortOrderChange={setSortOrder}
              filterByStock={filterByStock}
              onStockFilterChange={setFilterByStock}
              filterByPrice={filterByPrice}
              onPriceFilterChange={setFilterByPrice}
              filterByCategory={filterByCategory}
              onCategoryFilterChange={handleCategoryFilterChange}
              attributeFilters={attributeFilters}
              onAttributeFilterChange={handleAttributeFilterChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              stats={getStockStats()}
              availableCategories={catalogos || []}
              availableAttributes={getAvailableAttributes()}
              onShowAddItemForm={() => setShowAddItemModal(true)}
            />
            
            <AdminItemsView
              items={getFilteredItems()}
              viewMode={viewMode}
              onPreviewItem={handlePreviewItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItemAdmin}
            />
              </>
            )}
          </div>

        {/* Modal para agregar un nuevo item - solo en vista stock */}
        <AddItemModal
          isOpen={adminMode && showAddItemModal}
          onClose={() => setShowAddItemModal(false)}
          onSubmit={handleModalSubmit}
          catalogos={catalogos}
        />



        {/* Popup de vista previa */}
        {previewItem && (
          <PreviewItem item={previewItem} onClose={handleClosePreview} />
        )}

        {/* Popup de confirmación */}
        {showPopup && (
          <Popup
            title="Confirmar eliminación"
            description={`¿Estás seguro de que deseas eliminar "${itemToDelete?.nombre}"? Esta acción no se puede deshacer.`}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
          />
        )}

        {/* Modal de edición */}
        <EditItemModal
          item={editingItem}
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          onSave={handleSaveItem}
          categories={catalogos}
        />

        {/* Modal de ayuda */}
        {showHelpModal && (
          <div className="help-modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowHelpModal(false)}>
            <div className="help-modal">
              <div className="help-modal-header">
                <h2>🔍 Guía de Vistas</h2>
                <button 
                  className="help-modal-close"
                  onClick={() => setShowHelpModal(false)}
                >
                  ✕
                </button>
              </div>
              
              <div className="help-modal-content">
                <div className="help-section">
                  <div className="help-section-icon">�</div>
                  <div className="help-section-content">
                    <h3>Vista Categorías:</h3>
                    <p>Organiza y gestiona las categorías de tus productos. Puedes crear, editar y eliminar categorías.</p>
                  </div>
                </div>
                
                <div className="help-section">
                  <div className="help-section-icon">📦</div>
                  <div className="help-section-content">
                    <h3>Vista Stock:</h3>
                    <p>Gestión completa de inventario con filtros avanzados, agregar/editar/eliminar items, y análisis detallado.</p>
                  </div>
                </div>
                
                <div className="help-section">
                  <div className="help-section-icon">🎁</div>
                  <div className="help-section-content">
                    <h3>Ofertas:</h3>
                    <p>Haz clic en la categoría Ofertas para gestionar promociones y descuentos.</p>
                  </div>
                </div>
              </div>
              
              <div className="help-modal-footer">
                <button 
                  className="help-modal-ok"
                  onClick={() => setShowHelpModal(false)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Stock;