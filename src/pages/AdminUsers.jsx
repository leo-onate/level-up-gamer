import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserById, getUsers, saveUsers } from "../services/userService";
import { Link, useNavigate } from "react-router-dom";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(-1);
  const navigate = useNavigate();
  const [editUser, setEditUser] = useState({
    nombre: "",
    correo: "",
    contrasena: "",
    fechaNacimiento: "",
    isAdmin: false,
  });

  useEffect(() => {
    let mounted = true;
    fetchUsers()
      .then((list) => {
        if (!mounted) return;
        setUsers(list);
      })
      .catch(() => {
        // fallback to local storage
        setUsers(getUsers());
      });
    return () => { mounted = false; };
  }, []);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditUser({ ...users[index] });
  };

  const handleChange = (field, value) => {
    setEditUser((s) => ({ ...s, [field]: value }));
  };

  const [saving, setSaving] = React.useState(false);
  const [saveError, setSaveError] = React.useState(null);

  const handleSave = (index) => {
    const user = users[index];
    const payload = {
      // map frontend fields to backend
      name: editUser.nombre,
      email: editUser.correo,
      // only send password if user changed it (and not masked)
      ...(editUser.contrasena && editUser.contrasena !== '••••••' ? { password: editUser.contrasena } : {}),
      fechaNac: editUser.fechaNacimiento ? `${editUser.fechaNacimiento}T00:00:00` : (user.fechaNacimiento ? `${user.fechaNacimiento}T00:00:00` : null),
      isAdmin: editUser.isAdmin ?? user.isAdmin ?? false,
    };

    // Try backend update, fallback to local storage
    if (user && user.id) {
      setSaving(true);
      setSaveError(null);
      updateUserById(user.id, payload)
        .then((updated) => {
          const copy = [...users];
          copy[index] = { ...copy[index], ...updated };
          setUsers(copy);
          setEditingIndex(-1);
        })
        .catch((err) => {
          console.error('updateUserById error', err);
          setSaveError(err?.response?.data || err.message || 'Error al actualizar');
          // fallback to saving locally
          const updated = [...users];
          updated[index] = { ...updated[index], ...editUser };
          saveUsers(updated);
          setUsers(updated);
          setEditingIndex(-1);
        })
        .finally(() => setSaving(false));
    } else {
      // local-only user
      const updated = [...users];
      updated[index] = { ...updated[index], ...editUser };
      saveUsers(updated);
      setUsers(updated);
      setEditingIndex(-1);
    }
  };

  const handleCancel = () => {
    setEditingIndex(-1);
  };

  return (
    <div className="container mt-4">
      <div className="dark-container">
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
                      <td className="text-center align-middle">
                        <div className="form-check">
                          <input
                            id="isAdmin"
                            type="checkbox"
                            className="form-check-input"
                            checked={!!editUser.isAdmin}
                            onChange={(e) => handleChange('isAdmin', e.target.checked)}
                          />
                          <label className="form-check-label" htmlFor="isAdmin">Admin</label>
                        </div>
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
                      <td>{u.isAdmin ? 'Sí' : 'No'}</td>
                      <td>
                        <div className="d-flex justify-content-end gap-2">
                          <button className="btn btn-sm btn-view" onClick={() => handleEditClick(idx)}>
                            Editar
                          </button>
                          <button className="btn btn-sm btn-info" onClick={() => navigate(`/admin/historial-compras/${u.correo}`)}>
                            Ver historial
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
    </div>
  );
}