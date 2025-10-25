import React, { useEffect, useState } from "react";
import { getUsers, saveUsers } from "../services/userService";
import { Link } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editUser, setEditUser] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    fechaNacimiento: "",
  });

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditUser({ ...users[index] });
  };

  const handleChange = (field, value) => {
    setEditUser((s) => ({ ...s, [field]: value }));
  };

  const handleSave = (index) => {
    const updated = [...users];
    updated[index] = { ...updated[index], ...editUser };
    saveUsers(updated);
    setUsers(updated);
    setEditingIndex(-1);
  };

  const handleCancel = () => {
    setEditingIndex(-1);
  };

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
                <th>Contraseña</th>
                <th>Fecha nacimiento</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr key={u.id ?? u.correo ?? idx}>
                  {editingIndex === idx ? (
                    <>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editUser.nombre || ""}
                          onChange={(e) => handleChange("nombre", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editUser.correo || ""}
                          onChange={(e) => handleChange("correo", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={editUser.contrasena || ""}
                          onChange={(e) => handleChange("contrasena", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="date"
                          className="form-control form-control-sm"
                          value={editUser.fechaNacimiento || ""}
                          onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-primary" onClick={() => handleSave(idx)}>
                            Guardar
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={handleCancel}>
                            Cancelar
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>{u.contrasena ? "•••••••" : ""}</td>
                      <td>{u.fechaNacimiento || ""}</td>
                      <td>
                        <div className="d-flex justify-content-end">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => handleEditClick(idx)}>
                            Editar
                          </button>
                        </div>
                      </td>
                    </>
                  )}
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