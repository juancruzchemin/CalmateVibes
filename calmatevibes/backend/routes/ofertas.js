const express = require('express');
const router = express.Router();
const ofertaController = require('../controllers/ofertaController');
const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', ofertaController.getOfertas);
router.get('/:id', ofertaController.getOfertaById);
router.get('/categoria/:categoria', ofertaController.getOfertasByCategoria);
router.get('/calcular/:productoId', ofertaController.calcularPrecioDescuento);

// Rutas protegidas (admin)
router.post('/', protect, admin, ofertaController.createOferta);
router.put('/:id', protect, admin, ofertaController.updateOferta);
router.delete('/:id', protect, admin, ofertaController.deleteOferta);
router.delete('/categoria/:categoria', protect, admin, ofertaController.deleteOfertaCategoria);

module.exports = router;
