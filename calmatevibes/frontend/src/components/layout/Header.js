import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

import CarritoIcono from '../shared/CarritoIcono.js';

import '../styles/Header.css';

function Header() {
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const adminDropdownRef = useRef(null);
  const userDropdownRef = useRef(null);

  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
        setAdminDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };

    if (adminDropdownOpen || userDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [adminDropdownOpen, userDropdownOpen]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="header-main">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          <img
            src="/cal.mate beige.png"
            alt="Logo CalmateVibes"
            className="logo-image"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="header-nav">
          <Link to="/catalog" className="nav-link">Catálogo</Link>
          <Link to="/care" className="nav-link">Cuidados</Link>
          <Link to="/contact" className="nav-link">Contacto</Link>
          <Link to="/mis-pedidos" className="nav-link">Mis Pedidos</Link>

          {/* Admin Dropdown */}
          {isAuthenticated && isAdmin && (
            <div className="admin-dropdown" ref={adminDropdownRef}>
              <button
                className="nav-link admin-link dropdown-toggle"
                onClick={() => setAdminDropdownOpen(!adminDropdownOpen)}
                aria-label="Menú de administración"
              >
                Admin
                <svg
                  className={`dropdown-arrow ${adminDropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="8"
                  viewBox="0 0 12 8"
                  fill="none"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>

              {adminDropdownOpen && (
                <div className="admin-dropdown-menu">
                  <Link
                    to="/stock"
                    className="admin-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    Stock
                  </Link>
                  <Link
                    to="/pedidos"
                    className="admin-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    Pedidos
                  </Link>
                  <Link
                    to="/ventas"
                    className="admin-dropdown-item"
                    onClick={() => setAdminDropdownOpen(false)}
                  >
                    Ventas
                  </Link>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Right Section: User Icon and Cart */}
        <div className="header-right">
          {/* User Dropdown */}
          <div className="user-dropdown" ref={userDropdownRef}>
            {isAuthenticated ? (
              <>
                <button
                  className="user-icon-button authenticated"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  aria-label="Menú de usuario"
                >
                  <div className="user-avatar">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="user-icon"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                        fill="currentColor"
                      />
                    </svg>
                    <div className="online-indicator"></div>
                  </div>
                  <span className="user-name">{user?.nombre}</span>
                </button>

                {userDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <div className="user-info">
                      <div className="user-details">
                        <span className="user-full-name">{user?.nombre} {user?.apellido}</span>
                        <span className="user-email-dropdown">{user?.email}</span>
                        {isAdmin && <span className="user-role">Administrador</span>}
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <Link
                      to="/mis-pedidos"
                      className="user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Mis Pedidos
                    </Link>
                    <Link
                      to="/profile"
                      className="user-dropdown-item"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      className="user-dropdown-item logout-btn"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" className="user-icon-button">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="user-icon"
                >
                  <path
                    d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="login-text">Ingresar</span>
              </Link>
            )}
          </div>
          <CarritoIcono />
        </div>
      </div>
    </header>
  );
}

export default Header;