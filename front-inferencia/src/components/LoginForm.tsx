import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/authApi"; 
import { useAuth } from "../context/AuthContext"; 

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
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setPasswordError("");

    let valid = true;
    if (!isValidEmail(email)) { setEmailError("Introduce un correo válido."); valid = false; }
    if (password.length < 6) { setPasswordError("La contraseña debe tener al menos 6 caracteres."); valid = false; }
    if (!valid) return;

    setLoading(true);
    try {
      const data = await loginUser(email, password);
      login(data.usuario, data.token); 
      navigate("/"); 
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f5f5', // Gris claro neutro
        padding: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          backgroundColor: 'white',
          padding: 5,
          borderRadius: 3,
          boxShadow: 4,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          align="center" 
          gutterBottom 
          fontWeight="bold"
          sx={{ color: '#333' }} // Gris oscuro
        >
          Bienvenido
        </Typography>

        {error && (
          <Alert severity="error" sx={{ bgcolor: '#fdecea', color: '#611a15' }}>
            {error}
          </Alert>
        )}

        <TextField
          label="Correo Electrónico"
          type="email"
          variant="outlined"
          fullWidth
          value={email}
          onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
          error={!!emailError}
          helperText={emailError}
        />

        <TextField
          label="Contraseña"
          type="password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
          error={!!passwordError}
          helperText={passwordError}
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
            marginTop: 1,
            backgroundColor: '#607d8b', // Gris azulado suave
            '&:hover': { backgroundColor: '#455a64' }, 
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
        </Button>

        <Typography 
          variant="body2" 
          align="center" 
          sx={{ color: '#666', marginTop: 1 }}
        >
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            style={{ 
              color: '#607d8b', // Gris azulado
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
