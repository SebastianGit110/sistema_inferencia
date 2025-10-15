import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar } from '@mui/material';

// Material UI
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  AppBar,
  Toolbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Iconos
import GroupIcon from '@mui/icons-material/Group';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventIcon from '@mui/icons-material/Event';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';



// Tipos
interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: string;
  fecha_creacion: string;
}

interface Reglas {
  clima: number;
  ocasion: number;
  estilo: number;
}

interface AdminCounterCardProps {
  title: string;
  count: string;
  color: string;
  icon: React.ReactNode;
}



const AdminCounterCard: React.FC<AdminCounterCardProps> = ({ title, count, color, icon }) => (
  <Card
    sx={{
      height: 120,
      background: `linear-gradient(45deg, ${color} 30%, ${color}99 90%)`,
      color: 'white',
      boxShadow: 6,
    }}
  >
    <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
      <Box>
        <Typography variant="h4" component="div" fontWeight="bold">
          {count}
        </Typography>
        <Typography variant="subtitle1" component="div" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {React.cloneElement(icon as React.ReactElement, { sx: { color: 'white' } })}
      </Box>
    </CardContent>
  </Card>
);

const HomePage: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [reglas, setReglas] = useState<Reglas>({ clima: 0, ocasion: 0, estilo: 0 });
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [open, setOpen] = useState(false);

  // === Cargar Usuarios ===
  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  // === Cargar Reglas ===
  useEffect(() => {
    const fetchReglas = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/reglas');
        setReglas(res.data);
      } catch (error) {
        console.error('Error al cargar reglas:', error);
      }
    };
    fetchReglas();
  }, []);

  const handleOpen = (user: Usuario) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalReglas = reglas.clima + reglas.ocasion + reglas.estilo;

  const AdminPanel = () => (
    <Box sx={{ mt: 3 }}>
      {/* Tarjetas de resumen */}
      <Grid
        container
        spacing={3}
        sx={{
          mb: 4,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          '& > *': {
            flex: '1 1 30%',
            minWidth: 200,
            maxWidth: 400,
            height: 120,
            marginBottom: 2,
          },
        }}
      >
        <AdminCounterCard title="Total Usuarios" count={usuarios.length.toString()} color="#2196f3" icon={<GroupIcon />} />
        <AdminCounterCard title="Usuarios Activos" count={usuarios.length.toString()} color="#4caf50" icon={<GroupIcon />} />
        <AdminCounterCard title="Reglas Activas" count={totalReglas.toString()} color="#9c27b0" icon={<VpnKeyIcon />} />
      </Grid>

      {/* Gestión de Usuarios */}
      <Grid container spacing={3}>
        <Card component={Paper} elevation={3} sx={{ borderRadius: 2, p: 2, width: 800 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Gestión de Usuarios
            </Typography>
          </Box>

          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    '& th': {
                      fontWeight: 'bold',
                      color: 'text.secondary',
                      backgroundColor: 'grey.50',
                    },
                  }}
                >
                  <TableCell>Usuario</TableCell>
                  <TableCell>Rol</TableCell>
                  <TableCell>Fecha de Creación</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usuarios.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>
                      <Typography variant="body1">{u.nombre}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {u.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={u.rol}
                        size="small"
                        color={u.rol === 'admin' ? 'secondary' : 'default'}
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell>{u.fecha_creacion}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="text"
                        color="primary"
                        onClick={() => handleOpen(u)} // 👈 abre modal
                      >
                        Ver detalles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Sistema Experto (panel lateral) */}
        <Card component={Paper} elevation={8} sx={{ borderRadius: 2, p: 2, ml: 20, width: 350 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Sistema Experto
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: '#9c27b0',
              '&:hover': { backgroundColor: '#7b1fa2' },
            }}
            onClick={() => navigate('/register')} // 👈 redirige al registro de regla
          >
            + Agregar Nueva Regla
          </Button>

          {/* Panel de reglas */}
          <Stack spacing={2}>
            <Card sx={{ borderLeft: '4px solid #2196f3', p: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                Reglas por Clima
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reglas.clima} reglas activas
              </Typography>
            </Card>
            <Card sx={{ borderLeft: '4px solid #4caf50', p: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                Reglas por Ocasión
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reglas.ocasion} reglas activas
              </Typography>
            </Card>
            <Card sx={{ borderLeft: '4px solid #ff9800', p: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                Reglas por Estilo
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reglas.estilo} reglas activas
              </Typography>
            </Card>
          </Stack>
        </Card>
      </Grid>

      {/* Modal Detalles Usuario */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Detalles del Usuario</DialogTitle>
        <DialogContent dividers>
          {selectedUser && (
            <Box>
              <Typography><strong>ID:</strong> {selectedUser.id}</Typography>
              <Typography><strong>Nombre:</strong> {selectedUser.nombre}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Rol:</strong> {selectedUser.rol}</Typography>
              <Typography><strong>Fecha de creación:</strong> {selectedUser.fecha_creacion}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

const UserPanel = () => {
  const navigate = useNavigate();

  // Componente auxiliar para las características de la columna izquierda (FeatureItem)
  const FeatureItem = ({ icon: Icon, title, description }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48, mt: 0.5 }}>
        <Icon sx={{ color: 'white' }} />
      </Avatar>
      <Box sx={{ color: 'white' }}> {/* Asegura que el texto sea blanco */}
        <Typography variant="subtitle1" fontWeight={600}>
          {title}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          {description}
        </Typography>
      </Box>
    </Box>
  );

  // Componente auxiliar para la tarjeta de consulta (ConsultCard)
  const ConsultCardContent = () => {
    const steps = [
      { step: '1', title: 'Selecciona la ocasión', desc: 'Casual, formal, deportiva o de gala' },
      { step: '2', title: 'Indica tus preferencias', desc: 'Colores, estilo y nivel de formalidad' },
      { step: '3', title: 'Recibe tu recomendación', desc: 'Sugerencias inteligentes adaptadas a ti' },
    ];

    return (
      <Card
        sx={{
          p: { xs: 4, sm: 5 },
          borderRadius: 4,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          bgcolor: 'white',
          position: 'relative',
          overflow: 'hidden',
          minWidth: 300,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
          }
        }}
      >
        {/* Fondo decorativo */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
            zIndex: 0,
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Icono principal */}
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 3,
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}
          >
            <CheckroomIcon sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 2, color: 'grey.900' }}>
            Comienza Tu Consulta
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, color: 'grey.600', lineHeight: 1.8 }}>
            En solo 3 pasos obtendrás una recomendación profesional:
          </Typography>

          {/* Pasos */}
          <Box sx={{ mb: 4 }}>
            {steps.map(({ step, title, desc }) => (
              <Box key={step} sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
                <Avatar
                  sx={{
                    bgcolor: '#f0f4ff',
                    color: '#667eea',
                    width: 32,
                    height: 32,
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    flexShrink: 0,
                  }}
                >
                  {step}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} color="grey.800">{title}</Typography>
                  <Typography variant="caption" color="grey.600">{desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Botón principal */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/search')}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 700,
              py: 2,
              fontSize: 16,
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            Iniciar Consulta Ahora
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '85vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: 2,
        py: { xs: 6, md: 4 }, // Ajuste de padding vertical para móviles
      }}
    >
      <Container maxWidth="lg">
        {/* Usamos Box con Flexbox para simular el Grid de 2 columnas */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' }, // Columna en móvil, fila en escritorio
            gap: { xs: 5, md: 8 }, // Espacio entre las secciones
            alignItems: 'center',
          }}
        >

          {/* Columna izquierda - Información */}
          <Box
            sx={{
              color: 'white',
              flex: 1, // Ocupa la mitad del espacio disponible
              minWidth: 0,
              pr: { md: 4 }
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 2,
                fontWeight: 600,
                mb: 2,
                display: 'block'
              }}
            >
              SISTEMA EXPERTO
            </Typography>

            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 800,
                mb: 3,
                lineHeight: 1.2
              }}
            >
              Tu Asesor Personal de Vestimenta
            </Typography>

            <Typography
              variant="h6"
              sx={{
                mb: 4,
                opacity: 0.95,
                fontWeight: 300,
                lineHeight: 1.7
              }}
            >
              Tecnología inteligente que analiza el clima, la ocasión y tus preferencias
              para ofrecerte recomendaciones precisas y personalizadas.
            </Typography>

            {/* Características destacadas - Usando Stack y el componente auxiliar */}
            <Stack spacing={2.5}>
              <FeatureItem
                icon={CheckCircleIcon}
                title="Análisis del Clima"
                description="Recomendaciones adaptadas a la temperatura y condiciones actuales"
              />
              <FeatureItem
                icon={AutoAwesomeIcon}
                title="Personalización Inteligente"
                description="Sistema experto que aprende de tus preferencias de estilo"
              />
              <FeatureItem
                icon={EventIcon}
                title="Múltiples Ocasiones"
                description="Desde casual hasta formal, encuentras el outfit perfecto"
              />
            </Stack>
          </Box>

          {/* Columna derecha - Panel de consulta */}
          <Box
            sx={{
              flex: 1, // Ocupa la otra mitad del espacio disponible
              display: 'flex',
              justifyContent: 'flex-end', // Alinea la tarjeta a la derecha si hay espacio
              width: { xs: '100%', md: 'auto' }
            }}
          >
            <ConsultCardContent />
          </Box>

        </Box>
      </Container>
    </Box>
  );
};

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <AdminPanelSettingsIcon sx={{ color: 'red', mr: 1, fontSize: 30 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Panel de Administración
          </Typography>

          <Chip
            icon={<AccountCircleIcon />}
            label={user?.nombre || 'Admin'}
            variant="outlined"
            size="medium"
            sx={{ mr: 2 }}
          />

          <Button color="inherit" onClick={handleLogout} startIcon={<ExitToAppIcon />} sx={{ textTransform: 'none' }}>
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        {isAdmin ? <AdminPanel /> : <UserPanel />}
      </Container>
    </Box>
  );
};

export default HomePage;
