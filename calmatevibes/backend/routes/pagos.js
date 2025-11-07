const express = require('express');
const router = express.Router();

// Importar el controlador
const {
    crearPreferencia,
    procesarResultado,
    procesarPagoExitoso,
    webhook,
    verificarEstado,
    test
} = require('../controllers/pagoController');

// Ruta de prueba
router.get('/test', test);

// Crear preferencia de pago
router.post('/crear-preferencia', crearPreferencia);

// Procesar resultado del pago
router.post('/procesar-resultado', procesarResultado);
router.get('/procesar-resultado', procesarResultado); // También permitir GET

// Webhook de MercadoPago
router.post('/webhook', webhook);

// Verificar estado del pago
router.get('/verificar/:paymentId/:externalReference', verificarEstado);

module.exports = router;