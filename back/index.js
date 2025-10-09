import express from "express";
import mainRouter from "./routes/inferencia.routes.js";

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas principales
app.use("/", mainRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
