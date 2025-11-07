import React, { useState, useEffect, useRef } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { crearPreferenciaPago, formatearDatosOrden } from '../../services/pagoService';
import { useAuth } from '../../context/AuthContext';

// Fallback: usar la PUBLIC_KEY directamente si no está en process.env
const publicKey = process.env.REACT_APP_MERCADOPAGO_PUBLIC_KEY;
const isTestMode = publicKey && publicKey.includes('TEST');
// Inicializar solo una vez
let mercadoPagoInitialized = false;

if (publicKey && publicKey !== 'undefined' && !mercadoPagoInitialized) {
    try {
        initMercadoPago(publicKey);
        mercadoPagoInitialized = true;
    } catch (error) {
        console.error('❌ Error al inicializar MercadoPago:', error);
    }
} else if (!publicKey) {
    console.error('❌ No se encontró una PUBLIC_KEY válida');
}

const MercadoPagoButton = ({
    orderData,
    onPaymentCreated,
    onPaymentError,
    disabled = false,
    className = '',
    customization = {}
}) => {
    const { user } = useAuth(); // Obtener información del usuario autenticado
    const [preferenceId, setPreferenceId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const createPreferenceRef = useRef(false); // Para evitar múltiples llamadas
    const orderDataRef = useRef(null); // Para comparar orderData

    // Crear preferencia cuando se monta el componente o cambian los datos
    useEffect(() => {
        // Solo crear si hay orderData, no está disabled, no está en proceso y los datos cambiaron
        if (orderData && 
            !disabled && 
            !loading && 
            !createPreferenceRef.current &&
            JSON.stringify(orderData) !== JSON.stringify(orderDataRef.current)
        ) {
            orderDataRef.current = orderData;
            createPreference();
        }
    }, [orderData, disabled, loading, createPreference]);

    const createPreference = async () => {
        try {
            createPreferenceRef.current = true;
            setLoading(true);
            setError(null);
            setPreferenceId(null); // Limpiar preferenceId anterior

            // Validar orderData básico
            if (!orderData) {
                throw new Error('orderData es undefined o null');
            }

            // Intentar formatear datos
            let datosFormateados;
            try {                
                datosFormateados = formatearDatosOrden(
                    orderData.carrito,
                    orderData.customer,
                    orderData.shipping 
                );
                console.log('📋 Datos formateados:', JSON.stringify(datosFormateados, null, 2));
            } catch (formatError) {
                throw new Error(`Error al formatear datos: ${formatError.message}`);
            }

            // Intentar crear preferencia
            let response;
            try {
                console.log('📨 Enviando petición al backend...');
                console.log('👤 Usuario actual:', user);
                response = await crearPreferenciaPago(datosFormateados, user);
                console.log('📨 Respuesta recibida:', response);
            } catch (apiError) {
                throw new Error(`Error de API: ${apiError.message}`);
            }

            // Validar respuesta
            if (!response) {
                throw new Error('Respuesta vacía del servidor');
            }

            if (!response.success) {
                throw new Error(response.message || 'El servidor respondió con error');
            }

            if (!response.preferenceId) {
                console.error('❌ Respuesta sin preferenceId:', response);
                throw new Error('El servidor no devolvió un preferenceId válido');
            }

            console.log('✅ Preferencia creada exitosamente:', response.preferenceId);
            setPreferenceId(response.preferenceId);

            if (onPaymentCreated) {
                onPaymentCreated(response);
            }

        } catch (error) {
            console.error('❌ Error en createPreference:', error);
            setError(error.message);

            if (onPaymentError) {
                onPaymentError(error);
            }
        } finally {
            setLoading(false);
            createPreferenceRef.current = false;
            console.log('🏁 createPreference finalizado - loading:', false);
        }
    };

    // Estados del componente
    if (disabled) {
        return (
            <div className={`mercadopago-button-container disabled ${className}`}>
                <button disabled style={{ padding: '10px', opacity: 0.5 }}>
                    Pago no disponible
                </button>
            </div>
        );
    }

    if (loading) {
        return (
            <div className={`mercadopago-button-container loading ${className}`}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>Preparando pago...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`mercadopago-button-container error ${className}`}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p style={{ color: 'red', marginBottom: '10px' }}>❌ {error}</p>
                    <button
                        onClick={() => {
                            createPreferenceRef.current = false;
                            createPreference();
                        }}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px'
                        }}
                    >
                        Intentar nuevamente
                    </button>
                </div>
            </div>
        );
    }

    if (!preferenceId) {
        return (
            <div className={`mercadopago-button-container waiting ${className}`}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>⏳ Cargando opciones de pago...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`mercadopago-button-container ready ${className}`} key={preferenceId}>
            {/* Indicador de modo */}
            {isTestMode && (
                <div style={{ 
                    background: '#e8f5e8', 
                    border: '2px solid #28a745', 
                    padding: '12px', 
                    marginBottom: '15px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    textAlign: 'center',
                    color: '#155724',
                    fontWeight: '600'
                }}>
                    <strong>Modo de prueba activo</strong>
                    <br />
                    <small>Usa tarjetas de test para probar la integración</small>
                </div>
            )}
            
            <Wallet
                initialization={{
                    preferenceId: preferenceId,
                    redirectMode: 'blank'
                }}
            />
        </div>
    );
};

export default MercadoPagoButton;