// back/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let connection;

export async function createConnection() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log("✅ Conexión exitosa a la base de datos MySQL");

    // Prueba de conexión
    const [rows] = await connection.query("SELECT 1 + 1 AS resultado");
    console.log("🧠 Prueba BD:", rows[0]);
    return connection;
  } catch (error) {
    console.error("❌ Error inicializando conexión:", error);
  }
}

export default connection;
