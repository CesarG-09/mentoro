const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
        if (err) return res.status(403).json({ mensaje: 'Token inválido' });

        req.usuario = usuario;
        next();
    });
};

function permitirRoles(...rolesPermitidos) {
  return (req, res, next) => {
    const { tipo_usuario } = req.usuario;

    if (!rolesPermitidos.includes(tipo_usuario)) {
      return res.status(403).json({ error: 'Acceso no autorizado' });
    }

    next();
  };
}

module.exports = { verificarToken, permitirRoles };
