const bcrypt = require('bcrypt');
const { generarToken } = require('../utils/authUtils');
const { 
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
} = require('../models/usuarioModel');

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
      const user = await buscarUsuario(usuario);
      const token = generarToken(user);
      
      return res.status(201).json({
        mensaje: 'Registro exitoso',
        token,
        usuario: {
          usuario: user.usuario,
          tipo_usuario: user.tipo_usuario
        }
      });
    }

    return res.status(500).json({ mensaje: 'Error desconocido' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const registroTutor = async (req, res) => {
  try {
    const { 
      usuario, 
      clave, 
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
    } = req.body;

    if (!usuario || !clave || !tipo_usuario || !nombre || !apellido || !correo_utp || !fe_nacimiento || !dias_disponibles || !horas_inicio || !horas_fin || !materias || !precios_materias) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    if (tipo_usuario !== 'tutor') {
      return res.status(400).json({ mensaje: 'El tipo_usuario debe ser tutor' });
    }

    const clave_hash = await bcrypt.hash(clave, 10);
    const resultado = await registrarTutor({ usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, dias_disponibles, horas_inicio, horas_fin, materias, precios_materias });

    if (resultado === 'CORREO_INVALIDO') {
      return res.status(400).json({ mensaje: 'Formato de correo invalido' });
    }

    if (resultado === 'FECHA_NACIMIENTO_INVALIDA') {
      return res.status(400).json({ mensaje: 'Fecha de nacimiento invalida' });
    }

    if (resultado === 'USUARIO_EXISTENTE') {
      return res.status(400).json({ mensaje: 'Usuario ya existe' });
    }

    if (resultado === 'CORREO_UTP_EXISTENTE') {
      return res.status(400).json({ mensaje: 'Correo UTP ya registrado' });
    }

    if (resultado === 'DISPONIBILIDAD_LONGITUD_INCONSISTENTE') {
      return res.status(400).json({ mensaje: 'Error en arreglo de disponibilidad' });
    }

    if (resultado === 'MATERIAS_PRECIOS_LONGITUD_INCONSISTENTE') {
      return res.status(400).json({ mensaje: 'Error en arreglo de materias' });
    }

    if (resultado === 'HORA_INVALIDA') {
      return res.status(400).json({ mensaje: 'Hora de inicio mayor que hora de fin' });
    }

    if (resultado === 'DIA_INVALIDO') {
      return res.status(400).json({ mensaje: 'Dia(s) ingresado(s) incorrecto(s)' });
    }

    if (resultado === 'PRECIO_INVALIDO') {
      return res.status(400).json({ mensaje: 'Formato de precio invalido' });
    }

    if (resultado === 'MATERIA_NO_ENCONTRADA') {
      return res.status(400).json({ mensaje: 'Materia no encontrada' });
    }

    if (resultado === 'TUTOR_REGISTRADO') {
      const user = await buscarUsuario(usuario);
      const token = generarToken(user);
      
      return res.status(201).json({
        mensaje: 'Registro exitoso',
        token,
        usuario: {
          usuario: user.usuario,
          tipo_usuario: user.tipo_usuario
        }
      });
    }

    return res.status(500).json({ mensaje: resultado });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    if (!usuario || !clave) {
      return res.status(400).json({ error: 'Usuario y clave son requeridos' });
    }

    const user = await buscarUsuario(usuario);

    if (!user) {
      return res.status(401).json({ error: 'Usuario no registrado o usuario inactivo' });
    }

    const claveValida = await bcrypt.compare(clave, user.clave_hash);
    if (!claveValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = generarToken(user);

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
		const resultado = await listarFacultades();

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

const listaMaterias = async (_req, res) => {
  try{
    const resultado = await listarMaterias();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron materias' })
    }

    return res.status(200).json({
			mensaje: 'Materias obtenidas exitosamente',
			materias: resultado
		});
  } catch (error) {
    console.error('Error al obtener materias:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const totalizaEstudiantes = async (_req, res) => {
  try {
    const resultado = await totalizarEstudiantes();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron estudiantes' })
    }

    return res.status(200).json({
			mensaje: 'Total obtenido exitosamente',
			cantidad: resultado
		});
  } catch (error) {
    console.error('Error al obtener total de estudiantes:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const totalizaTutores = async (_req, res) => {
  try {
    const resultado = await totalizarTutores();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron tutores' })
    }

    return res.status(200).json({
			mensaje: 'Total obtenido exitosamente',
			cantidad: resultado
		});
  } catch (error) {
    console.error('Error al obtener total de tutores:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const totalizaReservasFinalizadas = async (_req, res) => {
  try {
    const resultado = await totalizarReservasFinalizadas();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron reservas' })
    }

    return res.status(200).json({
			mensaje: 'Total obtenido exitosamente',
			cantidad: resultado
		});
  } catch (error) {
    console.error('Error al obtener total de reservas:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const listaTutores = async (_req, res) => {
  try {
    const resultado = await listarTutores();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron tutores' })
    }

    return res.status(200).json({
			mensaje: 'Total obtenido exitosamente',
			tutores: resultado
		});
  } catch (error) {
    console.error('Error al obtener lista de tutores:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const muestraTutor = async (req, res) => {
  try{
    const id_tutor = req.query.id_tutor;
    if (!id_tutor) {
      return res.status(400).json({ error: 'El id_tutor es requerido' });
    }

    const resultado = await verTutor(id_tutor);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró el tutor' });
		}

    return res.status(200).json({
			mensaje: 'Tutor obtenido exitosamente',
			tutor: resultado
		});
  } catch (error) {
    console.error('Error al obtener tutor:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const graficaAceptVsRechaz = async (_req, res) => {
  try {
    const resultado = await graficarAceptVsRechaz();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron datos de reservas' })
    }

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			grafica: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos de reservas:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const graficaMaterias = async (_req, res) => {
  try {
    const resultado = await graficarMaterias();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron datos de materias' })
    }

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			grafica: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos de materias:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const listaEstudiantes = async (_req, res) => {
  try {
    const resultado = await listarEstudiantes();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron estudiantes' })
    }

    return res.status(200).json({
			mensaje: 'Total obtenido exitosamente',
			estudiantes: resultado
		});
  } catch (error) {
    console.error('Error al obtener lista de estudiantes:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const muestraEstudiante = async (req, res) => {
  try{
    const id_estudiante = req.query.id_estudiante;
    if (!id_estudiante) {
      return res.status(400).json({ error: 'El id_estudiante es requerido' });
    }

    const resultado = await verEstudiante(id_estudiante);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró el estudiante' });
		}

    return res.status(200).json({
			mensaje: 'Estudiante obtenido exitosamente',
			estudiante: resultado
		});
  } catch (error) {
    console.error('Error al obtener estudiante:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const topMaterias = async (_req, res) => {
  try {
    const resultado = await listarTopMaterias();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron datos de materias' })
    }

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			materias: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos de materias:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const topTutores = async (_req, res) => {
  try {
    const resultado = await listarTopTutores();

    if (!resultado || resultado.length === 0) {
      return res.status(404).json({ mensaje: 'No se encontraron datos de tutores' })
    }

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			tutores: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos de tutores:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const listaTutorias = async (req, res) => {
  try {
    const usuario = req.query.usuario;
    if (!usuario) {
      return res.status(400).json({ error: 'El usuario es requerido' });
    }

    const resultado = await listarTutorias(usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró el usuario' });
		}

    return res.status(200).json({
			mensaje: 'Usuario obtenido exitosamente',
			tutorias: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos de usuario:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

module.exports = {
  registroEstudiante,
  registroTutor,
  login,
  listaFacultades,
  listaCarreras,
  listaMaterias,
  totalizaEstudiantes,
  totalizaTutores,
  totalizaReservasFinalizadas,
  graficaAceptVsRechaz,
  graficaMaterias,
  listaTutores,
  muestraTutor,
  listaEstudiantes,
  muestraEstudiante,
  topMaterias,
  topTutores,
  listaTutorias
};
