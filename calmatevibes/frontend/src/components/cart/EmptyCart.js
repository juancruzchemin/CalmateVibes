// src/components/cart/EmptyCart.js
import React from 'react';
import { Link } from 'react-router-dom';
import './styles/EmptyCart.css';

function EmptyCart() {
    return (
        <div className="empty-cart">
            <div className="empty-cart-content">
                <div className="empty-cart-icon">
                    <i className="bi bi-cart-x"></i>
                </div>
                
                <h2 className="empty-cart-title">Tu carrito está vacío</h2>
                
                <p className="empty-cart-message">
                    ¡No te preocupes! Descubrí nuestra increíble selección de mates, bombillas y combos.
                </p>

                {/* <div className="empty-cart-suggestions">
                    <h3>¿Qué te gustaría explorar?</h3>
                    <div className="suggestion-links">
                        <Link to="/catalog/mates" className="suggestion-link">
                            <i className="bi bi-cup"></i>
                            <span>Mates</span>
                        </Link>
                        <Link to="/catalog/bombillas" className="suggestion-link">
                            <i className="bi bi-droplet"></i>
                            <span>Bombillas</span>
                        </Link>
                        <Link to="/catalog/combos" className="suggestion-link">
                            <i className="bi bi-bag"></i>
                            <span>Combos</span>
                        </Link>
                    </div>
                </div> */}

                <div className="empty-cart-actions">
                    <Link to="/" className="btn-continue-shopping primary">
                        <i className="bi bi-house"></i>
                        Ir al Inicio
                    </Link>
                    <Link to="/catalog/mates" className="btn-continue-shopping secondary">
                        <i className="bi bi-grid"></i>
                        Ver Catálogo Completo
                    </Link>
                </div>

                {/* <div className="empty-cart-features">
                    <div className="feature">
                        <i className="bi bi-truck"></i>
                        <span>Envío gratis en compras +$5,000</span>
                    </div>
                    <div className="feature">
                        <i className="bi bi-shield-check"></i>
                        <span>Compra 100% segura</span>
                    </div>
                    <div className="feature">
                        <i className="bi bi-whatsapp"></i>
                        <span>Atención personalizada</span>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default EmptyCart;