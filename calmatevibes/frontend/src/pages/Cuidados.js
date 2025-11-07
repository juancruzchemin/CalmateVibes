import React, { useContext } from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import { CarritoContext } from '../context/CarritoContext.js';

import './styles/Cuidados.css';

function Cuidados() {
  const { carrito } = useContext(CarritoContext);
  
  return (
    <div className="cuidados-page">
      <Header carrito={carrito} userRole="client" />
      
      {/* Hero Section con el mismo estilo que Contact */}
      <div className="cuidados-hero-section">
        <h1 className="cuidados-hero-title">Cuidados del Mate</h1>
        <p className="cuidados-hero-subtitle">
          Aquí encontrarás toda la información necesaria para cuidar y mantener tu mate en perfecto estado.
        </p>
      </div>

      <div className="cuidados-content">
        {/* Aquí va el contenido adicional de la página */}
      </div>
      
      <Footer />
    </div>
  );
}

export default Cuidados;