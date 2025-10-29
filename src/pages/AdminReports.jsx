import React from "react";
import starmie from "../assets/img/Starmie.gif";

export default function AdminReports() {
  return (
    <div className="container mt-4">
      <h2>Reportes</h2>
      <p>Reportes próximamente.</p>
      <img src={starmie} alt="Cargando reportes" style={{ maxWidth: 500 }} />
    </div>
  );
}