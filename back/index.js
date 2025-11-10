import express from "express";
import cors from "cors";
import mainRouter from "./routes/inferencia.routes.js";
import authRouter from "./routes/auth.routes.js";
import userRoutes from "./routes/userRoutes.js";
import reglasRoutes from "./routes/reglasRoutes.js";

const app = express();
const PORT = 3000;

// 🔹 Middlewares
app.use(express.json());
app.use(cors());

// 🔹 Rutas principales
app.use("/api/auth", authRouter); // Rutas de login y registro
app.use("/api/users", userRoutes);
app.use("/api/reglas", reglasRoutes);
app.use("/", mainRouter);

// 🔹 Ruta de prueba (opcional)
app.get("/", (req, res) => {
  res.send("✅ Servidor del sistema experto funcionando correctamente");
});

// 🔹 Inicializar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
