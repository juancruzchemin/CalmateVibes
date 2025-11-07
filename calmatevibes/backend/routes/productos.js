const express = require('express');
const router = express.Router();
const {
  getProductos,
  getProducto,
  createProducto,
  updateProducto,
  deleteProducto,
  actualizarStock,
  getProductosByCategoria,
  searchProductos,
  getProductosDestacados,
  getInventarioResumen
} = require('../controllers/productoController');

const { protect, admin } = require('../middleware/auth');

// Rutas públicas (deben ir antes de las rutas con parámetros)
router.get('/search', searchProductos);
router.get('/destacados', getProductosDestacados);
router.get('/categoria/:categoria', getProductosByCategoria);
router.get('/', getProductos);
router.get('/:id', getProducto);

// Rutas protegidas (solo admin)
router.get('/resumen', protect, admin, getInventarioResumen);
router.post('/', protect, admin, createProducto);
router.put('/:id', protect, admin, updateProducto);
router.put('/:id/stock', protect, admin, actualizarStock);
router.delete('/:id', protect, admin, deleteProducto);

module.exports = router;