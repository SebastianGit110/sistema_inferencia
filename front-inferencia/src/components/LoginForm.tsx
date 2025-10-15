import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Asume que estas funciones aún existen en tu proyecto
import { loginUser } from "../api/authApi"; 
import { useAuth } from "../context/AuthContext"; 

// --- Componentes de MUI ---
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  CircularProgress 
} from "@mui/material";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para manejo de UI/UX
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Simple validación de formato de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;

    // Validación en el frontend (Email y longitud de contraseña)
    if (!isValidEmail(email)) {
      setEmailError("Introduce un correo electrónico válido.");
      valid = false;
    }
    if (password.length < 6) {
      setPasswordError("La contraseña debe tener al menos 6 caracteres.");
      valid = false;
    }

    if (!valid) return;

    setLoading(true);

    try {
      const data = await loginUser(email, password);
      login(data.usuario, data.token); 
      navigate("/"); 
    } catch (err: any) {
      // Muestra errores del servidor o credenciales incorrectas
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Box se usa para contener y aplicar estilos como centrado y fondo
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        // Estilo de fondo que teníamos con Tailwind, ahora con CSS/MUI
        background: 'linear-gradient(45deg, #f06292 30%, #ba68c8 90%)', 
        padding: 2, // Espacio alrededor
      }}
    >
      {/* Box que simula la tarjeta del formulario */}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          padding: 5,
          borderRadius: 3,
          boxShadow: 8, // Sombra más pronunciada para dar profundidad
          width: '100%',
          maxWidth: 400, // Limita el ancho del formulario
          display: 'flex',
          flexDirection: 'column',
          gap: 3, // Espacio vertical entre elementos
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          fontWeight="bold"
          sx={{ color: '#424242' }}
        >
          Bienvenido
        </Typography>

        {/* Mensaje de error general (para errores del servidor) */}
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {/* Campo de Correo Electrónico */}
        <TextField
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
          error={!!emailError} // Muestra el error
          helperText={emailError} // Texto de ayuda/error
          required
        />

        {/* Campo de Contraseña */}
        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setPasswordError("");
          }}
          error={!!passwordError}
          helperText={passwordError}
          required
        />

        {/* Botón de Enviar */}
        <Button
          type="submit"
          variant="contained"
          color="secondary" // Usamos el color secundario para un acento púrpura
          size="large"
          fullWidth
          disabled={loading}
          sx={{ height: 50, marginTop: 1 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Entrar"
          )}
        </Button>

        {/* Enlace de Registro */}
        <Typography 
          variant="body2" 
          align="center" 
          sx={{ color: 'text.secondary', marginTop: 1 }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            style={{ 
              color: '#ba68c8', // Color del acento púrpura
              textDecoration: 'none', 
              fontWeight: 'bold' 
            }}
          >
            Regístrate
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;