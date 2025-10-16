import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFallas, getHechos, getHechosFallas } from "../api/index";

type Option = {
  id: string;
  name: string;
};

export default function Search() {
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <svg
                  className="h-6 w-6 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                Sistema de Recomendación de Trajes
              </h1>
            </div>
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-secondary/80"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Administración
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-3">
            Encuentra el traje perfecto
          </h2>
          <p className="text-muted-foreground text-lg">
            Selecciona las opciones y obtén una recomendación personalizada
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          <div className="space-y-8">
            {/* Clima */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">
                Clima
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {climates.map((climate) => (
                  <button
                    key={climate.id}
                    onClick={() => setSelectedClimate(climate.name)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedClimate === climate.name
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    {climate.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Ocasión */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">
                Ocasión
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {occasions.map((occasion) => (
                  <button
                    key={occasion.id}
                    onClick={() => setSelectedOccasion(occasion.name)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedOccasion === occasion.name
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    {occasion.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Estilo */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-foreground">
                Estilo
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {styles.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.name)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedStyle === style.name
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Botón de recomendación */}
            <button
              onClick={getRecommendation}
              className="w-full rounded-lg bg-accent px-6 py-4 text-base font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
            >
              Obtener Recomendación
            </button>

            {/* Resultado */}
            {recommendation.length > 0 &&
              recommendation.map((elem, index) => (
                <div
                  key={index}
                  className="
                    rounded-lg 
                    border-2 border-accent/20 
                    bg-accent/5 
                    p-6 
                    transition 
                    duration-250 
                    hover:bg-accent/10 
                    hover:border-accent 
                    hover:shadow-lg 
                    hover:scale-[1.02] 
                    cursor-pointer"
                  onClick={() => selectRecommendation(elem)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent">
                      <svg
                        className="h-5 w-5 text-accent-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-foreground">
                        Recomendación {index + 1}
                      </h3>
                      <p className="text-foreground/90 leading-relaxed">
                        {elem}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

            <h3 className="mb-4 text-lg font-semibold text-foreground">
              Opciones Seleccionadas
            </h3>
            <div className="rounded-lg border border-border bg-secondary/30 p-4 flex flex-col gap-2">
              {Object.entries(recommendationCounter).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-5 py-4"
                >
                  <div className="flex items-center gap-3">{key}</div>
                  <span className="text-lg font-bold text-primary">
                    {value || 0}x
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}