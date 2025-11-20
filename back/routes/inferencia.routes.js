import { Router } from "express";
import pool from "../db.js";

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

// En tu archivo de rutas del backend
router.post("/hechos", async (req, res) => {
  const { nombre, valor_posible } = req.body;

  try {
    const [result] = await pool.query(
      "INSERT INTO hechos (nombre, valor_posible) VALUES (?, ?)",
      [nombre, valor_posible]
    );
    
    res.status(201).json({ 
      message: "Hecho creado exitosamente", 
      id: result.insertId 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear el hecho" });
  }
});

/* ==========================================
   📌 GET /preferencias
   Obtiene las preferencias de un usuario por sus falla_ids
   Query params: usuario_id, falla_ids (array separado por comas)
========================================== */
router.get("/preferencias", async (req, res) => {
  const { usuario_id, falla_ids } = req.query;

  if (!usuario_id || !falla_ids) {
    return res.status(400).json({ message: "usuario_id y falla_ids son requeridos" });
  }

  try {
    // Convertir falla_ids de string a array
    const fallaIdsArray = Array.isArray(falla_ids) 
      ? falla_ids 
      : falla_ids.split(',').map(id => parseInt(id.trim()));

    if (fallaIdsArray.length === 0) {
      return res.json([]);
    }

    // Consultar preferencias del usuario para los falla_ids especificados
    // Si hay múltiples registros con el mismo falla_id, tomar la máxima ponderación
    const placeholders = fallaIdsArray.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT falla_id, MAX(ponderacion) as ponderacion
       FROM preferencias 
       WHERE usuario_id = ? AND falla_id IN (${placeholders})
       GROUP BY falla_id
       ORDER BY ponderacion DESC`,
      [usuario_id, ...fallaIdsArray]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener preferencias:", error);
    res.status(500).json({ message: "Error al obtener las preferencias" });
  }
});

/* ==========================================
   📌 POST /preferencias
   Inserta una preferencia del usuario
   Si no existe: inserta con ponderacion = 1
   Si existe con la misma falla_id: incrementa la ponderacion en 1
   Si existe con diferente falla_id: intenta insertar nuevo registro
   (Nota: requiere modificar la restricción única para permitir múltiples registros)
========================================== */
router.post("/preferencias", async (req, res) => {
  const { usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id, falla_id } = req.body;

  try {
    // Primero verificar si existe un registro con la misma combinación completa (hechos + falla_id)
    const [existing] = await pool.query(
      `SELECT id, ponderacion FROM preferencias 
       WHERE usuario_id = ? 
       AND hecho_clima_id = ? 
       AND hecho_ocasion_id = ? 
       AND hecho_estilo_id = ? 
       AND falla_id = ?`,
      [usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id, falla_id]
    );

    if (existing.length > 0) {
      // Si existe con la misma falla_id, actualizar la ponderación
      await pool.query(
        `UPDATE preferencias 
         SET ponderacion = IFNULL(ponderacion, 0) + 1 
         WHERE id = ?`,
        [existing[0].id]
      );

      res.status(200).json({ 
        message: "Preferencia actualizada exitosamente", 
        id: existing[0].id 
      });
    } else {
      // Intentar insertar nuevo registro directamente
      try {
        const [result] = await pool.query(
          `INSERT INTO preferencias 
           (usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id, falla_id, ponderacion) 
           VALUES (?, ?, ?, ?, ?, 1)`,
          [usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id, falla_id]
        );

        res.status(201).json({ 
          message: "Preferencia guardada exitosamente", 
          id: result.insertId 
        });
      } catch (insertError) {
        // Si falla por restricción única, significa que existe un registro con los mismos hechos pero diferente falla_id
        // Verificar si la falla_id es diferente
        const [existingSameHechos] = await pool.query(
          `SELECT id, falla_id FROM preferencias 
           WHERE usuario_id = ? 
           AND hecho_clima_id = ? 
           AND hecho_ocasion_id = ? 
           AND hecho_estilo_id = ?`,
          [usuario_id, hecho_clima_id, hecho_ocasion_id, hecho_estilo_id]
        );

        if (existingSameHechos.length > 0 && existingSameHechos[0].falla_id !== falla_id) {
          // Existe un registro con los mismos hechos pero diferente falla_id
          // La restricción única actual no permite ambos registros
          // Para permitir múltiples registros, necesitas modificar la restricción única de la tabla
          res.status(409).json({ 
            message: "Ya existe un registro con los mismos hechos pero diferente falla_id. Para permitir múltiples registros, modifica la restricción única de la tabla para incluir también falla_id.",
            error: "UNIQUE constraint violation"
          });
        } else {
          throw insertError;
        }
      }
    }
  } catch (error) {
    console.error("Error al guardar preferencia:", error);
    res.status(500).json({ message: "Error al guardar la preferencia", error: error.message });
  }
});

/* ==========================================
   📌 GET /preferencias/historial/:usuario_id
   Obtiene el historial de preferencias de un usuario
   Agrupado por triplete (clima, ocasión, estilo)
   Muestra todas las opciones (fallas) escogidas para cada triplete
========================================== */
router.get("/preferencias/historial/:usuario_id", async (req, res) => {
  const { usuario_id } = req.params;

  try {
    // Consultar todas las preferencias del usuario con información detallada
    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.usuario_id,
        p.hecho_clima_id,
        p.hecho_ocasion_id,
        p.hecho_estilo_id,
        p.falla_id,
        p.ponderacion,
        hc.nombre as clima_nombre,
        hc.valor_posible as clima_valor,
        ho.nombre as ocasion_nombre,
        ho.valor_posible as ocasion_valor,
        he.nombre as estilo_nombre,
        he.valor_posible as estilo_valor,
        f.descripcion as falla_descripcion
      FROM preferencias p
      INNER JOIN hechos hc ON p.hecho_clima_id = hc.id
      INNER JOIN hechos ho ON p.hecho_ocasion_id = ho.id
      INNER JOIN hechos he ON p.hecho_estilo_id = he.id
      INNER JOIN fallas f ON p.falla_id = f.id
      WHERE p.usuario_id = ?
      ORDER BY p.ponderacion DESC, p.id DESC`,
      [usuario_id]
    );

    // Agrupar por triplete (clima, ocasión, estilo)
    const historialAgrupado = {};
    
    rows.forEach((row) => {
      const clave = `${row.hecho_clima_id}-${row.hecho_ocasion_id}-${row.hecho_estilo_id}`;
      
      if (!historialAgrupado[clave]) {
        historialAgrupado[clave] = {
          triplete: {
            clima: {
              id: row.hecho_clima_id,
              nombre: row.clima_nombre,
              valor: row.clima_valor
            },
            ocasion: {
              id: row.hecho_ocasion_id,
              nombre: row.ocasion_nombre,
              valor: row.ocasion_valor
            },
            estilo: {
              id: row.hecho_estilo_id,
              nombre: row.estilo_nombre,
              valor: row.estilo_valor
            }
          },
          opciones: []
        };
      }
      
      historialAgrupado[clave].opciones.push({
        id: row.id,
        falla_id: row.falla_id,
        falla_descripcion: row.falla_descripcion,
        ponderacion: row.ponderacion
      });
    });

    // Convertir objeto a array
    const resultado = Object.values(historialAgrupado);

    res.json(resultado);
  } catch (error) {
    console.error("Error al obtener historial de preferencias:", error);
    res.status(500).json({ message: "Error al obtener el historial", error: error.message });
  }
});

export default router;
