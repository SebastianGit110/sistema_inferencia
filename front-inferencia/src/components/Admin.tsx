import { useEffect, useState } from "react";
import { getHechos, postRule } from "../api/index";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Stack,
  Card,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
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

  const [climates, setClimates] = useState<Option[]>([]);
  const [occasions, setOccasions] = useState<Option[]>([]);
  const [styles, setStyles] = useState<Option[]>([]);

  const [selectedClimate, setSelectedClimate] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [newOptionName, setNewOptionName] = useState("");

  const createRule = async () => {
    try {
      const rule = [+selectedClimate, +selectedOccasion, +selectedStyle];
      const code = generarCodigo4Digitos();
      await postRule({ rule, code, content: newOptionName });
      setNewOptionName("");
    } catch (error) {
      console.log("ERROR AL CREAR REGLA", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: hechosData } = await getHechos();
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
      } catch (error) {
        console.log("ERROR", error);
      }
    };
    fetchData();
  }, []);

  const renderOptions = (
    options: Option[],
    selected: string,
    setSelected: (id: string) => void
  ) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
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
    </Stack>
  );

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
        {/* Título a la izquierda */}
        <Typography variant="h5" fontWeight="bold" color="#333">
          Sistema de Recomendación de Trajes
        </Typography>

        {/* Usuario + botón a la derecha */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={<AccountCircleIcon />}
            label={user?.nombre || "Usuario"}
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

      {/* Main Content */}
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
              {renderOptions(climates, selectedClimate, setSelectedClimate)}
            </Box>

            {/* Ocasión */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Ocasión
              </Typography>
              {renderOptions(occasions, selectedOccasion, setSelectedOccasion)}
            </Box>

            {/* Estilo */}
            <Box>
              <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                Estilo
              </Typography>
              {renderOptions(styles, selectedStyle, setSelectedStyle)}
            </Box>

            {/* Formulario para agregar regla */}
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
                Agregar nueva regla
              </Typography>
              <Stack spacing={2}>
                <TextField
                  label="Nombre de la opción"
                  value={newOptionName}
                  onChange={(e) => setNewOptionName(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <Button
                  variant="contained"
                  onClick={createRule}
                  fullWidth
                  sx={{
                    bgcolor: primaryColor,
                    color: "white",
                    "&:hover": { bgcolor: "#455a64" },
                    textTransform: "none",
                  }}
                >
                  Agregar Regla
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
}
