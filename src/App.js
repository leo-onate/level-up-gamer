import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import LoggedNavBar from "./components/LoggedNavBar";

// Páginas activas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; 
import We from "./pages/We";

// Estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";

export default function App() {
  const location = useLocation();

  // rutas que deben usar la navbar "pública"
  const publicPaths = ["/", "/login", "/register"];
  // normalizar pathname: minusculas y quitar slashes finales
  const pathname = (location.pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  const isPublic = publicPaths.includes(pathname);

  return (
    <>
      {isPublic ? <Navbar /> : <LoggedNavBar />}
      <div className="container mt-4">
        <Routes>
          {/* Página principal */}
          <Route path="/" element={<Home />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Register */}
          <Route path="/register" element={<Register />} />

          {/* Profile */}
          <Route path="/profile" element={<Profile />} />

          {/* Nosotros */}
          <Route path="/we" element={<We />} />

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
