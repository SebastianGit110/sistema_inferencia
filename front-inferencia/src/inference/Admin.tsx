import { useEffect, useState } from "react";
import { getHechos, postRule } from "../api";

type Option = {
  id: string;
  name: string;
};

function generarCodigo4Digitos(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

export function Admin() {
  const [climates, setClimates] = useState<Option[]>([]);
  const [occasions, setOccasions] = useState<Option[]>([]);
  const [styles, setStyles] = useState<Option[]>([]);

  const [selectedClimate, setSelectedClimate] = useState("");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");

  const [newOptionName, setNewOptionName] = useState("");

  const createRule = async () => {
    try {
      console.log("CLIMA", selectedClimate);
      console.log("OCASION", selectedOccasion);
      console.log("ESTILO", selectedStyle);

      const rule = [+selectedClimate, +selectedOccasion, +selectedStyle];
      const code = generarCodigo4Digitos();

      console.log("REGLA", newOptionName, rule, code);

      await postRule({ rule, code, content: newOptionName });
    } catch (error) {
      console.log("ERROR AL CREAR REGLA", error);
    }
  };

  // 🔄 Cargar datos desde backend
  useEffect(() => {
    try {
      const fetchData = async () => {
        const { data: hechosData } = await getHechos();

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
                Administra la Recomendación de Trajes
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
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
                    onClick={() => setSelectedClimate(climate.id)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedClimate === climate.id
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
                    onClick={() => setSelectedOccasion(occasion.id)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedOccasion === occasion.id
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
                    onClick={() => setSelectedStyle(style.id)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all ${
                      selectedStyle === style.id
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-foreground hover:border-primary/50 hover:bg-secondary"
                    }`}
                  >
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Formulario para agregar */}
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm col-span-full">
                <h3 className="mb-4 text-xl font-semibold text-foreground">
                  Agregar nueva regla
                </h3>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="optionName"
                      className="mb-2 block text-sm font-medium text-foreground"
                    >
                      Nombre de la opción
                    </label>
                    <input
                      id="optionName"
                      type="text"
                      value={newOptionName}
                      onChange={(e) => setNewOptionName(e.target.value)}
                      placeholder={`Regla`}
                      className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <button
                    onClick={createRule}
                    className="w-full rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
                  >
                    Agregar Regla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
