import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Avatar } from '@mui/material';

// Material UI
import {
  Container, Box, Typography,
  Grid, Card, CardContent, Button, AppBar, Toolbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Paper, Stack, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField,
  CircularProgress,
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

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
  const [openUserModal, setOpenUserModal] = useState(false);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Refs para formulario de creación
  const nombreCreateRef = useRef<HTMLInputElement>(null);
  const emailCreateRef = useRef<HTMLInputElement>(null);
  const passwordCreateRef = useRef<HTMLInputElement>(null);

  // ✅ Refs para formulario de edición
  const nombreEditRef = useRef<HTMLInputElement>(null);
  const emailEditRef = useRef<HTMLInputElement>(null);

  // === Cargar Usuarios ===
  const fetchUsuarios = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/users');
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  };

  useEffect(() => {
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

  // Agrega dentro de HomePage
const [editRole, setEditRole] = useState<string>(''); // NUEVO ESTADO PARA EL ROL

useEffect(() => {
  if (selectedUser) {
    setEditRole(selectedUser.rol); // Inicializa con rol del usuario
  }
}, [selectedUser]);


  // === Manejo de Modales ===
  const handleOpenUserModal = (user: Usuario) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };

  const handleCloseUserModal = () => {
    setOpenUserModal(false);
    setSelectedUser(null);
  };

  const handleOpenCreateModal = () => {
    setOpenCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setOpenCreateModal(false);
    if (nombreCreateRef.current) nombreCreateRef.current.value = '';
    if (emailCreateRef.current) emailCreateRef.current.value = '';
    if (passwordCreateRef.current) passwordCreateRef.current.value = '';
  };

  const handleOpenEditModal = (user: Usuario) => {
    setSelectedUser(user);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setSelectedUser(null);
    if (nombreEditRef.current) nombreEditRef.current.value = '';
    if (emailEditRef.current) emailEditRef.current.value = '';
  };

  const handleOpenDeleteDialog = (user: Usuario) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // ✅ FUNCIÓN: Crear Usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newUserData = {
      nombre: nombreCreateRef.current?.value || '',
      email: emailCreateRef.current?.value || '',
      password: passwordCreateRef.current?.value || '',
    };

    // Validaciones básicas
    if (!newUserData.nombre || !newUserData.email || !newUserData.password) {
      alert('⚠️ Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/api/users', newUserData);
      setUsuarios((prev) => [...prev, response.data]);
      alert('✅ Usuario creado exitosamente!');
      handleCloseCreateModal();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error desconocido al crear usuario.';
      alert(`❌ Error: ${errorMessage}`);
      console.error('Error al crear usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ FUNCIÓN: Actualizar Usuario (sin contraseña)
  const handleUpdateUser = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedUser) return;

  setLoading(true);

  const updateData = {
    nombre: nombreEditRef.current?.value || selectedUser.nombre,
    email: emailEditRef.current?.value || selectedUser.email,
    rol: editRole, // <-- ahora se envía el rol seleccionado en el modal
  };

  try {
    const response = await axios.put(`http://localhost:3000/api/users/${selectedUser.id}`, updateData);

    // Actualizar lista local
    setUsuarios((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? response.data : u))
    );

    alert('✅ Usuario actualizado correctamente!');
    handleCloseEditModal();
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Error desconocido al actualizar usuario.';
    alert(`❌ Error: ${errorMessage}`);
    console.error('Error al actualizar usuario:', error);
  } finally {
    setLoading(false);
  }
};

  // 🛠️ FUNCIÓN: Eliminar usuario (confirmado)
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    setLoading(true);

    try {
      await axios.delete(`http://localhost:3000/api/users/${selectedUser.id}`);

      // Eliminar de la lista local
      setUsuarios((prev) => prev.filter((u) => u.id !== selectedUser.id));

      alert(`✅ Usuario "${selectedUser.nombre}" eliminado correctamente.`);
      handleCloseDeleteDialog();
      handleCloseUserModal();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar usuario.';
      alert(`❌ Error: ${errorMessage}`);
      console.error('Error al eliminar usuario:', error);
    } finally {
      setLoading(false);
    }
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
        <Card
          component={Paper}
          elevation={3}
          sx={{ borderRadius: 2, p: 2, width: 800 }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" fontWeight="bold">
              Gestión de Usuarios
            </Typography>
            {/* ✅ BOTÓN AGREGAR USUARIO */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOpenCreateModal();
              }}
              sx={{ textTransform: 'none' }}
            >
              Agregar Usuario
            </Button>
          </Box>

          <TableContainer component={Box}>
            <Table size="small">
              <TableHead>
                <TableRow
                  sx={{
                    "& th": {
                      fontWeight: "bold",
                      color: "text.secondary",
                      backgroundColor: "grey.50",
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
                        color={u.rol === "admin" ? "secondary" : "default"}
                        sx={{ fontWeight: "medium" }}
                      />
                    </TableCell>
                    <TableCell>{u.fecha_creacion}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<VisibilityIcon />}
                          onClick={() => handleOpenUserModal(u)}
                        >
                          Ver
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="secondary"
                          startIcon={<EditIcon />}
                          onClick={() => handleOpenEditModal(u)}
                        >
                          Editar
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleOpenDeleteDialog(u)}
                        >
                          Eliminar
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        {/* Panel lateral del sistema experto */}
        <Card
          component={Paper}
          elevation={8}
          sx={{ borderRadius: 2, p: 2, ml: 20, width: 350 }}
        >
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
            Sistema Experto
          </Typography>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 3,
              backgroundColor: "#9c27b0",
              "&:hover": { backgroundColor: "#7b1fa2" },
            }}
            onClick={() => {
              navigate("/admin");
            }}
          >
            + Agregar Nueva Regla
          </Button>

          {/* Panel de reglas */}
          <Stack spacing={2}>
            <Card sx={{ borderLeft: "4px solid #2196f3", p: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                Reglas por Clima
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reglas.clima} reglas activas
              </Typography>
            </Card>
            <Card sx={{ borderLeft: "4px solid #4caf50", p: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                Reglas por Ocasión
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reglas.ocasion} reglas activas
              </Typography>
            </Card>
            <Card sx={{ borderLeft: "4px solid #ff9800", p: 1 }}>
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

      {/* 🔹 MODAL 1: Ver Detalles del Usuario (SOLO LECTURA) */}
      <Dialog
        open={openUserModal}
        onClose={handleCloseUserModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          👤 Detalles del Usuario
        </DialogTitle>
        <DialogContent dividers sx={{ mt: 2 }}>
          {selectedUser && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="caption" color="text.secondary">ID</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedUser.id}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Nombre</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedUser.nombre}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Email</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedUser.email}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Rol</Typography>
                <Chip
                  label={selectedUser.rol}
                  color={selectedUser.rol === 'admin' ? 'secondary' : 'default'}
                  sx={{ mt: 0.5 }}
                />
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Fecha de Creación</Typography>
                <Typography variant="body1" fontWeight="medium">{selectedUser.fecha_creacion}</Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>

      {/* 🔹 MODAL 2: Crear Nuevo Usuario */}
      <Dialog
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: 'success.main', color: 'white' }}>
          ➕ Crear Nuevo Usuario
        </DialogTitle>
        <Box component="form" onSubmit={handleCreateUser}>
          <DialogContent dividers sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                required
                label="Nombre Completo"
                name="nombre"
                fullWidth
                inputRef={nombreCreateRef}
                defaultValue=""
                autoComplete="off"
                placeholder="Ej: Juan Pérez"
              />
              <TextField
                required
                label="Correo Electrónico"
                name="email"
                type="email"
                fullWidth
                inputRef={emailCreateRef}
                defaultValue=""
                autoComplete="off"
                placeholder="Ej: juan@example.com"
              />
              <TextField
                required
                label="Contraseña"
                name="password"
                type="password"
                fullWidth
                inputRef={passwordCreateRef}
                defaultValue=""
                autoComplete="new-password"
                placeholder="Mínimo 6 caracteres"
                helperText="La contraseña debe tener al menos 6 caracteres"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleCloseCreateModal}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="success"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AddCircleOutlineIcon />}
            >
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* 🔹 MODAL 3: Editar Usuario (CON CAMBIO DE ROL) */}
      <Dialog
        open={openEditModal}
        onClose={handleCloseEditModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ bgcolor: 'warning.main', color: 'white' }}>
          ✏️ Editar Usuario
        </DialogTitle>
        <Box component="form" onSubmit={handleUpdateUser}>
          <DialogContent dividers sx={{ mt: 2 }}>
            {selectedUser && (
              <Stack spacing={3}>
                <TextField
                  label="Nombre Completo"
                  name="nombre"
                  fullWidth
                  inputRef={nombreEditRef}
                  defaultValue={selectedUser.nombre}
                  autoComplete="off"
                />
                <TextField
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  fullWidth
                  inputRef={emailEditRef}
                  defaultValue={selectedUser.email}
                  autoComplete="off"
                />

                {/* Cambiar Rol dentro del modal de edición */}
                <Box sx={{ pt: 1 }}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                    Rol del Usuario:
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant={editRole === "admin" ? "contained" : "outlined"}
                      color="secondary"
                      onClick={() => setEditRole("admin")}
                      fullWidth
                    >
                      Admin
                    </Button>
                    <Button
                      variant={editRole === "usuario" ? "contained" : "outlined"}
                      color="primary"
                      onClick={() => setEditRole("usuario")}
                      fullWidth
                    >
                      Usuario
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button
              onClick={handleCloseEditModal}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="warning"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {loading ? 'Actualizando...' : 'Guardar Cambios'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>


      {/* 🔹 MODAL 4: Confirmar Eliminación */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ bgcolor: 'error.main', color: 'white' }}>
          ⚠️ Confirmar Eliminación
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {selectedUser && (
            <Box>
              <Typography variant="body1" gutterBottom>
                ¿Estás seguro de que deseas eliminar al usuario?
              </Typography>
              <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Nombre:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedUser.nombre}
                </Typography>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                  Email:
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {selectedUser.email}
                </Typography>
              </Box>
              <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'medium' }}>
                ⚠️ Esta acción no se puede deshacer
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            disabled={loading}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteUser}
            variant="contained"
            color="error"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Eliminando...' : 'Sí, Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );

  const UserPanel = () => {
    const FeatureItem = ({ icon: Icon, title, description }: any) => (
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48, mt: 0.5 }}>
          <Icon sx={{ color: 'white' }} />
        </Avatar>
        <Box sx={{ color: 'white' }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {title}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {description}
          </Typography>
        </Box>
      </Box>
    );

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
          py: { xs: 6, md: 4 },
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 5, md: 8 },
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                color: 'white',
                flex: 1,
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

            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'flex-end',
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
            Panel de {isAdmin ? 'Administración' : 'Usuario'}
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