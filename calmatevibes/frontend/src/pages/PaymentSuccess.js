import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { procesarResultadoPago, verificarEstadoPago, procesarPagoEnBackend } from '../services/pagoService';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './styles/PaymentResult.css';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [paymentResult, setPaymentResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const processPaymentResult = async () => {
            try {
                // Obtener parámetros de MercadoPago
                const status = searchParams.get('status') || 'approved';
                const payment_id = searchParams.get('payment_id');
                const external_reference = searchParams.get('external_reference');
                const payment_type = searchParams.get('payment_type');
                const merchant_order_id = searchParams.get('merchant_order_id');

                console.log('🎉 Procesando resultado de pago exitoso:', {
                    status,
                    payment_id,
                    external_reference,
                    payment_type,
                    merchant_order_id,
                    allParams: Object.fromEntries(searchParams.entries())
                });

                // Procesar resultado localmente primero
                const resultadoLocal = procesarResultadoPago({
                    status,
                    payment_id,
                    external_reference,
                    payment_type,
                    merchant_order_id
                });

                setPaymentResult(resultadoLocal);

                // ¡IMPORTANTE! Procesar pago en backend para crear pedido y actualizar stock
                try {
                    console.log('🏆 Procesando pago exitoso en backend...');
                    const backendResult = await procesarPagoEnBackend(searchParams);
                    console.log('✅ Pago procesado exitosamente en backend:', backendResult);
                    
                    // Actualizar el resultado con información del backend
                    setPaymentResult(prev => ({
                        ...prev,
                        pedidoId: backendResult.pedidoId,
                        backendProcessed: true,
                        backendMessage: backendResult.message || 'Pedido creado exitosamente'
                    }));
                    
                } catch (backendError) {
                    console.error('❌ Error procesando en backend:', backendError);
                    // No falla la página, solo muestra advertencia
                    setPaymentResult(prev => ({
                        ...prev,
                        backendProcessed: false,
                        backendError: backendError.message
                    }));
                }

                // Limpiar localStorage
                localStorage.removeItem('mp_external_reference');
                localStorage.removeItem('mp_preference_id');

            } catch (error) {
                console.error('❌ Error procesando resultado:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        processPaymentResult();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="payment-result-page">
                <Header />
                <div className="payment-result-container">
                    <div className="loading-payment">
                        <div className="loading-spinner"></div>
                        <h2>Procesando resultado del pago...</h2>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-result-page">
                <Header />
                <div className="payment-result-container">
                    <div className="payment-error">
                        <div className="error-icon">❌</div>
                        <h2>Error al procesar el pago</h2>
                        <p>{error}</p>
                        <div className="error-actions">
                            <Link to="/cart" className="btn btn-primary">
                                Volver al carrito
                            </Link>
                            <Link to="/" className="btn btn-secondary">
                                Ir al inicio
                            </Link>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const { estado, mensaje, esExitoso, detalles } = paymentResult;

    return (
        <div className="payment-result-page">
            <Header />
            <div className="payment-result-container">
                <div className={`payment-result ${esExitoso ? 'success' : 'info'}`}>
                    <div className="result-icon">
                        {esExitoso ? '✅' : '⏳'}
                    </div>
                    
                    <h1 className="result-title">
                        {esExitoso ? '¡Pago Exitoso!' : 'Pago en Proceso'}
                    </h1>
                    
                    <p className="result-message">{mensaje}</p>
                    
                    {detalles && (
                        <div className="payment-details">
                            <h3>Detalles del Pago</h3>
                            <div className="details-grid">
                                {detalles.payment_id && (
                                    <div className="detail-item">
                                        <span className="label">ID de Pago:</span>
                                        <span className="value">{detalles.payment_id}</span>
                                    </div>
                                )}
                                {detalles.external_reference && (
                                    <div className="detail-item">
                                        <span className="label">Referencia:</span>
                                        <span className="value">{detalles.external_reference}</span>
                                    </div>
                                )}
                                {detalles.payment_type && (
                                    <div className="detail-item">
                                        <span className="label">Método de Pago:</span>
                                        <span className="value">{detalles.payment_type}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    
                    <div className="result-actions">
                        {esExitoso ? (
                            <>
                                <Link to="/mis-pedidos" className="btn btn-primary">
                                    Ver mis pedidos
                                </Link>
                                <Link to="/" className="btn btn-secondary">
                                    Continuar comprando
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/cart" className="btn btn-primary">
                                    Volver al carrito
                                </Link>
                                <Link to="/" className="btn btn-secondary">
                                    Ir al inicio
                                </Link>
                            </>
                        )}
                    </div>

                    {esExitoso && (
                        <div className="success-info">
                            <p>
                                <strong>¿Qué sigue?</strong><br/>
                                Te enviaremos un email con los detalles de tu pedido. 
                                Puedes hacer seguimiento del estado en la sección "Mis Pedidos".
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PaymentSuccess;