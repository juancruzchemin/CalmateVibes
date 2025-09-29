import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import catalogosData from '../data/tiendas.json';
import './styles/CategorySelector.css';

function CategorySelector({ currentCategory }) {
  const navigate = useNavigate();
  const { catalogoId } = useParams();
  const [isOpen, setIsOpen] = useState(false);

  // Función para obtener el número de productos de cada catálogo
  const getProductCount = (catalogName) => {
    const counts = {
      'Mates': 12,
      'Bombillas': 8,
      'Combos': 6
    };
    return counts[catalogName] || 0;
  };

  const handleCategoryChange = (catalogo) => {
    setIsOpen(false);
    navigate(catalogo.url);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const currentCatalog = catalogosData.catalogos.find(cat => 
    cat.nombre === currentCategory
  );

  return (
    <div className="category-selector">
      <button 
        className="category-selector-button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="category-selector-label">Categoría:</span>
        <span className="category-selector-current">
          {currentCategory}
          {getProductCount(currentCategory) > 0 && (
            <span className="category-count">({getProductCount(currentCategory)})</span>
          )}
        </span>
        <svg 
          className={`category-selector-arrow ${isOpen ? 'open' : ''}`}
          width="12" 
          height="8" 
          viewBox="0 0 12 8" 
          fill="none"
        >
          <path 
            d="M1 1L6 6L11 1" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="category-selector-dropdown">
          <ul className="category-selector-list" role="listbox">
            {catalogosData.catalogos.map((catalogo, idx) => {
              const isActive = catalogo.nombre === currentCategory;
              const productCount = getProductCount(catalogo.nombre);
              
              return (
                <li key={idx} role="option" aria-selected={isActive}>
                  <button
                    className={`category-selector-option ${isActive ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(catalogo)}
                    disabled={isActive}
                  >
                    <span className="category-option-name">{catalogo.nombre}</span>
                    {productCount > 0 && (
                      <span className="category-option-count">{productCount}</span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Overlay para cerrar el dropdown al hacer clic fuera */}
      {isOpen && (
        <div 
          className="category-selector-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

export default CategorySelector;