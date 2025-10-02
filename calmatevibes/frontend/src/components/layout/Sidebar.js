import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar({ sidebarOpen, setSidebarOpen, userRole }) {
  const sidebarRef = useRef();

  // Cierra el sidebar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  const handleLinkClick = () => setSidebarOpen(false);

  return (
    <>
      {!sidebarOpen && (
        <button
          className="sidebar-toggle"
          aria-label="Abrir menú"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sidebar-toggle-bar"></span>
          <span className="sidebar-toggle-bar"></span>
          <span className="sidebar-toggle-bar"></span>
        </button>
      )}
      <div className={`sidebar-drawer${sidebarOpen ? ' open' : ''}`} ref={sidebarRef}>
        <button className="sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Cerrar menú">&times;</button>
        <ul className="sidebar-menu">
          <li className="sidebar-menu-item"><Link to="/" onClick={handleLinkClick}>Inicio</Link></li>
          <li className="sidebar-menu-item"><Link to="/catalog/mates" onClick={handleLinkClick}>Catálogo</Link></li>
          <li className="sidebar-menu-item"><Link to="/care" onClick={handleLinkClick}>Cuidados</Link></li>
          <li className="sidebar-menu-item"><Link to="/contact" onClick={handleLinkClick}>Contacto</Link></li>
          <li className="sidebar-menu-item"><Link to="/mis-pedidos" onClick={handleLinkClick}>Mis Pedidos</Link></li>
          <li className="sidebar-menu-item"><Link to="/carrito">Carrito</Link></li>


          {/* Sección de Administración */}
          {userRole === 'admin' && ( // Solo muestra esta sección si el usuario es admin
            <li className="sidebar-menu-item">
              <span className="sidebar-section-title">Administración</span>
              <ul className="sidebar-submenu">
                <li className="sidebar-submenu-item">
                  <Link to="/stock" onClick={handleLinkClick}>📦 Stock</Link>
                </li>
                <li className="sidebar-submenu-item">
                  <Link to="/pedidos" onClick={handleLinkClick}>🚚 Pedidos</Link>
                </li>
                <li className="sidebar-submenu-item">
                  <Link to="/ventas" onClick={handleLinkClick}>📊 Ventas</Link>
                </li>
              </ul>
            </li>
          )}
        </ul>
      </div>
      {sidebarOpen && <div className="sidebar-backdrop"></div>}
    </>
  );
}

export default Sidebar;