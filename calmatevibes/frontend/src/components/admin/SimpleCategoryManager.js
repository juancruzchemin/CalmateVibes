import React, { useState } from 'react';
import OffersManager from './OffersManager';
import '../styles/SimpleCategoryManager.css';

function SimpleCategoryManager({ 
  catalogos, 
  onAddCatalogo, 
  onEditCatalogo, 
  onDeleteCatalogo,
  offers,
  setOffers
}) {
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [showOffersManager, setShowOffersManager] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      onAddCatalogo(newCategoryName.trim());
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category.id);
    setEditCategoryName(category.nombre);
  };

  const handleSaveEdit = () => {
    if (editCategoryName.trim()) {
      onEditCatalogo(editingCategory, editCategoryName.trim());
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditCategoryName('');
  };

  const handleCancelAdd = () => {
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (category) => {
    setCategoryToDelete(category);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete && onDeleteCatalogo) {
      onDeleteCatalogo(categoryToDelete.id);
      setShowDeleteConfirm(false);
      setCategoryToDelete(null);
    }
  };

  const cancelDeleteCategory = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="simple-category-manager">
      <div className="categories-grid">
        {/* Categoría especial de Ofertas */}
        <div className="category-card offers-category">
          <div className="category-info">
            <div className="category-content">
              <h3 className="category-name">🏷️ Ofertas</h3>
              <span className="category-count">
                📊 {offers?.length || 0} ofertas
              </span>
            </div>
            <button 
              onClick={() => setShowOffersManager(true)}
              className="btn-edit-category"
              title="Gestionar ofertas"
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Categorías existentes */}
        {catalogos.map((categoria) => (
          <div key={categoria.id} className="category-card">
            <div className="category-info">
              {editingCategory === categoria.id ? (
                <div className="edit-category-form">
                  <input
                    type="text"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="edit-input"
                    placeholder="Nombre de la categoría"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleSaveEdit();
                      if (e.key === 'Escape') handleCancelEdit();
                    }}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button 
                      onClick={handleSaveEdit}
                      className="btn-save-small"
                    >
                      ✓
                    </button>
                    <button 
                      onClick={handleCancelEdit}
                      className="btn-cancel-small"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="category-content">
                    <h3 className="category-name">{categoria.nombre}</h3>
                    <span className="category-count">
                      📦 {categoria.items?.length || 0} items
                    </span>
                  </div>
                  <div className="category-actions">
                    <button 
                      onClick={() => handleEditCategory(categoria)}
                      className="btn-edit-category"
                      title="Editar nombre de categoría"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(categoria)}
                      className="btn-delete-category"
                      title="Eliminar categoría"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}

        {/* Botón para añadir nueva categoría */}
        {isAddingCategory ? (
          <div className="category-card new-category">
            <div className="add-category-form">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de la nueva categoría"
                className="add-input"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleAddCategory();
                  if (e.key === 'Escape') handleCancelAdd();
                }}
                autoFocus
              />
              <div className="add-actions">
                <button 
                  onClick={handleAddCategory}
                  className="btn-save-small"
                  disabled={!newCategoryName.trim()}
                >
                  ✓
                </button>
                <button 
                  onClick={handleCancelAdd}
                  className="btn-cancel-small"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="category-card add-category-button"
            onClick={() => setIsAddingCategory(true)}
          >
            <div className="add-category-content">
              <span className="add-icon">➕</span>
              <span className="add-text">Nueva Categoría</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal de gestión de ofertas */}
      {showOffersManager && (
        <div className="offers-modal-overlay">
          <div className="offers-modal">
            <div className="offers-modal-header">
              <h2>🏷️ Gestión de Ofertas</h2>
              <button 
                className="close-offers-modal"
                onClick={() => setShowOffersManager(false)}
              >
                ✕
              </button>
            </div>
            <div className="offers-modal-content">
              <OffersManager
                offers={offers}
                setOffers={setOffers}
                catalogos={catalogos}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && categoryToDelete && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-header">
              <h3>⚠️ Confirmar Eliminación</h3>
            </div>
            <div className="delete-confirm-content">
              <p>
                ¿Estás seguro de que deseas eliminar la categoría <strong>"{categoryToDelete.nombre}"</strong>?
              </p>
              <p className="delete-warning">
                ❌ Esta acción eliminará permanentemente:
              </p>
              <ul className="delete-items-list">
                <li>La categoría completa</li>
                <li>Todos los {categoryToDelete.items?.length || 0} items asociados</li>
                <li>No se puede deshacer esta acción</li>
              </ul>
            </div>
            <div className="delete-confirm-actions">
              <button 
                onClick={cancelDeleteCategory}
                className="btn-cancel-delete"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmDeleteCategory}
                className="btn-confirm-delete"
              >
                Eliminar Categoría
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SimpleCategoryManager;