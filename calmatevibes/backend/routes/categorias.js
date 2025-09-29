const express = require('express');
const router = express.Router();

// GET - Obtener todas las categorías
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Endpoint de categorías funcionando',
    data: [
      { id: 1, nombre: 'mates' },
      { id: 2, nombre: 'bombillas' },
      { id: 3, nombre: 'combos' }
    ]
  });
});

module.exports = router;