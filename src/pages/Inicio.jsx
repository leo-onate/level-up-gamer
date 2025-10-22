import React from "react";
import { getCurrentUser } from "../services/auth";

export default function Inicio() {
  const user = getCurrentUser();

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>No hay usuario autenticado</h2>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Bienvenido a la mejor tienda Gamer de chile</h2>
    </div>
  );
}