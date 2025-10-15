// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress 
} from "@mui/material";

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5", // gris claro neutro
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: "white",
          padding: 5,
          borderRadius: 3,
          boxShadow: 4,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ color: "#333" }}
        >
          Crear Cuenta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ bgcolor: "#fdecea", color: "#611a15" }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Nombre Completo"
          type="text"
          variant="outlined"
          fullWidth
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <TextField
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          inputProps={{ minLength: 6 }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading}
          sx={{
            height: 50,
            backgroundColor: "#607d8b",
            "&:hover": { backgroundColor: "#455a64" },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
        </Button>

        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#666", marginTop: 1 }}
        >
          ¿Ya tienes cuenta?{" "}
          <a
            href="/login"
            style={{
              color: "#607d8b",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Inicia sesión
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;
