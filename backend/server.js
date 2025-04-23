// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // permite peticiones desde el frontend
app.use(express.json()); // parsea JSON

// Usuario hardcodeado
const usuario = {
  correo: "profesor@utp.ac.pa",
  contrasena: "123456"
};

// Ruta de login
app.post('/api/login', (req, res) => {
  const { correo, contrasena } = req.body;
  if (correo === usuario.correo && contrasena === usuario.contrasena) {
    return res.json({ success: true, mensaje: "Inicio de sesión exitoso" });
  } else {
    return res.status(401).json({ success: false, mensaje: "Credenciales incorrectas" });
  }
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor backend en http://localhost:${PORT}`);
});
