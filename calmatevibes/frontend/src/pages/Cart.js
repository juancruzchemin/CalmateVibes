// src/pages/Cart.js
import React, { useContext, useState, useEffect } from 'react';
import { CarritoContext } from '../context/CarritoContext.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import CartItems from '../components/cart/CartItems.js';
import CartSummary from '../components/cart/CartSummary.js';
import EmptyCart from '../components/cart/EmptyCart.js';
import CheckoutForm from '../components/cart/CheckoutForm.js';
import PaymentMethod from '../components/cart/PaymentMethod.js';
import '../components/cart/styles/Cart.css';

function Cart() {
    const { carrito, eliminarDelCarrito, vaciarCarrito, actualizarCantidad } = useContext(CarritoContext);
    const [currentStep, setCurrentStep] = useState('cart'); // cart, checkout, payment
    const [customerInfo, setCustomerInfo] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        codigoPostal: ''
    });
    const [paymentMethod, setPaymentMethod] = useState('mercadopago'); // mercadopago, whatsapp
    const [isLoading, setIsLoading] = useState(false);

    const total = carrito.reduce((sum, item) => sum + item.precioVenta * item.cantidad, 0);
    const envio = total > 5000 ? 0 : 800; // Envío gratis en compras mayores a $5000
    const totalConEnvio = total + envio;
    const showShipping = currentStep !== 'cart'; // Mostrar shipping en pasos avanzados

    // Función para avanzar al checkout
    const handleProceedToCheckout = () => {
        setCurrentStep('checkout');
    };

    // Función para retroceder al carrito
    const handleBackToCart = () => {
        setCurrentStep('cart');
    };

    // Función para proceder al pago
    const handleProceedToPayment = (formData) => {
        setCustomerInfo(formData);
        setCurrentStep('payment');
    };

    // Función para generar orden
    const generateOrder = () => {
        return {
            id: `ORDER-${Date.now()}`,
            items: carrito.map(item => ({
                id: item.id,
                nombre: item.nombre,
                precio: item.precioVenta,
                cantidad: item.cantidad,
                imagen: item.imagen
            })),
            customer: customerInfo,
            subtotal: total,
            envio: envio,
            total: totalConEnvio,
            fecha: new Date().toISOString(),
            estado: 'pending'
        };
    };

    // Función para manejar el pago con MercadoPago
    const handleMercadoPagoPayment = async () => {
        setIsLoading(true);
        try {
            const order = generateOrder();

            // Aquí integraremos MercadoPago
            const response = await fetch('/api/create-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: order.items,
                    customer: order.customer,
                    total: order.total
                })
            });

            const data = await response.json();

            if (data.preferenceId) {
                // Redirigir a MercadoPago
                window.location.href = data.initPoint;
            }
        } catch (error) {
            console.error('Error al procesar el pago:', error);
            alert('Error al procesar el pago. Intenta nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Función para manejar compra por WhatsApp
    const handleWhatsAppPurchase = () => {
        const order = generateOrder();
        let mensaje = `¡Hola! Me gustaría realizar una compra:\n\n`;
        mensaje += `📋 *PEDIDO #${order.id}*\n\n`;

        order.items.forEach((item) => {
            mensaje += `• ${item.nombre}\n`;
            mensaje += `  Cantidad: ${item.cantidad}\n`;
            mensaje += `  Precio: $${item.precio}\n\n`;
        });

        mensaje += `*DATOS DEL CLIENTE:*\n`;
        mensaje += `Nombre: ${customerInfo.nombre}\n`;
        mensaje += `Email: ${customerInfo.email}\n`;
        mensaje += `Teléfono: ${customerInfo.telefono}\n`;
        mensaje += `Dirección: ${customerInfo.direccion}\n`;
        mensaje += `Ciudad: ${customerInfo.ciudad}\n`;
        mensaje += `Código Postal: ${customerInfo.codigoPostal}\n\n`;

        mensaje += `*RESUMEN DEL PEDIDO:*\n`;
        mensaje += `Subtotal: $${order.subtotal}\n`;
        mensaje += `Envío: ${order.envio === 0 ? 'GRATIS' : `$${order.envio}`}\n`;
        mensaje += `*Total: $${order.total}*`;

        const numeroWhatsApp = '5492804666566';
        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    };

    // Efectos para scroll management
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentStep]);

    return (
        <div className="cart-page-wrapper">
            <Header />

            <div className="cart-content-container">
                {/* Progress indicator */}
                <div className="cart-progress">
                    <div className={`progress-step ${currentStep === 'cart' ? 'active' : currentStep !== 'cart' ? 'completed' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Carrito</span>
                    </div>
                    <div className={`progress-step ${currentStep === 'checkout' ? 'active' : currentStep === 'payment' ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Datos</span>
                    </div>
                    <div className={`progress-step ${currentStep === 'payment' ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Pago</span>
                    </div>
                </div>

                {/* Cart Step - Desktop */}
                {currentStep === 'cart' && (
                    <div className="cart-step">
                        {/* Título mobile con total */}
                        <div className="mobile-cart-header">
                            <h1 className="cart-title">Carrito de Compras</h1>
                            <div className="cart-total-display">
                                <span className="total-label">Total:</span>
                                <span className="total-amount">{`$${(showShipping ? totalConEnvio : total).toLocaleString()}`}</span>
                            </div>
                        </div>

                        {/* Título desktop tradicional */}
                        <h1 className="cart-title desktop-title">Carrito de Compras</h1>

                        {carrito.length === 0 ? (
                            <EmptyCart />
                        ) : (
                            <>
                                {/* Vista Desktop - Layout tradicional */}
                                <div className="desktop-cart-layout">
                                    <div className="cart-items-section">
                                        <CartItems
                                            items={carrito}
                                            onUpdateQuantity={actualizarCantidad}
                                            onRemoveItem={eliminarDelCarrito}
                                        />
                                    </div>
                                    <div className="cart-summary-section">
                                        <CartSummary
                                            subtotal={total}
                                            envio={envio}
                                            total={totalConEnvio}
                                            itemCount={carrito.length}
                                            items={carrito}
                                            onClearCart={vaciarCarrito}
                                            showShipping={false}
                                            currentStep={currentStep}
                                        />
                                        <div className="cart-continue-section">
                                            <button
                                                className="btn-continue-checkout"
                                                onClick={handleProceedToCheckout}
                                            >
                                                Continuar Compra
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Vista Mobile - Desplegables por pasos */}
                                <div className="mobile-cart-layout">
                                    {/* Paso 1: Carrito (Productos) */}
                                    <div className={`mobile-step-section ${currentStep === 'cart' ? 'active' : currentStep !== 'cart' ? 'completed' : 'disabled'}`}>
                                        <div
                                            className="mobile-step-header"
                                            onClick={() => currentStep !== 'cart' && handleBackToCart()}
                                        >
                                            <div className="step-info">
                                                <span className="step-number">1</span>
                                                <span className="step-title">Productos en tu carrito</span>
                                            </div>
                                            <div className="step-status">
                                                {currentStep === 'cart' && <i className="bi bi-chevron-down"></i>}
                                                {currentStep !== 'cart' && <i className="bi bi-check-circle-fill"></i>}
                                            </div>
                                        </div>
                                        {currentStep === 'cart' && (
                                            <div className="mobile-step-content">
                                                <CartItems
                                                    items={carrito}
                                                    onUpdateQuantity={actualizarCantidad}
                                                    onRemoveItem={eliminarDelCarrito}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Paso 2: Datos (Envío) */}
                                    <div className={`mobile-step-section ${currentStep === 'checkout' ? 'active' : currentStep === 'payment' ? 'completed' : 'disabled'}`}>
                                        <div
                                            className="mobile-step-header"
                                            onClick={() => currentStep === 'payment' && setCurrentStep('checkout')}
                                        >
                                            <div className="step-info">
                                                <span className="step-number">2</span>
                                                <span className="step-title">Datos de envío</span>
                                            </div>
                                            <div className="step-status">
                                                {currentStep === 'checkout' && <i className="bi bi-chevron-down"></i>}
                                                {currentStep === 'payment' && <i className="bi bi-check-circle-fill"></i>}
                                                {currentStep === 'cart' && <i className="bi bi-lock"></i>}
                                            </div>
                                        </div>
                                        {currentStep === 'checkout' && (
                                            <div className="mobile-step-content">
                                                <CheckoutForm
                                                    initialData={customerInfo}
                                                    onSubmit={handleProceedToPayment}
                                                    onBack={handleBackToCart}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Paso 3: Pago */}
                                    <div className={`mobile-step-section ${currentStep === 'payment' ? 'active' : 'disabled'}`}>
                                        <div className="mobile-step-header">
                                            <div className="step-info">
                                                <span className="step-number">3</span>
                                                <span className="step-title">Método de pago</span>
                                            </div>
                                            <div className="step-status">
                                                {currentStep === 'payment' && <i className="bi bi-chevron-down"></i>}
                                                {currentStep !== 'payment' && <i className="bi bi-lock"></i>}
                                            </div>
                                        </div>
                                        {currentStep === 'payment' && (
                                            <div className="mobile-step-content">
                                                <PaymentMethod
                                                    selectedMethod={paymentMethod}
                                                    onMethodChange={setPaymentMethod}
                                                    onMercadoPagoPayment={handleMercadoPagoPayment}
                                                    onWhatsAppPurchase={handleWhatsAppPurchase}
                                                    onBack={() => setCurrentStep('checkout')}
                                                    isLoading={isLoading}
                                                    total={totalConEnvio}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Botones de navegación mobile - dinámicos por paso */}
                                <div className="mobile-continue-section">
                                    {currentStep === 'cart' && (
                                        <>
                                            {/* Total móvil - solo para paso del carrito */}
                                            {/* <div className="mobile-cart-total">
                                                <div className="cart-total-display">
                                                    <span className="total-label">Total:</span>
                                                    <span className="total-amount">{`$${total.toLocaleString()}`}</span>
                                                </div>
                                            </div> */}
                                            <button
                                                className="btn-continue-checkout"
                                                onClick={handleProceedToCheckout}
                                            >
                                                Continuar Compra
                                            </button>
                                        </>
                                    )}
                                    {currentStep === 'checkout' && (
                                        <div className="mobile-checkout-actions">
                                            <button 
                                                className="btn-back-mobile"
                                                onClick={handleBackToCart}
                                            >
                                                Volver al Carrito
                                            </button>
                                        </div>
                                    )}
                                    {currentStep === 'payment' && (
                                        <div className="mobile-payment-actions">
                                            <button 
                                                className="btn-back-mobile"
                                                onClick={() => setCurrentStep('checkout')}
                                            >
                                                Volver a Datos
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Checkout Step - Desktop */}
                {currentStep === 'checkout' && (
                    <div className="checkout-step">
                        <h1 className="cart-title">Información de Envío</h1>
                        <div className="checkout-layout">
                            <div className="checkout-form-section">
                                <CheckoutForm
                                    initialData={customerInfo}
                                    onSubmit={handleProceedToPayment}
                                    onBack={handleBackToCart}
                                />
                            </div>
                            <div className="checkout-summary-section">
                                <CartSummary
                                    subtotal={total}
                                    envio={envio}
                                    total={totalConEnvio}
                                    itemCount={carrito.length}
                                    items={carrito}
                                    isReadOnly={true}
                                    showShipping={true}
                                    currentStep={currentStep}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Step - Desktop */}
                {currentStep === 'payment' && (
                    <div className="payment-step">
                        <h1 className="cart-title">Método de Pago</h1>
                        <div className="payment-layout">
                            <div className="payment-method-section">
                                <PaymentMethod
                                    selectedMethod={paymentMethod}
                                    onMethodChange={setPaymentMethod}
                                    onMercadoPagoPayment={handleMercadoPagoPayment}
                                    onWhatsAppPurchase={handleWhatsAppPurchase}
                                    onBack={() => setCurrentStep('checkout')}
                                    isLoading={isLoading}
                                    total={totalConEnvio}
                                />
                            </div>
                            <div className="payment-summary-section">
                                <CartSummary
                                    subtotal={total}
                                    envio={envio}
                                    total={totalConEnvio}
                                    itemCount={carrito.length}
                                    items={carrito}
                                    customerInfo={customerInfo}
                                    isReadOnly={true}
                                    showShipping={true}
                                    currentStep={currentStep}
                                />
                            </div>
                        </div>
                    </div>
                )}


            </div>

            <Footer />
        </div>
    );
}

export default Cart;