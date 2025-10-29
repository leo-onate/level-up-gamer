import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/auth";

export default function LoggedNavbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [adminOpen, setAdminOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.nombre === "admin";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <NavLink to="/inicio" className="navbar-brand">LEVEL-UP GAMER</NavLink>

        <div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/inicio" className="nav-link">
                Home🏠
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/blogs" className="nav-link">
                Blogs🎙️
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className="nav-link">
                Catalogo🎮
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/profile" className="nav-link">
                Perfil👤
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/carrito" className="nav-link">
                Carrito🛒
              </NavLink>
            </li>
            
            {user && (
              <li className="nav-item ms-3 d-flex align-items-center text-light">
                <span className="me-2">
                  👋 Hola, <strong>{user.nombre || user.username}</strong>
                </span>
                <button className="btn btn-link nav-link p-0" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            )}
            {/* Si el usuario es admin tendra nuevas opciones visibles*/}
            {isAdmin && (
              <li className="nav-item ms-3" style={{ position: "relative" }}>
                <button
                  className="btn btn-link nav-link"
                  onClick={() => setAdminOpen((v) => !v)}
                  aria-expanded={adminOpen}
                >
                  Opciones de admin ▾
                </button>

                {adminOpen && (
                  <div className="admin-dropdown">
                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setAdminOpen(false);
                        navigate("/admin/usuarios");
                      }}
                    >
                      Administrar usuarios
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setAdminOpen(false);
                        navigate("/admin/productos"); 
                      }}
                    >
                      Administrar productos
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setAdminOpen(false);
                        navigate("/admin/agregar-producto");
                      }}
                    >
                      Agregar producto
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={(e) => {
                        e.preventDefault();
                        setAdminOpen(false);
                        navigate("/admin/reportes");
                      }}
                    >
                      Reportes
                    </button>
                  </div>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
