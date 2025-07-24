const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

// Rutas publicas
router.post('/registro-estudiante', authController.registroEstudiante);
router.post('/registro-tutor', authController.registroTutor);
router.post('/login', authController.login);
router.get('/facultades', authController.listaFacultades);
router.get('/carreras', authController.listaCarreras);
router.get('/materias', authController.listaMaterias);

// Rutas protegidas (solo con token válido)
router.get('/total-estudiantes', verificarToken, authController.totalizaEstudiantes);
router.get('/total-tutores', verificarToken, authController.totalizaTutores);
router.get('/total-reservas-finalizadas', verificarToken, authController.totalizaReservasFinalizadas);
router.get('/lista-tutores', verificarToken, authController.listaTutores);
router.get('/ver-tutor', verificarToken, authController.muestraTutor);
router.get('/grafica-vs', verificarToken, authController.graficaAceptVsRechaz);
router.get('/grafica-materias', verificarToken, authController.graficaMaterias);
router.get('/grafica-materias', verificarToken, authController.graficaMaterias);
router.get('/lista-estudiantes', verificarToken, authController.listaEstudiantes);
router.get('/ver-estudiante', verificarToken, authController.muestraEstudiante);

module.exports = router;
