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

const estadoUsuario = async (req, res) => {
  try{
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'El id_usuario es requerido' });
    }

    const resultado = await verEstadoUsuario(id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró el usuario' });
		}

    return res.status(200).json({
			mensaje: 'Usuario obtenido exitosamente',
			usuario: resultado
		});
  } catch (error) {
    console.error('Error al obtener usuario:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const cambioEstadoUsuario = async (req, res) => {
  try {
    const { estado, id_usuario } = req.body;

    if (!estado || !id_usuario) {
      return res.status(400).json({ error: 'Estado y id_usuario son requeridos' });
    }

    const resultado = await cambiarEstadoUsuario(estado, id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró el usuario' });
		}

    return res.status(200).json({
			mensaje: 'Estado cambiado exitosamente',
			estado: resultado
		});
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const datosTutor = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'El id_usuario es requerido' });
    }

    const resultado = await verDatosTutor(id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron datos del tutor' });
		}

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			datos: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos del tutor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listaTutoriasEnEspera = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'El id_usuario es requerido' });
    }

    const resultado = await listarTutoriasEnEspera(id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron datos del tutor' });
		}

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			datos: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos del tutor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listaTutoriasAceptadas = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'El id_usuario es requerido' });
    }

    const resultado = await listarTutoriasAceptadas(id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron datos del tutor' });
		}

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			datos: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos del tutor:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const cambioEstadoReserva = async (req, res) => {
  try {
    const { estado_tutoria, id_reserva } = req.body;

    if (!estado_tutoria || !id_reserva) {
      return res.status(400).json({ error: 'Estado_tutoria y id_reserva son requeridos' });
    }

    const resultado = await cambiarEstadoReserva(estado_tutoria, id_reserva);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontró la reserva' });
		}

    return res.status(200).json({
			mensaje: 'Estado cambiado exitosamente',
			resultado: resultado
		});
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listaTutoriasFinalizadas = async (req, res) => {
  try {
    const id_usuario = req.query.id_usuario;
    if (!id_usuario) {
      return res.status(400).json({ error: 'El id_usuario es requerido' });
    }

    const resultado = await listarTutoriasFinalizadas(id_usuario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ mensaje: 'No se encontraron datos' });
		}

    return res.status(200).json({
			mensaje: 'Datos obtenidos exitosamente',
			datos: resultado
		});
  } catch (error) {
    console.error('Error al obtener datos:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const calificaEstudiante = async (req, res) => {
  try {
    const { id_reserva, calificacion, comentario } = req.body;

    if (!id_reserva || !calificacion || !comentario) {
      return res.status(400).json({ error: 'Id_reserva, calificacion y comentario son requeridos' });
    }

    const resultado = await calificarEstudiante(id_reserva, calificacion, comentario);
    if (!resultado || resultado.length === 0) {
			return res.status(404).json({ error: 'No se encontró la reserva' });
		}

    return res.status(200).json({
			mensaje: 'Calificado cambiado exitosamente',
			resultado: resultado
		});
  } catch (error) {
    console.error('Error al calificar:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const muestraMateriasTutor = async (req, res) => {
  try{
    const id_tutor = req.query.id_tutor;
    if (!id_tutor) {
      return res.status(400).json({ error: 'El id_tutor es requerido' });
    }

    const resultado = await verMateriasTutor(id_tutor);
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

const evaluaFechasReserva = async (req, res) => {
  try{
    const { id_tutor, id_materia, hora_inicio, hora_fin } = req.query;
    if (!id_tutor || !id_materia || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Todos los parámetros son requeridos' });
    }

    const resultado = await evaluarFechasReserva(id_tutor, id_materia, hora_inicio, hora_fin);

    return res.status(200).json({
			mensaje: 'Tutor obtenido exitosamente',
			fechas_ocupadas: resultado
		});
  } catch (error) {
    console.error('Error al obtener tutor:', error);
		res.status(500).json({ mensaje: 'Error en el servidor' });
  }
}

const realizaReserva = async (req, res) => {
  try {
    const { id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin } = req.body;

    if (!id_usuario || !id_tutor || !id_materia || !fe_reserva || !hora_inicio || !hora_fin) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const resultado = await realizarReserva(id_usuario, id_tutor, id_materia, fe_reserva, hora_inicio, hora_fin);
    
    if (resultado.crear_reserva_con_validacion === 'ESTUDIANTE_NO_ENCONTRADO') {
      return res.status(400).json({ mensaje: 'Estudiante no encontrado.' });
    }

    if (resultado.crear_reserva_con_validacion === 'TUTOR NO ENCONTRADO') {
      return res.status(400).json({ mensaje: 'Tutor no encontrado.' });
    }

    if (resultado.crear_reserva_con_validacion === 'MATERIA_NO_ASIGNADA_AL_TUTOR') {
      return res.status(400).json({ mensaje: 'Materia no asignada al tutor.' });
    }

    if (resultado.crear_reserva_con_validacion === 'TUTOR_NO_DISPONIBLE_DIAS') {
      return res.status(400).json({ mensaje: 'Tutor no disponible en ese dia.' });
    }

    if (resultado.crear_reserva_con_validacion === 'TUTOR_NO_DISPONIBLE_HORAS') {
      return res.status(400).json({ mensaje: 'Tutor no disponible en esas horas.' });
    }

    if (resultado.crear_reserva_con_validacion === 'TUTOR_NO_DISPONIBLE_RESERVA') {
      return res.status(400).json({ mensaje: 'Tutor no disponible para reserva.' });
    }

    if (resultado.crear_reserva_con_validacion === 'RESERVA_REALIZADA') {
      return res.status(200).json({
        mensaje: 'Estado cambiado exitosamente',
        resultado: resultado
      });
    } else {
      return res.status(400).json({ mensaje: 'Error desconocido!' });
    }
  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

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
  listaTutorias,
  estadoUsuario,
  cambioEstadoUsuario,
  datosTutor,
  listaTutoriasEnEspera,
  listaTutoriasAceptadas,
  cambioEstadoReserva,
  listaTutoriasFinalizadas,
  calificaEstudiante,
  muestraMateriasTutor,
  evaluaFechasReserva,
  realizaReserva
};
