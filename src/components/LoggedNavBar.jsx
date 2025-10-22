import React from "react";

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
              <button className="btn btn-link nav-link" onClick={noop}>
                HOME
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={noop}>
                CATALOGO
              </button>
            </li>
            <li className="nav-item">
              <button className="btn btn-link nav-link" onClick={noop}>
                CARRITO
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}