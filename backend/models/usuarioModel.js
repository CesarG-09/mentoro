const pool = require('../config/db');

async function registrarEstudiante(data) {
  const { 
    usuario, 
    clave_hash, 
    tipo_usuario, 
    nombre, 
    apellido, 
    correo_utp, 
    fe_nacimiento, 
    id_carrera 
  } = data;

  const { rows } = await pool.query(
    `SELECT public.registrar_estudiante($1, $2, $3, $4, $5, $6, $7, $8) AS resultado`,
    [usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera]
  );

  return rows[0].resultado;
}

async function registrarTutor(data) {
  const { 
    usuario, 
    clave_hash, 
    tipo_usuario, 
    nombre, 
    apellido, 
    correo_utp, 
    fe_nacimiento, 
    dias_disponibles, 
    horas_inicio, 
    horas_fin, 
    materias, 
    precios_materias  
  } = data;

  const { rows } = await pool.query(
    `SELECT public.registrar_tutor($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) AS resultado`,
    [usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, dias_disponibles, horas_inicio, horas_fin, materias, precios_materias]
  );

  return rows[0].resultado;
}

async function buscarUsuario(usuario) {
  const resultado = await pool.query(
    `SELECT * 
     FROM Usuario
     WHERE usuario = $1 AND estado = 'activo'`,
    [usuario]
  );
  return resultado.rows[0];
}

async function listarFacultades() {
	const resultado = await pool.query(
		'SELECT * FROM facultad'
	);
	return resultado.rows;
}

async function listarCarreras(facultad) {
  const resultado = await pool.query(
    `SELECT 
        C.id_carrera,
        C.de_carrera
     FROM Carrera C
     JOIN Facultad F ON C.id_facultad = F.id_facultad
     WHERE F.de_facultad = $1`,
     [facultad]
  );
  return resultado.rows;
}

async function listarMaterias() {
  const resultado = await pool.query(
    `SELECT id_materia, de_materia FROM Materia`
  );
  return resultado.rows;
}

async function totalizarEstudiantes() {
  const resultado = await pool.query(
    `SELECT 
      COUNT(*) 
     FROM Estudiante e
     JOIN Usuario u ON e.id_usuario = u.id_usuario
     WHERE u.estado = 'activo'`
  );
  return resultado.rows[0];
}

async function totalizarTutores() {
  const resultado = await pool.query(
    `SELECT 
      COUNT(*) 
     FROM Tutor t
     JOIN Usuario u ON u.id_usuario = t.id_usuario
     WHERE u.estado = 'activo'`
  );
  return resultado.rows[0];
}

async function totalizarReservasFinalizadas() {
  const resultado = await pool.query(
    `SELECT COUNT(*) FROM Reserva
     WHERE estado_reserva IN ('Aceptada') AND estado_tutoria IN ('Finalizada')`
  );
  return resultado.rows[0];
}

async function listarTutores() {
  const resultado = await pool.query(
    `SELECT * FROM tutor_materia_cal();`
  );
  return resultado.rows;
}

async function verTutor(id_tutor) {
  const resultado = await pool.query(
    `SELECT * FROM resumen_tutor($1)`,
    [id_tutor]
  );
  return resultado.rows[0];
}

async function graficarAceptVsRechaz() {
  const resultado = await pool.query(
    `SELECT * FROM grafica_aceptada_rechazada`
  );
  return resultado.rows;
}

async function graficarMaterias() {
  const resultado = await pool.query(
    `SELECT * FROM top_materias_mes_actual`
  );
  return resultado.rows;
}

async function listarEstudiantes() {
  const resultado = await pool.query(
    `SELECT * FROM listado_estudiantes_administración`
  );
  return resultado.rows;
}

async function verEstudiante(id_estudiante) {
  const resultado = await pool.query(
    `SELECT * FROM resumen_estudiante($1)`,
    [id_estudiante]
  );
  return resultado.rows[0];
}

async function listarTopMaterias() {
  const resultado = await pool.query(
    `SELECT 
         m.de_materia AS materia,
         m.descripcion AS descripcion,
         COUNT(*) AS total_reservas
     FROM Reserva r
     JOIN Materia m ON r.id_materia = m.id_materia
     WHERE r.estado_tutoria = 'Finalizada'
     GROUP BY m.de_materia, m.descripcion
     ORDER BY total_reservas DESC, m.de_materia ASC
     LIMIT 4;`
  );
  return resultado.rows;
}

async function listarTopTutores() {
  const resultado = await pool.query(
    `SELECT 
         CONCAT(t.nombre, ' ', t.apellido) AS nombre,
         string_agg(DISTINCT m.de_materia, ', ') AS materias,
         COALESCE(ROUND(AVG(e.calificacion))::INTEGER, 0) AS calificacion,
         COUNT(r.id_reserva) AS total_finalizadas
     FROM Tutor t
     JOIN Tutor_materia tm ON t.id_tutor = tm.id_tutor
     JOIN Materia m ON tm.id_materia = m.id_materia
     LEFT JOIN Eval_tutor e ON t.id_tutor = e.id_tutor
     JOIN Reserva r ON r.id_tutor = t.id_tutor AND r.estado_tutoria = 'Finalizada'
     GROUP BY t.id_tutor, t.nombre, t.apellido
     ORDER BY total_finalizadas DESC, nombre ASC
     LIMIT 3;`
  );
  return resultado.rows;
}

async function listarTutorias(usuario) {
  const resultado = await pool.query(
    `SELECT
         r.estado_reserva,
         m.de_materia AS materia,
         CONCAT(t.nombre, ' ', t.apellido) AS tutor,
         TO_CHAR(r.fe_reserva, 'DD TMMonth YYYY') AS fecha
     FROM Reserva r
     JOIN Materia m ON r.id_materia = m.id_materia
     JOIN Tutor t ON r.id_tutor = t.id_tutor
     JOIN Estudiante e ON r.id_estudiante = e.id_estudiante
     JOIN Usuario u ON e.id_usuario = u.id_usuario
     WHERE u.usuario = $1
       AND (
             (r.estado_reserva = 'En espera' AND r.estado_tutoria = 'Pendiente')
         OR (r.estado_reserva = 'Aceptada' AND r.estado_tutoria = 'En progreso')
           )
     ORDER BY r.fe_reserva ASC;`,
     [usuario]
  );
  return resultado.rows;
}

module.exports = {
  registrarEstudiante,
  registrarTutor,
  buscarUsuario,
  listarFacultades,
  listarCarreras,
  listarMaterias,
  totalizarEstudiantes,
  totalizarTutores,
  totalizarReservasFinalizadas,
  graficarAceptVsRechaz,
  graficarMaterias,
  listarTutores,
  verTutor,
  listarEstudiantes,
  verEstudiante,
  listarTopMaterias,
  listarTopTutores,
  listarTutorias
};
