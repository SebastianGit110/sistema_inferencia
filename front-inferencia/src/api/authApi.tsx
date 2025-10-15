// src/api/authApi.ts
const API_URL = "http://localhost:3000/api/auth"; // Ajusta el puerto según tu backend

export const registerUser = async (nombre: string, email: string, password: string) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre, email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error en el registro");
  }

  return await response.json();
};

export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error en el login");
  }

  return await response.json();
};