// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { Admin } from "./components/Admin";
import Search from "./components/Search";


const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/search" 
        element={ <Search/>} 
      />
      <Route 
        path="/admin" 
        element={ <Admin />} 
      />
      <Route 
        path="/login" 
        element={<LoginPage />} 
      />
      <Route 
        path="/register" 
        element={<RegisterPage />} 
      />
      <Route 
        path="*" 
        element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl">404 - Página no encontrada</h1>
          </div>
        } 
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;