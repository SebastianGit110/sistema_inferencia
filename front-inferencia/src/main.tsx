import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.tsx";
import { MainRouter } from "./MainRouter.tsx";
import "./index.css";

/**
 * 🔹 Este archivo combina ambas estructuras de rutas:
 * - Tu App.tsx (que incluye Login, Register, Home, etc.)
 * - El MainRouter de Sebastián (que puede tener rutas de inferencia o admin)
 */

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* 🔸 Tus rutas con AuthProvider y autenticación */}
        <Route path="/*" element={<App />} />

        {/* 🔸 Rutas adicionales del sistema de Sebastián */}
        <Route path="/inferencia/*" element={<MainRouter />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
