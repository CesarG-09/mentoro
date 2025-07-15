const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verificarToken = require('../middlewares/authMiddleware');

// Rutas publicas
router.post('/registro-estudiante', authController.registroEstudiante);
router.post('/login', authController.login);
router.get('/facultades', authController.listaFacultades);
router.get('/carreras', authController.listaCarreras);

// Rutas protegidas (solo con token válido) EJEMPLO
router.get('/perfil', verificarToken, (req, res) => {
  res.json({
    mensaje: 'Acceso al perfil permitido',
    usuario: req.usuario
  });
});

module.exports = router;
