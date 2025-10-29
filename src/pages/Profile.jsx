import React, { use, useEffect, useState } from "react";
import avatarPlaceholder from "../assets/img/perro.jpeg";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";
import { getUsers, saveUsers } from "../services/userService";

export default function Profile() {
  const navigate = useNavigate();
  
  const [current] = useState(() => getCurrentUser()|| null);
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    fechaNacimiento: "",
  });
  const [origCorreo, setOrigCorreo] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (current) {
      setForm({
        nombre: current.nombre || "",
        correo: current.correo || current.email || "",
        fechaNacimiento: current.fechaNacimiento || "",
      });
      setOrigCorreo(current.correo || current.email || "");
    }
  }, []);

  const handleChange = (k) => (e) => setForm((s) => ({ ...s, [k]: e.target.value }));

  const onSave = (e) => {
    e.preventDefault();
    setMsg("");
    if (!form.nombre.trim() || !form.correo.trim()) {
      setMsg("Nombre y correo son obligatorios.");
      return;
    }

    const users = getUsers();
    const idx = users.findIndex(
      (u) =>
        (u.correo && u.correo === origCorreo) ||
        (u.username && u.username === current?.username)
    );

    if (idx >= 0) {
      users[idx] = { ...users[idx], nombre: form.nombre.trim(), correo: form.correo.trim(), fechaNacimiento: form.fechaNacimiento || "" };
    } else {
      // Si no existe en users, añadimos (id sencillo)
      users.push({
        id: `u${Date.now()}`,
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        contrasena: current?.contrasena || "",
        fechaNacimiento: form.fechaNacimiento || "",
      });
    }

    saveUsers(users);

    // actualizar currentUser en localStorage si existe
    try {
      const keyNames = ["currentUser", "user", "authUser"];
      keyNames.forEach((k) => {
        const raw = localStorage.getItem(k);
        if (!raw) return;
        try {
          const obj = JSON.parse(raw);
          if (obj && (obj.correo === origCorreo || obj.username === current?.username)) {
            const updated = { ...obj, nombre: form.nombre.trim(), correo: form.correo.trim(), fechaNacimiento: form.fechaNacimiento || "" };
            localStorage.setItem(k, JSON.stringify(updated));
          }
        } catch {}
      });
    } catch {}

    setMsg("Perfil guardado.");
    setOrigCorreo(form.correo);
    setTimeout(() => setMsg(""), 2500);
  };

  if (!current) {
    return (
      <div className="container mt-4">
        <h2>Perfil</h2>
        <p>No estás logueado.</p>
        <button className="btn btn-primary" onClick={() => navigate("/login")}>Ir a login</button>
      </div>
    );
  }

  return (
    <div className="container mt-4" style={{ maxWidth: 760 }}>
      <div className="dark-container">
        <div className="d-flex justify-content-center mb-3">
          <img src={avatarPlaceholder} alt="Avatar" className="profile-avatar" />
        </div>

        <h2 className="text-center">Mi perfil</h2>

        <form onSubmit={onSave} className="row g-3 mt-2 text-start">
        <div className="col-12">
          <label className="form-label">Nombre</label>
          <input className="form-control" value={form.nombre} onChange={handleChange("nombre")} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Correo</label>
          <input className="form-control" value={form.correo} onChange={handleChange("correo")} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            value={form.fechaNacimiento}
            readOnly
            disabled
          />
        </div>

        <div className="col-12 d-flex gap-2">
          <button className="btn btn-success" type="submit">Guardar</button>
          <button className="btn btn-secondary" type="button" onClick={() => navigate(-1)}>Cancelar</button>
        </div>

        {msg && <div className="col-12"><div className="alert alert-info p-2 mt-2">{msg}</div></div>}
        </form>
      </div>
    </div>
  );
}