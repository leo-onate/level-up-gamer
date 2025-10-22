import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import LoggedNavBar from "./components/LoggedNavBar";

// Páginas activas
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import Profile from "./pages/Profile"; 
import We from "./pages/We";
import Catalogo from "./pages/Catalogo";
import ProductDetail from "./pages/ProductDetail";

// Estilos globales
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/styles.css";



export default function App() {
  const location = useLocation();
  const isProfile = location.pathname === "/profile";
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

          {/* Inicio */}
          <Route path="/inicio" element={<Inicio />} />

          {/* Blogs */}
          <Route path="/blogs" element={<Blog />} />

          {/* Post */}
          <Route path="/blog/:id" element={<Post />} />

          {/* Nosotros */}
          <Route path="/we" element={<We />} />

          {/* Catalogo */}
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<ProductDetail />} />

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
