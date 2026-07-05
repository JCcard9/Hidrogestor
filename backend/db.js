require("dotenv").config();
const { Pool } = require("pg");

const isSslEnabled = process.env.DB_SSL === "true";

const db = new Pool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "gestor",
  port: Number(process.env.DB_PORT) || 5432,
  ssl: isSslEnabled ? { rejectUnauthorized: false } : false
});

db.query("SELECT 1")
  .then(() => console.log("Conectado ao PostgreSQL"))
  .catch((err) => console.error("Erro ao conectar ao PostgreSQL:", err));

module.exports = db;
