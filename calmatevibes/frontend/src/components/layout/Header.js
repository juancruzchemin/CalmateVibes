import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import Sidebar from './Sidebar.js';
import CarritoIcono from '../shared/CarritoIcono.js'; // Importa el nuevo componente

import '../styles/Header.css';

function Header({ carrito }) {
  const [hidden, setHidden] = useState(false);
  const [forceShow, setForceShow] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Nuevo estado
  const lastScroll = useRef(0);

  useEffect(() => {
    if (sidebarOpen) return; // No ocultar si sidebar está abierto
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll === 0) {
        setHidden(false); // Siempre mostrar si está arriba del todo
      } else if (currentScroll > lastScroll.current && currentScroll > 60) {
        setHidden(false); // Oculta al bajar
      } else {
        setHidden(true); // Muestra al subir
      }
      lastScroll.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sidebarOpen]);

  useEffect(() => {
    if (sidebarOpen) return; // No ocultar si sidebar está abierto
    const handleMouseMove = (e) => {
      if (e.clientY < 100) {
        setForceShow(true);
      } else {
        setForceShow(false);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [sidebarOpen]);

  // El header solo se oculta si NO está el sidebar abierto
  const shouldHide = !sidebarOpen && hidden && !forceShow;

  return (
    <header className={`header-main${shouldHide ? ' hidden' : ''}`}>
      <div className="header-container">
        <Link to="/">
          <img
            src="/cal.mate beige.png"
            alt="Logo"
            style={{ height: '150px', cursor: 'pointer' }}
          />
        </Link>
        <div className="header-right">
          <CarritoIcono carrito={carrito} /> {/* Coloca el carrito antes del sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} userRole="admin" />
        </div>
      </div>
    </header>
  );
}

export default Header;