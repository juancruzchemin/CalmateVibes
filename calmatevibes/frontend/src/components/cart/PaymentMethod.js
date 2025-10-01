// src/components/cart/PaymentMethod.js
import React, { useState } from 'react';
import './styles/PaymentMethod.css';

function PaymentMethod({
    selectedMethod,
    onMethodChange,
    onMercadoPagoPayment,
    onWhatsAppPurchase,
    onBack,
    isLoading,
    total,
    // Props para CartSummary y customer info
    items = [],
    itemCount = 0,
    subtotal = 0,
    envio = 0,
    showShipping = false,
    customerInfo
}) {
    const [acceptTerms, setAcceptTerms] = useState(false);

    const handleProceedPayment = () => {
        if (!acceptTerms) {
            alert('Debes aceptar los términos y condiciones para continuar.');
            return;
        }

        if (selectedMethod === 'mercadopago') {
            onMercadoPagoPayment();
        } else {
            onWhatsAppPurchase();
        }
    };

    return (
        <div className="payment-method">
            {/* Vista móvil - Desplegables paso a paso */}
            <div className="mobile-payment-steps">

                {/* Paso 1: Productos en tu carrito - Completado (cerrado con check) */}
                <div className="mobile-step-section completed">
                    <div className="mobile-step-header">
                        <div className="step-info">
                            <span className="step-number">1</span>
                            <span className="step-title">Productos en tu carrito</span>
                        </div>
                        <div className="step-status">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                    {/* Este desplegable siempre está cerrado */}
                </div>

                {/* Paso 2: Datos de envío - Completado (cerrado con check) */}
                <div className="mobile-step-section completed">
                    <div className="mobile-step-header">
                        <div className="step-info">
                            <span className="step-number">2</span>
                            <span className="step-title">Datos de envío</span>
                        </div>
                        <div className="step-status">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                    </div>
                    {/* Este desplegable está cerrado porque ya fue completado */}
                </div>

                {/* Paso 3: Método de pago - Activo (abierto con el contenido del pago) */}
                <div className="mobile-step-section active">
                    <div className="mobile-step-header">
                        <div className="step-info">
                            <span className="step-number">3</span>
                            <span className="step-title">Método de pago</span>
                        </div>
                        <div className="step-status">
                            <i className="bi bi-chevron-down"></i>
                        </div>
                    </div>
                    <div className="mobile-step-content">
                        {/* Contenido del método de pago */}
                        <div className="payment-method-content">
                            <h2 className="payment-method-title">Elige tu método de pago</h2>

                            <div className="payment-options">
                                {/* MercadoPago Option */}
                                <div
                                    className={`payment-option ${selectedMethod === 'mercadopago' ? 'selected' : ''}`}
                                    onClick={() => onMethodChange('mercadopago')}
                                >
                                    <div className="payment-option-header">
                                        <div className="payment-radio">
                                            <input
                                                type="radio"
                                                id="mercadopago"
                                                name="paymentMethod"
                                                value="mercadopago"
                                                checked={selectedMethod === 'mercadopago'}
                                                onChange={() => onMethodChange('mercadopago')}
                                            />
                                            <label htmlFor="mercadopago"></label>
                                        </div>

                                        <div className="payment-info">
                                            <h3 className="payment-title">
                                                <i className="payment-icon mp-icon"></i>
                                                MercadoPago
                                            </h3>
                                            <p className="payment-description">
                                                Pago online seguro con tarjeta, efectivo o transferencia
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* WhatsApp Option */}
                                <div
                                    className={`payment-option ${selectedMethod === 'whatsapp' ? 'selected' : ''}`}
                                    onClick={() => onMethodChange('whatsapp')}
                                >
                                    <div className="payment-option-header">
                                        <div className="payment-radio">
                                            <input
                                                type="radio"
                                                id="whatsapp"
                                                name="paymentMethod"
                                                value="whatsapp"
                                                checked={selectedMethod === 'whatsapp'}
                                                onChange={() => onMethodChange('whatsapp')}
                                            />
                                            <label htmlFor="whatsapp"></label>
                                        </div>

                                        <div className="payment-info">
                                            <h3 className="payment-title">
                                                <i className="bi bi-whatsapp payment-icon whatsapp-icon"></i>
                                                WhatsApp
                                            </h3>
                                            <p className="payment-description">
                                                Coordina el pago directamente con nuestro vendedor
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="terms-section">
                                <label className="terms-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={acceptTerms}
                                        onChange={(e) => setAcceptTerms(e.target.checked)}
                                    />
                                    <span className="checkmark"></span>
                                    <span className="terms-text">
                                        Acepto los <a href="/terminos" target="_blank">términos y condiciones</a> y la <a href="/privacidad" target="_blank">política de privacidad</a>
                                    </span>
                                </label>
                            </div>

                            {/* Payment Actions Mobile */}
                            <div className="mobile-payment-actions">
                                <button
                                    className="mobile-btn-back"
                                    onClick={onBack}
                                    disabled={isLoading}
                                >
                                    <i className="bi bi-arrow-left"></i>
                                    Volver al Checkout
                                </button>

                                <button
                                    className={`mobile-btn-pay ${selectedMethod}`}
                                    onClick={handleProceedPayment}
                                    disabled={isLoading || !acceptTerms}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner"></span>
                                            Procesando...
                                        </>
                                    ) : selectedMethod === 'mercadopago' ? (
                                        <>
                                            <i className="payment-icon mp-icon"></i>
                                            Pagar con MercadoPago
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-whatsapp"></i>
                                            Continuar por WhatsApp
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Security Notice */}
                            <div className="security-notice">
                                <i className="bi bi-shield-check"></i>
                                <span>Tu información está protegida con encriptación SSL</span>
                            </div>
                        </div>                        
                    </div>
                </div>
            </div>

            {/* Vista desktop - formulario tradicional */}
            <div className="desktop-payment">
                <h2 className="payment-method-title">Elige tu método de pago</h2>

                <div className="payment-options">
                    {/* MercadoPago Option */}
                    <div
                        className={`payment-option ${selectedMethod === 'mercadopago' ? 'selected' : ''}`}
                        onClick={() => onMethodChange('mercadopago')}
                    >
                        <div className="payment-option-header">
                            <div className="payment-radio">
                                <input
                                    type="radio"
                                    id="mercadopago-desktop"
                                    name="paymentMethod"
                                    value="mercadopago"
                                    checked={selectedMethod === 'mercadopago'}
                                    onChange={() => onMethodChange('mercadopago')}
                                />
                                <label htmlFor="mercadopago-desktop"></label>
                            </div>
                            <div className="payment-info">
                                <div className="payment-name">
                                    <i className="payment-icon mp-icon"></i>
                                    MercadoPago
                                </div>
                                <div className="payment-description">
                                    Tarjetas de crédito, débito y efectivo
                                </div>
                            </div>
                            <div className="payment-badges">
                                <span className="badge">Visa</span>
                                <span className="badge">Mastercard</span>
                                <span className="badge">+</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Option */}
                    <div
                        className={`payment-option ${selectedMethod === 'whatsapp' ? 'selected' : ''}`}
                        onClick={() => onMethodChange('whatsapp')}
                    >
                        <div className="payment-option-header">
                            <div className="payment-radio">
                                <input
                                    type="radio"
                                    id="whatsapp-desktop"
                                    name="paymentMethod"
                                    value="whatsapp"
                                    checked={selectedMethod === 'whatsapp'}
                                    onChange={() => onMethodChange('whatsapp')}
                                />
                                <label htmlFor="whatsapp-desktop"></label>
                            </div>
                            <div className="payment-info">
                                <div className="payment-name">
                                    <i className="bi bi-whatsapp"></i>
                                    WhatsApp
                                </div>
                                <div className="payment-description">
                                    Coordina el pago directamente por WhatsApp
                                </div>
                            </div>
                            <div className="payment-badges">
                                <span className="badge direct">Directo</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Terms and Conditions */}
                <div className="terms-section">
                    <label className="terms-checkbox">
                        <input
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => setAcceptTerms(e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        Acepto los <a href="/terms" target="_blank">términos y condiciones</a> y la <a href="/privacy" target="_blank">política de privacidad</a>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="payment-actions">
                    <button
                        type="button"
                        className="btn-back"
                        onClick={onBack}
                        disabled={isLoading}
                    >
                        <i className="bi bi-arrow-left"></i>
                        Volver
                    </button>

                    <button
                        type="button"
                        className={`btn-pay ${selectedMethod || ''}`}
                        onClick={handleProceedPayment}
                        disabled={isLoading || !selectedMethod || !acceptTerms}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Procesando...
                            </>
                        ) : selectedMethod === 'mercadopago' ? (
                            <>
                                <i className="payment-icon mp-icon"></i>
                                Pagar con MercadoPago
                            </>
                        ) : (
                            <>
                                <i className="bi bi-whatsapp"></i>
                                Continuar por WhatsApp
                            </>
                        )}
                    </button>
                </div>

                {/* Security Notice */}
                <div className="security-notice">
                    <i className="bi bi-shield-check"></i>
                    <span>Tu información está protegida con encriptación SSL</span>
                </div>
            </div>
        </div>
    );
}

export default PaymentMethod;