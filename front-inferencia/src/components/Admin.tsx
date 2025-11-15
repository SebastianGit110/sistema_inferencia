import { useEffect, useState } from "react";
import { getHechos, postRule, createHecho } from "../api/index";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Card,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

type Option = {
  id: string;
  name: string;
};

function generarCodigo4Digitos(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const primaryColor = "#607d8b";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Estados
  const [climates, setClimates] = useState<Option[]>([]);
  const [occasions, setOccasions] = useState<Option[]>([]);
  const [styles, setStyles] = useState<Option[]>([]);

  const [selectedClimate, setSelectedClimate] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [newOptionName, setNewOptionName] = useState("");

  // Estados para los modales
  const [openModal, setOpenModal] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<"clima" | "ocasión" | "estilo">("clima");
  const [newCategoryOptionName, setNewCategoryOptionName] = useState("");

  // ✅ Crear regla
  const createRule = async () => {
    try {
      const rule = [+selectedClimate, +selectedOccasion, +selectedStyle];
      const code = generarCodigo4Digitos();
      await postRule({ rule, code, content: newOptionName });
      setNewOptionName("");
      alert("Regla creada exitosamente");
    } catch (error) {
      console.log("ERROR AL CREAR REGLA", error);
      alert("Error al crear la regla");
    }
  };

  // ✅ Obtener hechos (clima, ocasión, estilo)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: hechosData } = await getHechos();
        updateOptions(hechosData);
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    fetchData();
  }, []);

  // Función para actualizar las opciones
  const updateOptions = (hechosData: any[]) => {
    setClimates(
      hechosData
        .filter((item: any) => item.nombre === "clima")
        .map((item: any) => ({ id: String(item.id), name: item.valor }))
    );
    setOccasions(
      hechosData
        .filter((item: any) => item.nombre === "ocasión")
        .map((item: any) => ({ id: String(item.id), name: item.valor }))
    );
    setStyles(
      hechosData
        .filter((item: any) => item.nombre === "estilo")
        .map((item: any) => ({ id: String(item.id), name: item.valor }))
    );
  };

  // Función para abrir el modal
  const handleOpenModal = (category: "clima" | "ocasión" | "estilo") => {
    setCurrentCategory(category);
    setNewCategoryOptionName("");
    setOpenModal(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewCategoryOptionName("");
  };

  // Función para guardar la nueva opción de categoría
  const handleSaveNewCategoryOption = async () => {
    if (!newCategoryOptionName.trim()) {
      alert("Por favor ingresa un nombre válido");
      return;
    }

    try {
      // Insertar en la base de datos
      await createHecho(currentCategory, newCategoryOptionName);
      
      // Recargar los datos para mostrar la nueva opción
      const { data: hechosData } = await getHechos();
      updateOptions(hechosData);

      handleCloseModal();
      alert(`${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)} agregado exitosamente`);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar la nueva opción");
    }
  };

  // ✅ Renderizador de botones de opciones con botón +
  const renderOptions = (
    options: Option[],
    selected: string,
    setSelected: (id: string) => void,
    category: "clima" | "ocasión" | "estilo"
  ) => (
    <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
      {options.map((option) => (
        <Button
          key={option.id}
          variant={selected === option.id ? "contained" : "outlined"}
          onClick={() => setSelected(option.id)}
          sx={{
            m: 0.5,
            textTransform: "none",
            borderColor: primaryColor,
            bgcolor: selected === option.id ? primaryColor : "white",
            color: selected === option.id ? "white" : "#333",
            "&:hover": {
              bgcolor: selected === option.id ? "#455a64" : "#f0f4f8",
              borderColor: "#455a64",
            },
          }}
        >
          {option.name}
        </Button>
      ))}
      
      {/* Botón para agregar nueva opción */}
      <IconButton
        onClick={() => handleOpenModal(category)}
        sx={{
          m: 0.5,
          color: primaryColor,
          border: `1px solid ${primaryColor}`,
          "&:hover": {
            bgcolor: "#f0f4f8",
          },
        }}
      >
        <AddIcon />
      </IconButton>
    </Stack>
  );

  // ✅ Si no hay usuario logueado
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Debes iniciar sesión para acceder
        </Typography>
      </Box>
    );
  }

  // ✅ Lógica de roles
  const isAdmin = user.rol_id === 1 || user.rol === "admin";
  const isUsuario = user.rol_id === 2 || user.rol === "usuario";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 2 }}>
      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#333">
          Sistema de Recomendación de Trajes - Panel de Administración
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<AccountCircleIcon />}
            label={`${user?.nombre} (${user?.rol || "Usuario"})`}
            variant="outlined"
            size="medium"
            sx={{ borderColor: primaryColor, color: primaryColor }}
          />
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<ExitToAppIcon />}
            sx={{ textTransform: "none", color: primaryColor }}
          >
            Salir
          </Button>
        </Box>
      </Paper>

      {/* Render según rol */}
      {isAdmin ? (
        <>
          {/* 🔹 PANEL DEL ADMIN */}
          <Box maxWidth="lg" mx="auto" px={2}>
            <Card
              sx={{
                p: 3,
                mb: 6,
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                bgcolor: "white",
              }}
            >
              <Stack spacing={4}>
                {/* Clima */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Clima
                  </Typography>
                  {renderOptions(climates, selectedClimate, setSelectedClimate, "clima")}
                </Box>

                {/* Ocasión */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Ocasión
                  </Typography>
                  {renderOptions(
                    occasions,
                    selectedOccasion,
                    setSelectedOccasion,
                    "ocasión"
                  )}
                </Box>

                {/* Estilo */}
                <Box>
                  <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                    Estilo
                  </Typography>
                  {renderOptions(styles, selectedStyle, setSelectedStyle, "estilo")}
                </Box>

                {/* Agregar regla */}
                <Card
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    borderColor: primaryColor,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <Typography variant="h6" fontWeight="medium" mb={2}>
                    Crear Nueva Regla de Recomendación
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body2" color="textSecondary" mb={1}>
                      Selecciona una opción de cada categoría arriba y agrega la descripción de la recomendación
                    </Typography>
                    <TextField
                      label="Descripción de la recomendación"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      placeholder="Ejemplo: Traje formal oscuro con camisa blanca y corbata elegante..."
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Typography variant="body2" sx={{ flex: 1 }}>
                        <strong>Seleccionado:</strong><br />
                        Clima: {climates.find(c => c.id === selectedClimate)?.name || 'Ninguno'}<br />
                        Ocasión: {occasions.find(o => o.id === selectedOccasion)?.name || 'Ninguno'}<br />
                        Estilo: {styles.find(s => s.id === selectedStyle)?.name || 'Ninguno'}
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={createRule}
                        disabled={!selectedClimate || !selectedOccasion || !selectedStyle || !newOptionName.trim()}
                        sx={{
                          bgcolor: primaryColor,
                          color: "white",
                          "&:hover": { bgcolor: "#455a64" },
                          textTransform: "none",
                          minWidth: '150px',
                          alignSelf: 'flex-end'
                        }}
                      >
                        Crear Regla
                      </Button>
                    </Box>
                  </Stack>
                </Card>
              </Stack>
            </Card>
          </Box>
        </>
      ) : isUsuario ? (
        <>
          {/* 🔹 PANEL DEL USUARIO NORMAL */}
          <Box sx={{ textAlign: "center", mt: 10 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              Bienvenido al sistema de recomendación
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Aquí podrás ver sugerencias de combinaciones de ropa basadas en tu clima, ocasión y estilo.
            </Typography>
          </Box>
        </>
      ) : (
        <Typography textAlign="center" color="error" mt={4}>
          Rol desconocido. Contacta al administrador.
        </Typography>
      )}

      {/* Modal para agregar nueva opción de categoría */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          Agregar nuevo {currentCategory}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={`Nombre del ${currentCategory}`}
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryOptionName}
            onChange={(e) => setNewCategoryOptionName(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSaveNewCategoryOption();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} sx={{ color: "#666" }}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSaveNewCategoryOption} 
            variant="contained"
            sx={{ bgcolor: primaryColor, "&:hover": { bgcolor: "#455a64" } }}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}