import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFallas, getHechos, getHechosFallas } from "../api/index";
import {
  Box,
  Typography,
  Button,
  Card,
  Stack,
  Paper,
  Chip,
} from "@mui/material";
import { ExitToApp as ExitToAppIcon, AccountCircle as AccountCircleIcon } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

type Option = { id: string; name: string; };

export default function Search() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  const [recommendation, setRecommendation] = useState<string[]>([]);
  const [recommendationCounter, setRecommendationCounter] = useState<
    Record<string, number>
  >({});

  const [hechos, setHechos] = useState<any[]>([]);
  const [fallas, setFallas] = useState<any[]>([]);
  const [hechosFallas, setHechosFallas] = useState<any[]>([]);

  console.log(recommendationCounter);

  const selectRecommendation = (option: string) => {
    console.log("LA OPCION ", option);

    setRecommendationCounter((prev) => ({
      ...prev,
      [option]: (prev[option] || 0) + 1,
    }));

    setRecommendation([]);

    // setSelectedClimate("");
    // setSelectedOccasion("");
    // setSelectedStyle("");
  };

  // 🔄 Cargar datos desde backend
  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data: hechosData } = await getHechos();
        const { data: fallasData } = await getFallas();
        const { data: hechosFallasData } = await getHechosFallas();

        setHechos(hechosData);
        setFallas(fallasData);
        setHechosFallas(hechosFallasData);

        // Armar selects
        setClimates(
          hechosData
            .filter((item: any) => item.nombre === "clima")
            .map((item: any) => ({
              id: String(item.id),
              name: item.valor,
            }))
        );

        setOccasions(
          hechosData
            .filter((item: any) => item.nombre === "ocasión")
            .map((item: any) => ({
              id: String(item.id),
              name: item.valor,
            }))
        );

        setStyles(
          hechosData
            .filter((item: any) => item.nombre === "estilo")
            .map((item: any) => ({
              id: String(item.id),
              name: item.valor,
            }))
        );
      };

      fetchData();
    } catch (error) {
      console.log("ERROR", error);
    }
  }, []);

  // 🔍 Función para inferir recomendación
  const getRecommendation = () => {
    // 1️⃣ Obtener los hechos seleccionados
    const hechosUsuario = [
      { nombre: "clima", valor: selectedClimate },
      { nombre: "ocasión", valor: selectedOccasion },
      { nombre: "estilo", valor: selectedStyle },
    ];

    console.log("Hechos usuario:", hechosUsuario);

    // 1️⃣ obtener los id de los hechos elegidos
    const idsHechos = hechos
      .filter((h) =>
        hechosUsuario.some((u) => u.nombre === h.nombre && u.valor === h.valor)
      )
      .map((h) => h.id);

    // 2️⃣ buscar una regla (falla) que esté asociada exactamente a esos 3 hechos

    for (const falla of fallas) {
      const hechosDeFalla = hechosFallas
        .filter(([idHecho, idFalla]) => idFalla === falla.id)
        .map(([idHecho]) => idHecho);

      if (hechosDeFalla.every((id) => idsHechos.includes(id))) {
        console.log(falla.descripcion);

        setRecommendation((prev) => [...prev, falla.descripcion]);
      }
    }
  };

  console.log("RECOMENDACION", recommendation);

  const renderOptions = (
    options: Option[],
    selected: string,
    setSelected: (id: string) => void
  ) => (
    <Stack direction="row" spacing={1} flexWrap="wrap">
      {options.map((option) => (
        <Button
          key={option.id}
          variant={selected === option.name ? "contained" : "outlined"}
          onClick={() => setSelected(option.name)}
          sx={{
            m: 0.5,
            textTransform: "none",
            borderColor: primaryColor,
            bgcolor: selected === option.name ? primaryColor : "white",
            color: selected === option.name ? "white" : "#333",
            "&:hover": {
              bgcolor: selected === option.name ? "#455a64" : "#f0f4f8",
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
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>


      {/* Main Content */}
      <Box sx={{ p: 2 }}>
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


        {/* Formulario y Resultados */}
        <Box maxWidth="lg" mx="auto" px={2}>
          <Box textAlign="center" mb={4}>
            <Typography variant="h4" fontWeight="bold" color="#333" mb={1}>
              Encuentra el traje perfecto
            </Typography>
            <Typography variant="body1" color="#666">
              Selecciona las opciones y obtén una recomendación personalizada
            </Typography>
          </Box>

          <Card sx={{ p: 3, borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
            <Stack spacing={4}>
              <Box>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Clima
                </Typography>
                {renderOptions(climates, selectedClimate, setSelectedClimate)}
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Ocasión
                </Typography>
                {renderOptions(occasions, selectedOccasion, setSelectedOccasion)}
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Estilo
                </Typography>
                {renderOptions(styles, selectedStyle, setSelectedStyle)}
              </Box>

              <Button
                variant="contained"
                color="primary"
                onClick={getRecommendation}
                fullWidth
                sx={{
                  bgcolor: primaryColor,
                  "&:hover": { bgcolor: "#455a64" },
                  textTransform: "none",
                  py: 1.5,
                }}
              >
                Obtener Recomendación
              </Button>

              {/* Resultado */}
              <Stack spacing={2}>
                {recommendation.map((elem, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      p: 2,
                      borderColor: primaryColor,
                      "&:hover": {
                        bgcolor: "#f0f4f8",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        transform: "scale(1.02)",
                      },
                      cursor: "pointer",
                    }}
                    onClick={() => selectRecommendation(elem)}
                  >
                    <Stack direction="row" spacing={2} alignItems="start">
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: primaryColor,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          width={16}
                          height={16}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </Box>
                      <Box>
                        <Typography fontWeight="medium">Recomendación {index + 1}</Typography>
                        <Typography color="#333">{elem}</Typography>
                      </Box>
                    </Stack>
                  </Card>
                ))}
              </Stack>

              <Box>
                <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                  Opciones Seleccionadas
                </Typography>
                <Stack spacing={1}>
                  {Object.entries(recommendationCounter).map(([key, value]) => (
                    <Box
                      key={key}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: `1px solid ${primaryColor}`,
                        bgcolor: "white",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{key}</Typography>
                      <Typography fontWeight="bold" color={primaryColor}>
                        {value}x
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Stack>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
