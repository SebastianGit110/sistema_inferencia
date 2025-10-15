import express from "express";
import { loginUsuario, registrarUsuario } from "../controllers/auth.controller.js";

const router = express.Router();

// Ruta de registro
router.post("/register", registrarUsuario);

// Ruta de login
router.post("/login", loginUsuario);

export default router;

