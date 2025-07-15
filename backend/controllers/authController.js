const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registrarEstudiante, buscarUsuario, listarFacultades, listarCarreras } = require('../models/usuarioModel');

const registroEstudiante = async (req, res) => {
  try {
    const { usuario, clave, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera } = req.body;

    if (!usuario || !clave || !tipo_usuario || !nombre || !apellido || !correo_utp || !fe_nacimiento || !id_carrera) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    if (tipo_usuario !== 'estudiante') {
      return res.status(400).json({ mensaje: 'El tipo_usuario debe ser estudiante' });
    }

    const clave_hash = await bcrypt.hash(clave, 10);
    const resultado = await registrarEstudiante({ usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera });

    if (resultado === 'USUARIO_EXISTENTE') {
      return res.status(400).json({ mensaje: 'Usuario ya existe' });
    }

    if (resultado === 'CORREO_UTP_EXISTENTE') {
      return res.status(400).json({ mensaje: 'Correo UTP ya registrado' });
    }

    if (resultado === 'ESTUDIANTE_CREADO') {
      return res.status(201).json({ mensaje: 'Estudiante creado exitosamente' });
    }

    return res.status(500).json({ mensaje: 'Error desconocido' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { correo_utp, clave } = req.body;

    if (!correo_utp || !clave) {
      return res.status(400).json({ error: 'Correo y clave son requeridos' });
    }

    const user = await buscarUsuario(correo_utp);

    if (!user) {
      return res.status(401).json({ error: 'Correo no registrado o usuario inactivo' });
    }

    const claveValida = await bcrypt.compare(clave, user.clave_hash);
    if (!claveValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        tipo_usuario: user.tipo_usuario
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        usuario: user.usuario,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listaFacultades = async (_req, res) => {
	try {
		const resultado = await listarFacultades()

		if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron facultades' });
		}

		return res.status(200).json({
			mensaje: 'Facultades obtenidas exitosamente',
			facultades: resultado
		});
	} catch (error) {
		console.error('Error al obtener facultades:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
	}
};

const listaCarreras = async (req, res) => {
  try{
    const facultad = req.query.facultad;
    if (!facultad) {
      return res.status(400).json({ error: 'La facultad es requerida' });
    }

    const resultado = await listarCarreras(facultad);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron carreras' });
		}

    return res.status(200).json({
			mensaje: 'Carreras obtenidas exitosamente',
			carreras: resultado
		});
  } catch (error) {
    console.error('Error al obtener carreras:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

module.exports = {
  registroEstudiante,
  login,
  listaFacultades,
  listaCarreras
};
