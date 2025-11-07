const express = require('express');
const router = express.Router();
const {
  obtenerCarrito,
  agregarProducto,
  actualizarCantidad,
  eliminarProducto,
  limpiarCarrito,
  aplicarDescuento,
  removerDescuento,
  migrarCarrito,
  validarCarrito
} = require('../controllers/carritoController');

const { optionalAuth } = require('../middleware/auth');

// Middleware opcional para autenticación (permite invitados)
router.use(optionalAuth);

// Obtener carrito actual
router.get('/', obtenerCarrito);

// Validar carrito (verificar stock, precios, etc.)
router.get('/validar', validarCarrito);

// Agregar producto al carrito
router.post('/agregar', agregarProducto);

// Actualizar cantidad de producto
router.put('/actualizar', actualizarCantidad);

// Eliminar producto específico
router.delete('/eliminar/:productoId', eliminarProducto);

// Limpiar todo el carrito
router.delete('/limpiar', limpiarCarrito);

// Aplicar código de descuento
router.post('/descuento', aplicarDescuento);

// Remover código de descuento
router.delete('/descuento/:codigo', removerDescuento);

// Migrar carrito de invitado a usuario registrado (requiere auth)
const { protect } = require('../middleware/auth');
router.post('/migrar', protect, migrarCarrito);

module.exports = router;