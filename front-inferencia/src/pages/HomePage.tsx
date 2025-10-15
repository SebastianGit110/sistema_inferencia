import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
import SaveAltIcon from '@mui/icons-material/SaveAlt';

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
            <Button startIcon={<SaveAltIcon />} size="small">
              Exportar
            </Button>
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

  const UserPanel = () => (
    <Card
      sx={{
        background: 'linear-gradient(135deg, #4caf50 30%, #8bc34a 90%)',
        p: 4,
        borderRadius: 4,
        boxShadow: 8,
        color: 'white',
        mt: 4,
      }}
    >
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 2 }}>
        Consulta de Vestimenta
      </Typography>
      <Typography variant="h6" sx={{ opacity: 0.9, mb: 3 }}>
        Obtén recomendaciones personalizadas basadas en el clima, la ocasión y tu estilo personal
      </Typography>
      <Button
        variant="contained"
        size="large"
        sx={{
          bgcolor: 'white',
          color: '#4caf50',
          fontWeight: 'bold',
          '&:hover': { bgcolor: 'grey.50' },
        }}
      >
        Iniciar Consulta →
      </Button>
    </Card>
  );

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
