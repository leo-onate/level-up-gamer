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
import AdminUserOrders from "./pages/AdminUserOrders";
import We from "./pages/We";
import Catalogo from "./pages/Catalogo";
import ProductDetail from "./pages/ProductDetail";
import Carrito from "./pages/Carrito";
import Categoria from "./pages/Categoria";
import Ofertas from "./pages/Ofertas";
import Checkout from "./pages/Checkout";           // <-- nuevo
import OrderSuccess from "./pages/OrderSuccess"; // <-- nuevo
import OrderFailure from "./pages/OrderFailure";
import AdminUsers from "./pages/AdminUsers";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminReports from "./pages/AdminReports";
import AdminBoletas from "./pages/AdminBoletas";

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

          {/* ... otras rutas ... */}
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          {/* 👇 Agrega esta nueva ruta aquí 👇 */}
          <Route path="/admin/historial-compras/:userEmail" element={<AdminUserOrders />} />
          {/* ... más rutas si existen ... */}
          
          {/* Catalogo */}
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:id" element={<ProductDetail />} />

          {/* Ofertas */}
          <Route path="/ofertas" element={<Ofertas />} />  

          {/* Carrito */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} /> 

          {/* Order Success */}
          <Route path="/checkout/success" element={<OrderSuccess />} />  

          {/* Order Failure */}
          <Route path="/checkout/fallo" element={<OrderFailure />} />

          {/* Categorías */}
          <Route path="/categoria/:categoria" element={<Categoria />} />

          {/* Admin - Usuarios */}
          <Route path="/admin/usuarios" element={<AdminUsers />} />
          <Route path="/admin/agregar-producto" element={<AdminAddProduct />} />
          <Route path="/admin/productos" element={<AdminProducts />} />
          <Route path="/admin/reportes" element={<AdminReports />} />
          <Route path="/admin/boletas" element={<AdminBoletas />} />

          {/* Perfil de usuario */}
          <Route path="/profile" element={<Profile />} />

          {/* Cualquier otra ruta redirige al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}
