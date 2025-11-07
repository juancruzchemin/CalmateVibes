const express = require('express');
const router = express.Router();
const {
  registrarUsuario,
  loginUsuario,
  obtenerPerfil,
  actualizarPerfil,
  cambiarPassword,
  agregarDireccion,
  actualizarDireccion,
  eliminarDireccion,
  solicitarResetPassword,
  resetPassword,
  obtenerUsuarios
} = require('../controllers/usuarioController');

const { protect, admin } = require('../middleware/auth');

// Rutas públicas
router.post('/registro', registrarUsuario);
router.post('/login', loginUsuario);
router.post('/solicitar-reset-password', solicitarResetPassword);
router.put('/reset-password/:token', resetPassword);

// Rutas protegidas (requieren autenticación)
router.use(protect); // Middleware aplicado a todas las rutas siguientes

// Perfil del usuario
router.route('/perfil')
  .get(obtenerPerfil)
  .put(actualizarPerfil);

// Cambio de contraseña
router.put('/cambiar-password', cambiarPassword);

// Gestión de direcciones
router.post('/direcciones', agregarDireccion);
router.route('/direcciones/:direccionId')
  .put(actualizarDireccion)
  .delete(eliminarDireccion);

// Rutas de administrador
router.get('/', admin, obtenerUsuarios);

module.exports = router;