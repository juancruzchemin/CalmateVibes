import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import Catalogo from '../components/Catalog.js';
// import CatalogoIndice from '../components/CatalogoIndice.js'; // Commented out - not currently used
import Breadcrumb from '../components/Breadcrumb.js';
import MobileFilters from '../components/MobileFilters.js';

import './styles/Catalog-page.css';

function Catalog() {
  const { catalogoId } = useParams(); // Obtiene el ID del catálogo desde la URL
  const [catalogo, setCatalogo] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const sectionRefs = useRef([]);

  // Detectar preferencia de motion reducido
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Sistema de animación en scroll
  useEffect(() => {
    if (loading || !catalogo) return;

    // Inicializar inmediatamente las secciones para que sean visibles
    sectionRefs.current.forEach((ref) => {
      if (ref) {
        ref.classList.add('animate-in');
      }
    });

    if (prefersReducedMotion) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          const delay = index * 100;

          setTimeout(() => {
            entry.target.classList.add('animate-in');
          }, delay);
        }
      });
    }, observerOptions);

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      const currentRefs = sectionRefs.current;
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [loading, catalogo, prefersReducedMotion]);

  useEffect(() => {
    // Reinicia el estado al cambiar de catálogo
    setCatalogo(null);
    setLoading(true);
    setError(null);

    // Scroll al inicio de la página
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });

    // Carga dinámica del JSON del catálogo
    const fetchCatalogo = async () => {
      try {
        const data = await import(`../data/catalogo-${catalogoId}.json`);
        setCatalogo(data); // Actualiza el estado con los nuevos datos
      } catch (err) {
        console.error('Error al cargar el catálogo:', err);
        setError(`No se pudo cargar el catálogo "${catalogoId}". Verifica que existe.`);
      } finally {
        setLoading(false); // Desactiva el estado de "cargando"
      }
    };

    fetchCatalogo();
  }, [catalogoId, prefersReducedMotion]); // Se ejecuta cada vez que cambia catalogoId

  // Loading state mejorado
  if (loading) {
    return (
      <div className="catalog-page-wrapper">
        <Header />
        <div className="catalog-loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Cargando catálogo...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="catalog-page-wrapper">
        <Header />
        <div className="catalog-error-container">
          <h2>¡Oops! Algo salió mal</h2>
          <p>{error}</p>
          <button
            className="retry-button"
            onClick={() => window.location.reload()}
          >
            Intentar de nuevo
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!catalogo) return null;

  return (
    <div className="catalog-page-wrapper">
      <Header />

      {/* Breadcrumb mejorado */}
      <div
        className={`breadcrumb-section fade-section animate-in ${prefersReducedMotion ? 'no-motion' : ''}`}
        ref={(el) => sectionRefs.current[0] = el}
        style={{ animationDelay: '0ms' }}
      >
        <Breadcrumb />
      </div>

      {/* Header del catálogo con índice */}
      <div
        className={`catalog-header fade-section animate-in ${prefersReducedMotion ? 'no-motion' : ''}`}
        ref={(el) => sectionRefs.current[1] = el}
        style={{ animationDelay: '100ms' }}
      >
        <div className="catalog-header-content">          
          <div className="catalog-title-section">
            <div className="title-with-filters">
              <div className="title-content">
                <h1 className="catalogo-title">{catalogo.id}</h1>
                <p className="catalogo-description">{catalogo.descripcion}</p>
              </div>
              <div className="mobile-filters-in-title">
                <button 
                  className="mobile-filters-button-in-title"
                  onClick={() => setIsMobileFiltersOpen(true)}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M4 6H20M4 12H16M4 18H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>Filtros</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="catalog-page">
        {/* Contenido principal del catálogo */}
        <div
          className={`catalog-content fade-section animate-in ${prefersReducedMotion ? 'no-motion' : ''}`}
          ref={(el) => sectionRefs.current[2] = el}
          style={{ animationDelay: '200ms' }}
        >
          <Catalogo 
            catalogo={catalogo}
            hideFiltersButton={true}
            filteredItems={filteredItems}
            onItemsChange={setFilteredItems}
          />
        </div>
      </div>

      {/* Sidebar móvil en la página principal */}
      <MobileFilters
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
        catalogoItems={catalogo.items}
        currentItems={filteredItems.length > 0 ? filteredItems : catalogo.items}
        currentCategory={catalogo.nombre}
        onFilter={setFilteredItems}
        onSort={setFilteredItems}
      />

      <Footer />
    </div>
  );
}

export default Catalog;