import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/", (req, res) => {
  res.send("Servidor Express con Router separado y ESM 💡");
});

router.get("/hechos", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, nombre, valor_posible as valor FROM hechos"
    );
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener hechos" });
  }
});

/* ==========================
   📌 GET /fallas
   Devuelve todas las fallas
========================== */
router.get("/fallas", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, descripcion FROM fallas");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener fallas" });
  }
});

/* ==========================================
   📌 GET /hechos_fallas
   Devuelve pares [id_hecho, id_falla]
========================================== */
router.get("/hechos_fallas", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id_hecho, id_falla FROM hechos_fallas"
    );

    // Convertir a formato [[id_hecho, id_falla], ...]
    const pairs = rows.map((row) => [row.id_hecho, row.id_falla]);

    res.json(pairs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener hechos_fallas" });
  }
});

router.post("/newRule", async (req, res) => {
  const { rule, code, content } = req.body;

  console.log(rule, code, content);

  try {
    // 1️⃣ Insertar en fallas
    await pool.query(`INSERT INTO fallas (id, descripcion) VALUES (?, ?)`, [
      code,
      content,
    ]);

    // 2️⃣ Insertar en hechos_fallas (relaciones con cada hecho)
    for (const hechoId of rule) {
      await pool.query(
        `INSERT INTO hechos_fallas (id_hecho, id_falla) VALUES (?, ?)`,
        [hechoId, code]
      );
    }

    res.status(200).json({ message: "Regla guardada correctamente" });
  } catch (error) {
    console.error("Error guardando regla:", error);
    res.status(500).json({ message: "Error al guardar la regla" });
  }
});

export default router;