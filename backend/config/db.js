const { Pool } = require('pg');
require('dotenv').config();

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

module.exports = pool;