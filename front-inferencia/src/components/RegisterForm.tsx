// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await registerUser(nombre, email, password);
      alert("Registro exitoso! Ahora puedes iniciar sesión");
      navigate("/login");
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg p-8 rounded-xl w-96"
      >
        <h2 className="text-2xl font-semibold text-center mb-6">
          Crear Cuenta
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nombre</label>
          <input
            type="text"
            placeholder="Tu nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="border border-gray-300 p-3 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>

        <p className="text-center text-sm mt-4 text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline font-semibold">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;