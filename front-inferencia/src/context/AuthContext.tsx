// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

// 🧩 Interfaz del usuario (compatible con rol_id de la BD)
interface User {
  id: string;
  nombre: string;
  email: string;
  rol?: "usuario" | "admin"; // puede venir del backend como texto
  rol_id?: number;           // o como número (por ejemplo: 1 = admin, 2 = usuario)
}

// 🧠 Estructura del contexto
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

// 🏗️ Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧩 Provider global
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // 🔹 Cargar datos del localStorage al iniciar sesión
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setToken(savedToken);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 🔐 Iniciar sesión
  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
  };

  // 🚪 Cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // 🧭 Determinar si es admin (por texto o por id)
  const isAdmin =
    user?.rol === "admin" || user?.rol_id === 1;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

// 🪄 Hook para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
