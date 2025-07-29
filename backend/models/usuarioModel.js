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
    `SELECT * FROM top_materias`
  );
  return resultado.rows;
}

async function listarTopTutores() {
  const resultado = await pool.query(
    `SELECT * FROM top_tutores`
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
         OR (r.estado_reserva = 'Aceptada' AND r.estado_tutoria = 'En Progreso')
           )
     ORDER BY r.fe_reserva ASC;`,
     [usuario]
  );
  return resultado.rows;
}

async function verEstadoUsuario(id_usuario) {
  const resultado = await pool.query(
    `SELECT
       u.usuario,
       u.estado
     FROM Usuario u
     WHERE u.id_usuario = $1;
     `,
     [id_usuario]
  );
  return resultado.rows[0];
}

async function cambiarEstadoUsuario(estado, id_usuario) {
  const resultado = await pool.query(
    `UPDATE Usuario
     SET 
         estado = $1,
         fe_eliminacion = CASE 
                             WHEN $1 = 'activo' THEN NULL
                             WHEN $1 = 'eliminado' THEN CURRENT_TIMESTAMP
                             ELSE fe_eliminacion
                         END
     WHERE id_usuario = $2
     RETURNING estado;`,
     [estado, id_usuario]
  );
  return resultado.rows[0];
}

async function verDatosTutor(id_usuario) {
  const resultado = await pool.query(
    `SELECT
      (
          SELECT COALESCE(ROUND(AVG(e.calificacion)::numeric, 1), 0)::float
          FROM Eval_tutor e
          JOIN Tutor t2 ON e.id_tutor = t2.id_tutor
          WHERE t2.id_usuario = $1
      ) AS calificacion_promedio,
      (
          SELECT COUNT(*)::int
          FROM Reserva r
          JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
          WHERE t2.id_usuario = $1
            AND r.estado_reserva = 'Aceptada'
      ) AS tutorias_aceptadas,
      (
          SELECT COUNT(*)::int
          FROM Reserva r
          JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
          WHERE t2.id_usuario = $1
            AND r.estado_reserva = 'Rechazada'
      ) AS tutorias_rechazadas,
      (
          SELECT COUNT(*)::int
          FROM Reserva r
          JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
          WHERE t2.id_usuario = $1
            AND r.estado_tutoria = 'Finalizada' OR r.estado_tutoria = 'Calificada'
      ) AS tutorias_finalizadas,
      (
          SELECT COUNT(*)::int
          FROM Reserva r
          JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
          WHERE t2.id_usuario = $1
            AND r.estado_tutoria = 'Cancelada'
      ) AS tutorias_canceladas,
      COALESCE((
          SELECT json_agg(row_to_json(tm_data))
          FROM (
              SELECT 
                  m.de_materia AS materia,
                  COUNT(r.id_reserva)::int AS total
              FROM Reserva r
              JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
              JOIN Materia m ON r.id_materia = m.id_materia
              WHERE t2.id_usuario = $1
                AND r.estado_tutoria = 'Finalizada' OR r.estado_tutoria = 'Calificada'
              GROUP BY m.de_materia
              ORDER BY total DESC, m.de_materia ASC
          ) AS tm_data
      ), '[]'::json) AS grafica_materias,
      COALESCE((
        SELECT json_agg(row_to_json(hist_data))
        FROM (
          SELECT
            INITCAP(TO_CHAR(meses.fecha_mes, 'TMMonth')) AS mes,
            COALESCE(t.total, 0)::int AS total
          FROM (
            SELECT date_trunc('month', CURRENT_DATE) - (n || ' months')::interval AS fecha_mes
            FROM generate_series(0, 4) AS s(n)
          ) AS meses
          LEFT JOIN (
            SELECT
              date_trunc('month', r.fe_reserva)::date AS fecha_mes,
              COUNT(*)::int AS total
            FROM Reserva r
            JOIN Tutor t2 ON r.id_tutor = t2.id_tutor
            WHERE t2.id_usuario = $1
              AND r.estado_tutoria = 'Finalizada' OR r.estado_tutoria = 'Calificada'
              AND r.fe_reserva >= (date_trunc('month', CURRENT_DATE) - interval '4 months')
            GROUP BY date_trunc('month', r.fe_reserva)
          ) AS t ON t.fecha_mes = meses.fecha_mes
          ORDER BY meses.fecha_mes ASC
        ) AS hist_data
      ), '[]'::json) AS grafica_mensual;
    `,
    [id_usuario]
  );
  return resultado.rows[0];
}

async function listarTutoriasEnEspera(id_usuario) {
  const resultado = await pool.query(
    `SELECT
        r.id_reserva AS id,
        CONCAT(e.nombre, ' ', e.apellido) AS estudiante,
        m.de_materia AS materia,
        (
          BTRIM(TO_CHAR(r.fe_reserva, 'TMDay')) || ' ' ||
          TO_CHAR(r.fe_reserva, 'DD TMMonth YYYY')
        ) AS fecha,
        (
          TO_CHAR(r.hora_inicio, 'HH12:MI AM') || ' - ' ||
          TO_CHAR(r.hora_fin, 'HH12:MI AM')
        ) AS horario
    FROM Reserva r
    JOIN Tutor t ON r.id_tutor = t.id_tutor
    JOIN Estudiante e ON r.id_estudiante = e.id_estudiante
    JOIN Materia m ON r.id_materia = m.id_materia
    WHERE t.id_usuario = $1
      AND r.estado_reserva = 'En espera' AND r.estado_tutoria = 'Pendiente'
    ORDER BY r.fe_reserva ASC, r.hora_inicio ASC;
    `,
    [id_usuario]
  );
  return resultado.rows;
}

async function listarTutoriasAceptadas(id_usuario) {
  const resultado = await pool.query(
    `SELECT
        r.id_reserva AS id,
        CONCAT(e.nombre, ' ', e.apellido) AS estudiante,
        m.de_materia AS materia,
        (
          BTRIM(TO_CHAR(r.fe_reserva, 'TMDay')) || ' ' ||
          TO_CHAR(r.fe_reserva, 'DD TMMonth YYYY')
        ) AS fecha,
        (
          TO_CHAR(r.hora_inicio, 'HH12:MI AM') || ' - ' ||
          TO_CHAR(r.hora_fin, 'HH12:MI AM')
        ) AS horario
    FROM Reserva r
    JOIN Tutor t ON r.id_tutor = t.id_tutor
    JOIN Estudiante e ON r.id_estudiante = e.id_estudiante
    JOIN Materia m ON r.id_materia = m.id_materia
    WHERE t.id_usuario = $1
      AND r.estado_reserva = 'Aceptada' AND r.estado_tutoria = 'En Progreso'
    ORDER BY r.fe_reserva ASC, r.hora_inicio ASC;
    `,
    [id_usuario]
  );
  return resultado.rows;
}

async function cambiarEstadoReserva(estado_tutoria, id_reserva) {
  const resultado = await pool.query(
    `UPDATE Reserva
      SET 
          estado_tutoria = $1,
          estado_reserva = CASE
              WHEN $1 = 'En Progreso' THEN 'Aceptada'
              WHEN $1 = 'Rechazada'   THEN 'Rechazada'
              WHEN $1 = 'Cancelada'   THEN 'Aceptada'
              ELSE estado_reserva
          END
      WHERE id_reserva = $2
      RETURNING estado_tutoria`,
     [estado_tutoria, id_reserva]
  );
  return resultado.rows[0];
}

async function listarTutoriasFinalizadas(id_usuario) {
  const resultado = await pool.query(
    `SELECT
        r.id_reserva AS id,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre,
        m.de_materia AS materia,
        (
          BTRIM(TO_CHAR(r.fe_reserva, 'TMDay')) || ' ' ||
          TO_CHAR(r.fe_reserva, 'DD TMMonth YYYY')
        ) AS fecha
    FROM Reserva r
    JOIN Tutor t ON r.id_tutor = t.id_tutor
    JOIN Estudiante e ON r.id_estudiante = e.id_estudiante
    JOIN Materia m ON r.id_materia = m.id_materia
    WHERE t.id_usuario = $1
      AND r.estado_reserva = 'Aceptada' AND r.estado_tutoria = 'Finalizada'
    ORDER BY r.fe_reserva ASC, r.hora_inicio ASC;
    `,
    [id_usuario]
  );
  return resultado.rows;
}

async function calificarEstudiante(id_reserva, calificacion, comentario) {
  const resultado = await pool.query(
    `WITH nueva_evaluacion AS (
      INSERT INTO Eval_estudiante (
          id_tutor,
          id_estudiante,
          id_reserva,
          calificacion,
          comentario,
          fe_evaluacion
      )
      SELECT 
          r.id_tutor,
          r.id_estudiante,
          r.id_reserva,
          $2,
          $3,
          NOW()
      FROM Reserva r
      WHERE r.id_reserva = $1
      RETURNING id_reserva
    ),
    actualizacion AS (
      UPDATE Reserva
      SET estado_tutoria = 'Calificada'
      WHERE id_reserva IN (SELECT id_reserva FROM nueva_evaluacion)
      RETURNING id_reserva, estado_tutoria
    )
    SELECT * FROM actualizacion;
    `,
    [id_reserva, calificacion, comentario]
  );
  return resultado.rows;
}

async function verMateriasTutor(id_tutor) {
  const resultado = await pool.query(
    `SELECT 
      m.id_materia,
      m.de_materia
    FROM Tutor_materia tm
    JOIN Materia m ON tm.id_materia = m.id_materia
    WHERE tm.id_tutor = $1
    ORDER BY m.de_materia;
    `,
    [id_tutor]
  );
  return resultado.rows;
}

async function evaluarFechasReserva(id_tutor, id_materia, hora_inicio, hora_fin) {
  const resultado = await pool.query(
    `SELECT json_build_object(
      'fechas_ocupadas', (
        SELECT ARRAY_AGG(DISTINCT TO_CHAR(r.fe_reserva, 'YYYY-MM-DD') ORDER BY TO_CHAR(r.fe_reserva, 'YYYY-MM-DD'))
        FROM Reserva r
        WHERE r.id_tutor = $1
          AND r.id_materia = $2
          AND r.estado_reserva IN ('En espera', 'Aceptada')
          AND r.hora_inicio < $4
          AND r.hora_fin > $3
      ),
      'dias_no_disponibles', (
        WITH dias_semana AS (
          SELECT * FROM (VALUES
            (0, 'Domingo'),
            (1, 'Lunes'),
            (2, 'Martes'),
            (3, 'Miércoles'),
            (4, 'Jueves'),
            (5, 'Viernes'),
            (6, 'Sábado')
          ) AS dias(numero, nombre)
        )
        SELECT ARRAY_AGG(d.numero ORDER BY d.numero)
        FROM dias_semana d
        WHERE NOT EXISTS (
          SELECT 1
          FROM Disponibilidad disp
          WHERE disp.id_tutor = $1
            AND disp.dia_semana = d.nombre
            AND disp.hora_inicio <= $3
            AND disp.hora_fin >= $4
        )
      )
    ) AS resultado;
    `,
    [id_tutor, id_materia, hora_inicio, hora_fin]
  );
  return resultado.rows;
}

async function realizarReserva(id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin) {
  const resultado = await pool.query(
    `SELECT public.crear_reserva_con_validacion($1, $2, $3, $4, $5, $6)`,
    [id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin]
  );
  return resultado.rows[0];
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
  listarTutorias,
  verEstadoUsuario,
  cambiarEstadoUsuario,
  verDatosTutor,
  listarTutoriasEnEspera,
  listarTutoriasAceptadas,
  cambiarEstadoReserva,
  listarTutoriasFinalizadas,
  calificarEstudiante,
  verMateriasTutor,
  evaluarFechasReserva,
  realizarReserva
};
