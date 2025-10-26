import { NavLink, useNavigate } from "react-router-dom";
import { logout, getCurrentUser } from "../services/auth";


export default function LoggedNavbar() {
  const user = getCurrentUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

            {/* Sección de usuario logueado */}
            {user && (
              <li className="nav-item ms-3 d-flex align-items-center text-light">
                <span className="me-2">
                  👋 Hola, <strong>{user.nombre}</strong>
                </span>
                <NavLink to = "/Login" className="nav-link">
                 Cerrar sesión
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
