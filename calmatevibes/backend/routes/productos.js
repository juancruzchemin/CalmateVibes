const express = require('express');
const router = express.Router();

// GET - Obtener todos los productos
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de productos funcionando',
    data: []
  });
});

// GET - Obtener producto por ID
router.get('/:id', (req, res) => {
  res.json({
    success: true,
    message: `Producto con ID: ${req.params.id}`,
    data: {}
  });
});

// POST - Crear producto
router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'Producto creado',
    data: req.body
  });
});

module.exports = router;