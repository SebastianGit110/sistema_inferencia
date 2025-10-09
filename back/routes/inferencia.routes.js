import { Router } from "express";

const router = Router();

// Ejemplo de ruta GET
router.get("/", (req, res) => {
  res.send("Servidor Express con Router separado y ESM 💡");
});

// Ejemplo de otra ruta
router.get("/saludo", (req, res) => {
  res.json({ mensaje: "Hola desde /saludo 😎" });
});

export default router;
