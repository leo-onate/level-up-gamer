import React, { useEffect, useState } from "react";
import { getUsers } from "../services/userService";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  return (
    <div className="container mt-4">
      <h2>Administrar usuarios</h2>
      {users.length === 0 ? (
        <p>No hay usuarios.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Contrasena</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id || u.username || u.correo}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td> 
                  <td>{u.contrasena}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3">
        <Link to="/catalogo" className="btn btn-secondary me-2">Volver al catálogo</Link>
      </div>
    </div>
  );
}