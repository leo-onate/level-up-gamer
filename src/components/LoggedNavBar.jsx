import { NavLink } from "react-router-dom";

export default function LoggedNavBar() {
  const noop = (e) => {
    e.preventDefault();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <span className="navbar-brand">LEVEL-UP GAMER</span>

        <div>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink to="/profile" className="nav-link">
                HOME
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/catalogo" className="nav-link">
                CATALOGO
              </NavLink>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={noop}>
                CARRITO
              </button>
            </li>
            <li className="nav-item">
              <NavLink to="/We" className="nav-link">
                Nosotros
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}