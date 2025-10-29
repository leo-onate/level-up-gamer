import React from "react";
import { getCurrentUser } from "../services/auth";
import AdminDashboard from "../components/AdminDashboard";

export default function Inicio(props) {
  const user = getCurrentUser && typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const isAdmin = !!(user && (user.rol === "admin" || user.nombre === "admin" || user.isAdmin));

  return (
    <div className="container mt-4">
      <h2>Bienvenido a la mejor tienda Gamer de chile</h2>

      {isAdmin && (
        <section>
          <AdminDashboard />
        </section>
      )}
    </div>
  );
}