// backend/server.js
const PORT = 3001;
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(cors()); // permite peticiones desde el frontend
app.use(express.json()); // parsea JSON

// Configurar conexión a Supabase (PostgreSQL)
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false // Requerido por Supabase
  }
});

// REGISTRO ESTUDIANTE
app.post('/api/registro-estudiante', async (req, res) => {
  try {
    const {usuario, clave, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera} = req.body;

    if (!usuario || !clave || !tipo_usuario || !nombre || !apellido || !correo_utp || !fe_nacimiento || !id_carrera) {
      return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
    }

    if (tipo_usuario !== 'estudiante') {
      return res.status(400).json({ mensaje: 'El tipo_usuario debe ser estudiante' });
    }

    const clave_hash = await bcrypt.hash(clave, 10);

    const { rows } = await pool.query(
      `SELECT public.registrar_estudiante($1, $2, $3, $4, $5, $6, $7, $8) AS resultado`,
      [usuario, clave_hash, tipo_usuario, nombre, apellido, correo_utp, fe_nacimiento, id_carrera]
    );

    const resultado = rows[0].resultado;

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
});

// LOGIN
app.post('/api/login', async (req, res) => {
  try {
    const { usuario, clave } = req.body;

    // Buscar usuario
    const resultado = await pool.query(
      `SELECT * FROM Usuario WHERE usuario = $1 AND estado = 'activo'`,
      [usuario]
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const user = resultado.rows[0];

    // Comparar clave
    const claveValida = await bcrypt.compare(clave, user.clave_hash);
    if (!claveValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    // Generar JWT
    const token = jwt.sign(
      { 
        id_usuario: user.id_usuario, 
        usuario: user.usuario,
        tipo_usuario: user.tipo_usuario },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id_usuario: user.id_usuario,
        usuario: user.usuario,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
