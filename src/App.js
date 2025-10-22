import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";

// Páginas activas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile"; // agregado

// Estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";

export default function App() {
  return (
    <>
      <Navbar />
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

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
