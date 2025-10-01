// src/components/cart/CartItems.js
import React from 'react';
import './styles/CartItems.css';

function CartItems({ items, onUpdateQuantity, onRemoveItem }) {
    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= 99) {
            onUpdateQuantity(itemId, newQuantity);
        }
    };

    return (
        <div className="cart-items">
            
            <div className="cart-items-list">
                {items.map((item) => (
                    <div key={item.id} className="cart-item">
                        {/* Primera sección: Imagen y detalles del producto */}
                        <div className="cart-item-product">
                            <div className="cart-item-image">
                                <img 
                                    src={item.imagen || '/placeholder.svg'} 
                                    alt={item.nombre}
                                    onError={(e) => {
                                        e.target.src = '/placeholder.svg';
                                    }}
                                />
                            </div>
                            
                            <div className="cart-item-details">
                                <h3 className="cart-item-name">{item.nombre}</h3>
                                <p className="cart-item-category">{item.categoria || 'Productos'}</p>
                                <p className="cart-item-price">
                                    <span className="price-label">Precio unitario:</span>
                                    <span className="price-value">${item.precioVenta.toLocaleString()}</span>
                                </p>
                            </div>
                        </div>

                        {/* Segunda sección: Controles (cantidad, subtotal, eliminar) */}
                        <div className="cart-item-controls">
                            <div className="quantity-controls">
                                <label htmlFor={`quantity-${item.id}`} className="quantity-label">
                                    Cantidad:
                                </label>
                                <div className="quantity-input-group">
                                    <button
                                        type="button"
                                        className="quantity-btn quantity-decrease"
                                        onClick={() => handleQuantityChange(item.id, item.cantidad - 1)}
                                        disabled={item.cantidad <= 1}
                                        aria-label="Disminuir cantidad"
                                    >
                                        <i className="bi bi-dash"></i>
                                    </button>
                                    
                                    <input
                                        id={`quantity-${item.id}`}
                                        type="number"
                                        min="1"
                                        max="99"
                                        value={item.cantidad}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                        className="quantity-input"
                                        aria-label={`Cantidad de ${item.nombre}`}
                                    />
                                    
                                    <button
                                        type="button"
                                        className="quantity-btn quantity-increase"
                                        onClick={() => handleQuantityChange(item.id, item.cantidad + 1)}
                                        disabled={item.cantidad >= 99}
                                        aria-label="Aumentar cantidad"
                                    >
                                        <i className="bi bi-plus"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="cart-item-subtotal">
                                <span className="subtotal-label">Subtotal:</span>
                                <span className="subtotal-value">
                                    ${(item.precioVenta * item.cantidad).toLocaleString()}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="remove-item-btn"
                                onClick={() => onRemoveItem(item.id)}
                                aria-label={`Eliminar ${item.nombre} del carrito`}
                            >
                                <i className="bi bi-trash3"></i>
                                <span>Eliminar</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CartItems;