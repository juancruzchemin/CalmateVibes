const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');
const Carrito = require('../models/Carrito');
const Usuario = require('../models/Usuario');

// Inicializar el cliente de Mercado Pago con el token correcto
const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
const isTestMode = accessToken && accessToken.startsWith('TEST-');

console.log('🔑 Configurando MercadoPago con token:', accessToken ? accessToken.substring(0, 20) + '...' : 'NO CONFIGURADO');
console.log('🧪 Modo de prueba:', isTestMode ? 'ACTIVADO' : 'DESACTIVADO');

if (!accessToken) {
    console.error('❌ MERCADOPAGO_ACCESS_TOKEN no está configurado en .env');
}

const client = new MercadoPagoConfig({
    accessToken: accessToken,
    options: {
        timeout: 5000,
        integratorId: 'dev_24c65fb163bf11ea96500242ac130004'
    }
});

// Inicializar el servicio de preferencias
const preference = new Preference(client);

const crearPreferencia = async (req, res) => {
  try {
    console.log('💳 === CREAR PREFERENCIA DE PAGO ===');
    console.log('📦 Body recibido:', JSON.stringify(req.body, null, 2));

    const { items, total, payer, backUrls, auto_return, external_reference, usuario_id, session_id } = req.body;

    // Validaciones básicas
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error('❌ [Backend] Items inválidos:', { items, type: typeof items, isArray: Array.isArray(items) });
      return res.status(400).json({
        success: false,
        message: 'Items del carrito son requeridos'
      });
    }

    if (!payer || !payer.email) {
      console.error('❌ [Backend] Payer inválido:', { payer });
      return res.status(400).json({
        success: false,
        message: 'Información del pagador es requerida'
      });
    }

    // Configurar URLs base
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Crear external_reference con información del usuario/sesión
    const referenceData = {
      referencia: external_reference || `CV_${Date.now()}`,
      usuario_id: usuario_id || null,
      session_id: session_id || null,
      timestamp: Date.now()
    };

    console.log('🔗 External Reference Data:', referenceData);

    // Formatear preferencia para MercadoPago
    const preferenceData = {
      items: items.map((item, index) => ({
        id: String(item.id || `item_${index + 1}`),
        title: String(item.title || 'Producto'),
        description: String(item.description || 'Producto de CalmateVibes'),
        quantity: Math.max(1, parseInt(item.quantity) || 1),
        unit_price: Math.max(0.01, parseFloat(item.unit_price) || 0.01),
        currency_id: 'ARS'
      })),
      payer: {
        name: String(payer.name || 'Cliente'),
        surname: String(payer.surname || 'Test'),
        email: String(payer.email)
      },
      back_urls: {
        // success: `${frontendUrl}/payment/success`,
        // failure: `${frontendUrl}/payment/failure`,
        // pending: `${frontendUrl}/payment/pending`

        success: `https://calmatex.netlify.app/`,
        failure: `https://calmatex.netlify.app/`,
        pending: `https://calmatex.netlify.app/`,        
      },
      auto_return: 'approved',
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/pagos/webhook`,
      external_reference: JSON.stringify(referenceData)
    }
    const response = await preference.create({ body: preferenceData });
    
    // Verificar estructura antes de acceder
    const responseBody = response?.body || response;
    // Usar la estructura correcta según el SDK
    const responseData = response?.body || response;
    
    
    res.json({
      success: true,
      preferenceId: responseData?.id,
      initPoint: responseData?.init_point,
      sandboxInitPoint: responseData?.sandbox_init_point,
      externalReference: preferenceData.external_reference,
      total: total,
      metadata: {
        items_count: preferenceData.items.length,
        subtotal: total,
        envio: 0,
        descuento: 0
      }
    });

  } catch (error) {
    console.error('❌ [Backend] Error completo:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    res.status(500).json({
      success: false,
      message: 'Error al crear la preferencia de pago',
      error: error.message
    });
  }
};

// Procesar resultado del pago
const procesarResultado = async (req, res) => {
    try {
        console.log('📋 === PROCESANDO RESULTADO DE PAGO ===');
        console.log('🔍 Query params:', req.query);
        console.log('📦 Body:', req.body);

        const { 
            payment_id, 
            status, 
            external_reference, 
            merchant_order_id 
        } = req.query;

        if (status === 'approved' && payment_id) {
            console.log('✅ Pago aprobado, procesando...');

            // Extraer información del external_reference
            let usuarioId = null;
            let sessionId = null;

            if (external_reference) {
                try {
                    const refData = JSON.parse(external_reference);
                    usuarioId = refData.usuario_id;
                    sessionId = refData.session_id;
                    console.log('📋 Datos extraídos del external_reference:', { usuarioId, sessionId });
                } catch (e) {
                    console.log('⚠️ No se pudo parsear external_reference:', external_reference);
                }
            }

            // Procesar el pago exitoso
            const paymentData = {
                payment_id,
                external_reference,
                usuario_id: usuarioId,
                session_id: sessionId,
                payer_email: req.query.payer_email || req.body.payer_email,
                transaction_amount: req.query.transaction_amount || req.body.transaction_amount,
                payment_method_id: req.query.payment_method_id || req.body.payment_method_id,
                payment_type_id: req.query.payment_type_id || req.body.payment_type_id
            };

            try {
                const resultado = await procesarPagoExitoso(paymentData);
                console.log('🎉 Pago procesado exitosamente:', resultado);

                return res.json({
                    success: true,
                    message: 'Pago procesado exitosamente',
                    pedidoId: resultado.pedidoId
                });
            } catch (processingError) {
                console.error('❌ Error procesando pago exitoso:', processingError);
                return res.status(500).json({
                    success: false,
                    message: 'Error procesando el pago exitoso: ' + processingError.message
                });
            }
        }

        // Para otros estados (pending, rejected, etc.)
        res.json({
            success: true,
            message: 'Resultado procesado correctamente',
            status,
            payment_id
        });

    } catch (error) {
        console.error('❌ Error procesando resultado:', error);
        res.status(500).json({
            success: false,
            message: 'Error al procesar el resultado del pago'
        });
    }
};

const crypto = require('crypto');

// Webhook para notificaciones de MercadoPago - IMPLEMENTACIÓN OFICIAL
const webhook = async (req, res) => {
    try {
        console.log('🔔 === WEBHOOK MERCADOPAGO RECIBIDO ===');
        console.log('📦 Body completo:', JSON.stringify(req.body, null, 2));
        console.log('🔗 Query params:', JSON.stringify(req.query, null, 2));
        console.log('📋 Headers relevantes:', {
            'x-signature': req.headers['x-signature'],
            'x-request-id': req.headers['x-request-id'],
            'user-agent': req.headers['user-agent']
        });

        // 1. VALIDAR FIRMA DEL WEBHOOK (Seguridad)
        const xSignature = req.headers['x-signature'];
        const xRequestId = req.headers['x-request-id'];
        
        if (xSignature && process.env.MERCADOPAGO_WEBHOOK_SECRET) {
            try {
                const isValid = validateWebhookSignature(req, xSignature, xRequestId);
                if (!isValid) {
                    console.error('❌ Firma del webhook inválida');
                    return res.status(401).json({ error: 'Invalid signature' });
                }
                console.log('✅ Firma del webhook validada correctamente');
            } catch (signatureError) {
                console.error('❌ Error validando firma:', signatureError);
                // Continuar sin validación en desarrollo
                if (process.env.NODE_ENV === 'production') {
                    return res.status(401).json({ error: 'Signature validation failed' });
                }
            }
        } else {
            console.log('⚠️ Sin validación de firma (falta MERCADOPAGO_WEBHOOK_SECRET o x-signature)');
        }

        // 2. PROCESAR NOTIFICACIÓN
        const { type, data } = req.body;

        if (type === 'payment' && data && data.id) {
            console.log('💳 Notificación de pago recibida. Payment ID:', data.id);
            
            try {
                // 3. OBTENER DATOS COMPLETOS DEL PAGO DESDE MERCADOPAGO API
                const paymentDetails = await getPaymentDetails(data.id);
                console.log('💰 Detalles del pago obtenidos:', {
                    id: paymentDetails.id,
                    status: paymentDetails.status,
                    transaction_amount: paymentDetails.transaction_amount,
                    external_reference: paymentDetails.external_reference
                });

                // 4. PROCESAR SOLO PAGOS APROBADOS
                if (paymentDetails.status === 'approved') {
                    console.log('✅ Pago aprobado, procesando automáticamente...');

                    // Extraer información del external_reference
                    let usuarioId = null;
                    let sessionId = null;

                    if (paymentDetails.external_reference) {
                        try {
                            const refData = JSON.parse(paymentDetails.external_reference);
                            usuarioId = refData.usuario_id;
                            sessionId = refData.session_id;
                            console.log('📋 Datos extraídos del external_reference:', { usuarioId, sessionId });
                        } catch (e) {
                            console.log('⚠️ No se pudo parsear external_reference:', paymentDetails.external_reference);
                        }
                    }

                    // 5. PROCESAR PAGO EXITOSO (CREAR PEDIDO, ACTUALIZAR STOCK, VACIAR CARRITO)
                    const paymentData = {
                        payment_id: paymentDetails.id,
                        external_reference: paymentDetails.external_reference,
                        usuario_id: usuarioId,
                        session_id: sessionId,
                        payer_email: paymentDetails.payer?.email,
                        transaction_amount: paymentDetails.transaction_amount,
                        payment_method_id: paymentDetails.payment_method_id,
                        payment_type_id: paymentDetails.payment_type_id
                    };

                    try {
                        const resultado = await procesarPagoExitoso(paymentData);
                        console.log('� Pago procesado exitosamente via webhook:', resultado);
                    } catch (processingError) {
                        console.error('❌ Error procesando pago exitoso via webhook:', processingError);
                        // No fallar el webhook por errores de procesamiento interno
                    }
                } else {
                    console.log(`⚠️ Pago con estado: ${paymentDetails.status} - No se procesa automáticamente`);
                }

            } catch (apiError) {
                console.error('❌ Error obteniendo detalles del pago desde MP API:', apiError);
            }
        } else {
            console.log(`📝 Notificación de tipo: ${type} - No es payment`);
        }

        // 6. RESPONDER SIEMPRE CON 200 (REQUERIDO POR MERCADOPAGO)
        res.status(200).json({ 
            success: true, 
            message: 'Webhook procesado correctamente',
            type: type,
            data_id: data?.id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error general en webhook:', error);
        // Siempre responder con 200 para evitar reintentos innecesarios
        res.status(200).json({ 
            success: false, 
            message: 'Webhook recibido con errores',
            error: error.message
        });
    }
};

// Función para validar firma del webhook según documentación oficial
const validateWebhookSignature = (req, xSignature, xRequestId) => {
    const dataId = req.query['data.id'] || '';
    
    // Extraer ts y hash del x-signature
    const parts = xSignature.split(',');
    let ts = null;
    let hash = null;

    parts.forEach(part => {
        const [key, value] = part.split('=');
        if (key?.trim() === 'ts') ts = value?.trim();
        if (key?.trim() === 'v1') hash = value?.trim();
    });

    if (!ts || !hash) {
        throw new Error('Invalid x-signature format');
    }

    // Crear manifest según template oficial
    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    
    // Calcular HMAC SHA256
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    const cyphedSignature = crypto.createHmac('sha256', secret).update(manifest).digest('hex');
    
    console.log('🔐 Validación de firma:', {
        manifest,
        expected: hash,
        calculated: cyphedSignature,
        match: cyphedSignature === hash
    });

    return cyphedSignature === hash;
};

// Función para obtener detalles completos del pago desde MercadoPago API
const getPaymentDetails = async (paymentId) => {
    try {
        console.log('🔍 Obteniendo detalles del pago:', paymentId);
        
        // Usar la SDK de MercadoPago en lugar de fetch
        const { Payment } = require('mercadopago');
        const payment = new Payment(mercadopagoClient);
        
        const paymentData = await payment.get({ id: paymentId });
        console.log('✅ Detalles del pago obtenidos exitosamente');
        
        return paymentData;
    } catch (error) {
        console.error('❌ Error obteniendo detalles del pago:', error);
        throw error;
    }
};

// Verificar estado del pago
const verificarEstado = async (req, res) => {
    try {
        const { paymentId, externalReference } = req.params;

        res.json({
            success: true,
            message: 'Estado verificado',
            paymentId,
            externalReference
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al verificar el estado del pago'
        });
    }
};

// Ruta de prueba
const test = async (req, res) => {
    res.json({
        success: true,
        message: '🚀 API de pagos funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        hasAccessToken: !!accessToken
    });
};

// Función para procesar pago exitoso - CREAR PEDIDO, ACTUALIZAR STOCK, VACIAR CARRITO
const procesarPagoExitoso = async (paymentData) => {
    try {
        console.log('🏆 === PROCESANDO PAGO EXITOSO ===');
        console.log('💰 Datos del pago:', JSON.stringify(paymentData, null, 2));

        const { 
            payment_id, 
            external_reference, 
            usuario_id, 
            session_id,
            payer_email,
            transaction_amount,
            payment_method_id,
            payment_type_id
        } = paymentData;

        // 1. Obtener el carrito del usuario o sesión
        let carrito;
        if (usuario_id) {
            console.log('👤 Buscando carrito para usuario:', usuario_id);
            carrito = await Carrito.findOne({ 
                usuario: usuario_id, 
                activo: true 
            }).populate('items.producto');
        } else if (session_id) {
            console.log('🔄 Buscando carrito para sesión:', session_id);
            carrito = await Carrito.findOne({ 
                sessionId: session_id, 
                activo: true 
            }).populate('items.producto');
        }

        if (!carrito || !carrito.items || carrito.items.length === 0) {
            throw new Error('No se encontró carrito o está vacío');
        }

        console.log('🛒 Carrito encontrado con', carrito.items.length, 'items');

        // 2. Verificar stock disponible
        for (const item of carrito.items) {
            const producto = await Producto.findById(item.producto._id);
            if (!producto) {
                throw new Error(`Producto ${item.producto.nombre} no encontrado`);
            }
            if (producto.stock < item.cantidad) {
                throw new Error(`Stock insuficiente para ${producto.nombre}. Disponible: ${producto.stock}, solicitado: ${item.cantidad}`);
            }
        }

        console.log('✅ Stock verificado correctamente');

        // 3. Obtener información del usuario (si existe)
        let usuario = null;
        if (usuario_id) {
            usuario = await Usuario.findById(usuario_id);
            console.log('👤 Usuario encontrado:', usuario?.email);
        }

        // 4. Crear el pedido
        const itemsPedido = carrito.items.map(item => ({
            producto: item.producto._id,
            cantidad: item.cantidad,
            precioUnitario: item.producto.precioVenta,
            subtotal: item.cantidad * item.producto.precioVenta
        }));

        const subtotal = itemsPedido.reduce((sum, item) => sum + item.subtotal, 0);

        const nuevoPedido = new Pedido({
            usuario: usuario ? usuario._id : null,
            
            // Datos de contacto
            datosContacto: {
                nombre: usuario ? usuario.nombre : 'Usuario Invitado',
                apellido: usuario ? usuario.apellido : '',
                email: payer_email || (usuario ? usuario.email : 'no-disponible@example.com'),
                telefono: usuario ? usuario.telefono : ''
            },

            // Items del pedido
            items: itemsPedido,

            // Dirección por defecto (será actualizada por el usuario después)
            direccionEnvio: usuario && usuario.direccion ? usuario.direccion : {
                calle: 'Por definir',
                numero: '0',
                ciudad: 'Por definir',
                provincia: 'Por definir',
                codigoPostal: '0000',
                pais: 'Argentina'
            },

            // Totales
            subtotal: subtotal,
            costoEnvio: 0,
            descuentos: 0,
            total: subtotal,

            // Estado inicial
            estado: 'confirmado', // Ya está pagado

            // Método de pago
            metodoPago: {
                tipo: 'mercadopago',
                estado: 'pagado',
                transaccionId: payment_id
            },

            // Tipo de envío por defecto
            envio: {
                tipo: 'retiro_local'
            },

            // Información de MercadoPago
            mercadoPago: {
                paymentId: payment_id,
                externalReference: external_reference,
                paymentStatus: 'approved',
                paymentMethod: payment_method_id,
                paymentType: payment_type_id,
                transactionAmount: transaction_amount,
                dateApproved: new Date(),
                dateCreated: new Date()
            },

            // Historial de estados
            historialEstados: [
                {
                    estado: 'pendiente',
                    fecha: new Date(),
                    comentario: 'Pedido creado por pago exitoso de MercadoPago'
                },
                {
                    estado: 'confirmado',
                    fecha: new Date(),
                    comentario: `Pago confirmado. ID: ${payment_id}`
                }
            ]
        });

        const pedidoGuardado = await nuevoPedido.save();
        console.log('✅ Pedido creado exitosamente:', pedidoGuardado._id);

        // 5. Actualizar stock de productos
        for (const item of carrito.items) {
            const producto = await Producto.findById(item.producto._id);
            const stockAnterior = producto.stock;
            producto.stock -= item.cantidad;
            await producto.save();
            console.log(`📦 Stock actualizado para ${producto.nombre}: ${stockAnterior} -> ${producto.stock}`);
        }

        // 6. Vaciar el carrito
        carrito.items = [];
        carrito.activo = false; // Desactivar el carrito
        await carrito.save();
        console.log('🛒 Carrito vaciado exitosamente');

        // 7. Si hay usuario, crear un nuevo carrito activo
        if (usuario_id) {
            const nuevoCarrito = new Carrito({
                usuario: usuario_id,
                items: [],
                activo: true
            });
            await nuevoCarrito.save();
            console.log('🆕 Nuevo carrito creado para el usuario');
        }

        console.log('🎉 Pago procesado exitosamente. Pedido ID:', pedidoGuardado._id);

        return {
            success: true,
            pedidoId: pedidoGuardado._id,
            mensaje: 'Pago procesado exitosamente'
        };

    } catch (error) {
        console.error('❌ Error al procesar pago exitoso:', error);
        throw error;
    }
};

module.exports = {
    crearPreferencia,
    procesarResultado,
    procesarPagoExitoso,
    webhook,
    verificarEstado,
    test
};