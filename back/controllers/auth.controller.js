import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import pool from "../db.js";

dotenv.config();

// 🔹 Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    if (!nombre || !email || !password)
      return res.status(400).json({ mensaje: "Faltan datos obligatorios" });

    // Verificar si el email ya existe
    const [existente] = await pool.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );
    if (existente.length > 0)
      return res.status(400).json({ mensaje: "El correo ya está registrado" });

    // Buscar el id del rol (por nombre)
    const [roles] = await pool.query("SELECT id FROM roles WHERE nombre = ?", [
      rol || "usuario",
    ]);
    const rol_id = roles.length > 0 ? roles[0].id : 2; // por defecto "usuario"

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password, rol_id) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol_id]
    );

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      id: result.insertId,
    });
  } catch (error) {
    console.error("❌ Error en registrarUsuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
};
// 🔹 Login de usuario
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario por email
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [
      email,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ mensaje: "Usuario no encontrado" });

    const usuario = rows[0];

    // Verificar contraseña
    const esValido = await bcrypt.compare(password, usuario.password);
    if (!esValido)
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    // Generar token
    const token = jwt.sign(
      { id: usuario.id, rol_id: usuario.rol_id },
      process.env.JWT_SECRET || "clave_secreta_temporal",
      { expiresIn: "2h" }
    );

    res.json({
      mensaje: "Login exitoso",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        rol_id: usuario.rol_id,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en loginUsuario:", error);
    res.status(500).json({ mensaje: "Error en el servidor", error });
  }
};
