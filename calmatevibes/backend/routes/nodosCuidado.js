const express = require('express');
const router = express.Router();
const { getAll, crear, actualizar, eliminar } = require('../controllers/nodoCuidadoController');
const { protect, admin } = require('../middleware/auth');

router.get('/', getAll);
router.post('/', protect, admin, crear);
router.put('/:id', protect, admin, actualizar);
router.delete('/:id', protect, admin, eliminar);

module.exports = router;
