import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 🔹 Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || "usuario"]
    );

    res.status(201).json({ mensaje: "Usuario registrado correctamente", id: result.insertId });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
};

// 🔹 Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    const usuario = rows[0];

    if (!usuario) return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
    });
  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
};
