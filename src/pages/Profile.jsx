import React from "react";
import { getCurrentUser } from "../services/auth";

export default function Profile() {
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
      <h2>Hola {user.nombre} {user.correo}</h2>
      <h2>kfdjksfjkd</h2>
    </div>
  );
}