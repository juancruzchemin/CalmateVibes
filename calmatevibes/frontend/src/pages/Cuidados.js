import React from 'react';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

import './styles/Cuidados.css';

function Cuidados() {
  return (
    <div className="cuidados-page">
      <Header />
      <div className="cuidados-content">
        <h1>Cuidados del Mate</h1>
        <p>
          Aquí encontrarás toda la información necesaria para cuidar y mantener tu mate en perfecto estado.
        </p>
      </div>
      <Footer />
    </div>
  );
}

export default Cuidados;