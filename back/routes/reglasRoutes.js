import express from "express";
import pool from "../db.js";

const router = express.Router();

// Ruta para obtener conteos por tipo de hecho
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT nombre, COUNT(DISTINCT id_falla) AS total
      FROM hechos
      JOIN hechos_fallas ON hechos.id = hechos_fallas.id_hecho
      GROUP BY nombre;
    `);

    // Formateamos la respuesta
    const data = {
      clima: rows.find((r) => r.nombre === "clima")?.total || 0,
      ocasion: rows.find((r) => r.nombre === "ocasión")?.total || 0,
      estilo: rows.find((r) => r.nombre === "estilo")?.total || 0,
    };

    res.json(data);
  } catch (error) {
    console.error("Error al obtener reglas:", error);
    res.status(500).json({ error: "Error al obtener las reglas" });
  }
});

export default router;
