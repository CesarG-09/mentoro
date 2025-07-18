// utils/authUtils.js
const jwt = require('jsonwebtoken');

function generarToken(usuario) {
  return jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      usuario: usuario.usuario,
      tipo_usuario: usuario.tipo_usuario
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

module.exports = { generarToken };