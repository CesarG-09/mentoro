# Mentoro Backend
Backend para la conexión de la aplicación Mentoro con la base de datos y la logica de negocio organizado en un modelo-vista-controlador (MVC).

## Estructura de Carpetas

```bash
backend/
├── config/
│   └── db.js               <-- Conexión a Supabase/PostgreSQL
├── controllers/
│   └── authController.js   <-- Lógica de las APIs
├── models/
│   └── usuarioModel.js     <-- Consultas a la base de datos
├── routes/
│   └── authRoutes.js       <-- Definición de las APIs protegidas y publicas
├── middlewares/
│   └── authMiddleware.js   <-- Verificación de JWT
├── server.js               <-- Punto de entrada del servidor
```