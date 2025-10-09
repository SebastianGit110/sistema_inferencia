import express from "express";
import cors from "cors";
import mainRouter from "./routes/inferencia.routes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.use("/", mainRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
