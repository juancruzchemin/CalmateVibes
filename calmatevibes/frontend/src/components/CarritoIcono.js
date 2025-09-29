import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './styles/CarritoIcono.css';

function CarritoIcono({ carrito = [] }) { // Valor predeterminado para carrito
  const [animateCart, setAnimateCart] = useState(false); // Estado para animar el contador

  // Animación del contador del carrito
  useEffect(() => {
    if (carrito.length > 0) {
      setAnimateCart(true);
      const timeout = setTimeout(() => setAnimateCart(false), 500); // Duración de la animación
      return () => clearTimeout(timeout);
    }
  }, [carrito]);

  return (
    <Link to="/carrito" className="carrito-icono" aria-label="Ir al carrito">
      <i className="bi bi-cart3"></i>
      <span className={`cart-counter ${animateCart ? 'animate' : ''}`}>
        {carrito.length}
      </span>
    </Link>
  );
}

export default CarritoIcono;