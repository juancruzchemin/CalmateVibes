import React, { useState } from 'react';
import { useCarrito } from '../../context/CarritoContext';
import MercadoPagoButton from './MercadoPagoButton';
import './styles/PaymentMethod.css';

const PaymentMethod = ({ onNext, onBack }) => {
  const [selectedMethod, setSelectedMethod] = useState('');

  // Obtener datos del carrito
  const { carrito, total, cantidadTotal } = useCarrito();

  // Preparar datos para MercadoPago
  const prepareOrderData = () => {
    if (!carrito || !carrito.length) {
      console.warn('⚠️ Carrito vacío o no disponible');
      return null;
    }

    const orderData = {
      carrito: {
        items: carrito.map(item => ({
          _id: item._id,
          nombre: item.nombre,
          descripcion: item.descripcion,
          cantidad: item.cantidad,
          precioVenta: item.precioVenta
        }))
      },
      total: total,
      customer: {
        nombre: 'Cliente',
        apellido: 'Test',
        email: 'test@calmatevibes.com' // Email válido para pruebas
      },
      shipping: {}
    };
    return orderData;
  };

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleWhatsAppContact = () => {
    // Preparar mensaje para WhatsApp
    const items = carrito.map(item =>
      `• ${item.nombre} x${item.cantidad} - $${(item.precioVenta * item.cantidad).toLocaleString()}`
    ).join('\n');

    const message = `¡Hola! Me interesa realizar una compra:\n\n${items}\n\n*Total: $${total.toLocaleString()}*\n\n¿Podrían ayudarme con el proceso de compra?`;

    // Número de WhatsApp (reemplaza con tu número)
    const phoneNumber = '5491234567890'; // Formato: código país + número sin espacios ni símbolos

    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, '_blank');
  };

  const handleNext = () => {
    if (selectedMethod && onNext) {
      onNext({ paymentMethod: selectedMethod });
    }
  };

  // Preparar orderData una sola vez
  const orderData = prepareOrderData();

  return (
    <div className="payment-method">

      {/* Opciones de pago */}
      <div className="payment-options">
        <div
          className={`payment-card ${selectedMethod === 'mercadopago' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('mercadopago')}
        >
          <div className="payment-header">
            <input
              type="radio"
              name="paymentMethod"
              value="mercadopago"
              checked={selectedMethod === 'mercadopago'}
              onChange={() => handleMethodSelect('mercadopago')}
            />
            <h4>MercadoPago</h4>
          </div>
          <p>Pagá con tarjeta de crédito, débito o dinero en cuenta</p>
        </div>

        <div
          className={`payment-card ${selectedMethod === 'whatsapp' ? 'selected' : ''}`}
          onClick={() => handleMethodSelect('whatsapp')}
        >
          <div className="payment-header">
            <input
              type="radio"
              name="paymentMethod"
              value="whatsapp"
              checked={selectedMethod === 'whatsapp'}
              onChange={() => handleMethodSelect('whatsapp')}
            />
            <h4>Contacto por WhatsApp</h4>
          </div>
          <p>Coordiná tu compra directamente con nosotros</p>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="step-navigation">
        <button
          className="btn-secondary"
          onClick={onBack}
        >
          ← Volver
        </button>

        {selectedMethod === 'mercadopago' && orderData && (
          <div className="mercadopago-container">
            <MercadoPagoButton orderData={orderData} />
          </div>
        )}

        {selectedMethod === 'whatsapp' && (
          <div className="whatsapp-container">
            <button
              className="whatsapp-btn"
              onClick={handleWhatsAppContact}
            >
              <span>Contactar por WhatsApp</span>
            </button>
          </div>
        )}

        {selectedMethod && selectedMethod !== 'mercadopago' && selectedMethod !== 'whatsapp' && (
          <button
            className="btn-primary"
            onClick={handleNext}
          >
            Continuar →
          </button>
        )}
      </div>

    </div>
  );
};

export default PaymentMethod;