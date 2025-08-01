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
router.get('/grafica-vs', verificarToken, authController.graficaAceptVsRechaz);
router.get('/grafica-materias', verificarToken, authController.graficaMaterias);
router.get('/ver-tutor', verificarToken, authController.muestraTutor);
router.get('/lista-estudiantes', verificarToken, authController.listaEstudiantes);
router.get('/ver-estudiante', verificarToken, authController.muestraEstudiante);
router.get('/top-materias', verificarToken, authController.topMaterias);
router.get('/top-tutores', verificarToken, authController.topTutores);
router.get('/lista-tutorias', verificarToken, authController.listaTutorias);
router.get('/estado-usuario', verificarToken, authController.estadoUsuario);
router.post('/cambia-estado', verificarToken, authController.cambioEstadoUsuario);
router.get('/datos-tutor', verificarToken, authController.datosTutor);
router.get('/tutorias-en-espera', verificarToken, authController.listaTutoriasEnEspera);
router.get('/tutorias-activas', verificarToken, authController.listaTutoriasAceptadas);
router.post('/cambia-estado-reserva', verificarToken, authController.cambioEstadoReserva);
router.get('/tutorias-finalizadas', verificarToken, authController.listaTutoriasFinalizadas);
router.post('/calificar-estudiante', verificarToken, authController.calificaEstudiante);
router.get('/ver-materias-tutor', verificarToken, authController.muestraMateriasTutor);
router.get('/evaluar-fechas', authController.evaluaFechasReserva);
router.post('/realizar-reserva', authController.realizaReserva);

module.exports = router;
