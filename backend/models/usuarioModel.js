const pool = require('../config/db');

async function registrarEstudiante(data) {
  const { usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera } = data;

  const { rows } = await pool.query(
    `SELECT public.registrar_estudiante($1, $2, $3, $4, $5, $6, $7, $8) AS resultado`,
    [usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera]
  );

  return rows[0].resultado;
}

async function buscarUsuario(correo_utp) {
  const resultado = await pool.query(
    `SELECT U.* 
     FROM Usuario U
     JOIN Estudiante E ON U.id_usuario = E.id_usuario
     WHERE E.correo_utp = $1 AND U.estado = 'activo'`,
    [correo_utp]
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

module.exports = {
  registrarEstudiante,
  buscarUsuario,
  listarFacultades,
  listarCarreras
};
