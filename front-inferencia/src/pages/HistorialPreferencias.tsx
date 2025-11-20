import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getHistorialPreferencias } from '../api/index';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import {
  History as HistoryIcon,
  ArrowBack as ArrowBackIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Cloud as CloudIcon,
  Event as EventIcon,
  Checkroom as CheckroomIcon,
} from '@mui/icons-material';

interface Triplete {
  clima: {
    id: number;
    nombre: string;
    valor: string;
  };
  ocasion: {
    id: number;
    nombre: string;
    valor: string;
  };
  estilo: {
    id: number;
    nombre: string;
    valor: string;
  };
}

interface Opcion {
  id: number;
  falla_id: number;
  falla_descripcion: string;
  ponderacion: number;
}

interface HistorialItem {
  triplete: Triplete;
  opciones: Opcion[];
}

const HistorialPreferencias: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState<HistorialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarHistorial = async () => {
      if (!user?.id) {
        setError('No se encontró información del usuario');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getHistorialPreferencias(Number(user.id));
        setHistorial(data);
        setError(null);
      } catch (err: any) {
        console.error('Error al cargar historial:', err);
        setError('Error al cargar el historial de preferencias');
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'grey.50',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.50' }}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Toolbar>
          <HistoryIcon sx={{ color: '#667eea', mr: 1, fontSize: 30 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Historial de Preferencias
          </Typography>

          <Chip
            icon={<AccountCircleIcon />}
            label={user?.nombre || 'Usuario'}
            variant="outlined"
            size="medium"
            sx={{ mr: 2 }}
          />

          <Button
            color="inherit"
            onClick={() => navigate('/')}
            startIcon={<ArrowBackIcon />}
            sx={{ textTransform: 'none', mr: 1 }}
          >
            Volver
          </Button>

          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{ textTransform: 'none' }}
          >
            Salir
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
          Mi Historial de Opciones
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Aquí puedes ver todas las opciones que has escogido para cada combinación de clima, ocasión y estilo
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {historial.length === 0 && !loading && (
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <HistoryIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No tienes preferencias guardadas aún
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Realiza algunas consultas para comenzar a ver tu historial aquí
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 3 }}
              onClick={() => navigate('/search')}
            >
              Realizar Consulta
            </Button>
          </Card>
        )}

        <Stack spacing={3}>
          {historial.map((item, index) => (
            <Card key={index} elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  p: 2,
                }}
              >
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                  Combinación #{index + 1}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                  }}
                >
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudIcon />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {item.triplete.clima.nombre}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.triplete.clima.valor}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <EventIcon />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {item.triplete.ocasion.nombre}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.triplete.ocasion.valor}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckroomIcon />
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.9 }}>
                        {item.triplete.estilo.nombre}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {item.triplete.estilo.valor}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                    Opciones Escogidas ({item.opciones.length})
                  </Typography>

                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="bold">
                              Descripción
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="subtitle2" fontWeight="bold">
                              Ponderación
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.opciones
                          .sort((a, b) => b.ponderacion - a.ponderacion)
                          .map((opcion) => (
                            <TableRow key={opcion.id} hover>
                              <TableCell>
                                <Typography variant="body2">
                                  {opcion.falla_descripcion}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  ID: {opcion.falla_id}
                                </Typography>
                              </TableCell>
                              <TableCell align="right">
                                <Chip
                                  label={opcion.ponderacion}
                                  color="primary"
                                  size="small"
                                  sx={{ fontWeight: 'bold' }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default HistorialPreferencias;

