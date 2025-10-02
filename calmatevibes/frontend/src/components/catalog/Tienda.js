import React from 'react';
import { Link } from 'react-router-dom';
import tiendaData from '../../data/tiendas.json';
import '../styles/Tienda.css';

function Tienda() {
  return (
    <div className="tienda">
      <h1>{tiendaData.nombre}</h1>
      <p>{tiendaData.descripcion}</p>
      <div className="catalogos">
        {tiendaData.catalogos.map((catalogo, idx) => (
          <Link
            to={catalogo.url}
            className="catalogo-card"
            key={idx}
            style={{ backgroundImage: `url(${catalogo.imagen})` }}
          >
            <h3>{catalogo.nombre}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Tienda;