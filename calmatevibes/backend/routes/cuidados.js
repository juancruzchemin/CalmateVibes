const express = require('express');
const router = express.Router();
const {
  getCuidados,
  getCuidado,
  createCuidado,
  updateCuidado,
  deleteCuidado
} = require('../controllers/cuidadoController');

const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.get('/', getCuidados);
router.get('/:id', getCuidado);

// Rutas protegidas (solo admin)
router.post('/', protect, admin, createCuidado);
router.put('/:id', protect, admin, updateCuidado);
router.delete('/:id', protect, admin, deleteCuidado);

module.exports = router;