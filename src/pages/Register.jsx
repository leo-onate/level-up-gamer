import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [errors, setErrors] = useState({});

  
  const maxBirthDate = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${d.getFullYear()}-${m}-${day}`;
  })();

  const isAllowedEmail = (email) => {
    const m = email.match(/@(.+)$/);
    if (!m) return false;
    const domain = m[1].toLowerCase();
    return ["duocuc.cl", "duoc.profesor.cl", "gmail.com"].includes(domain);
  };

  const isAdult = (isoDate) => isoDate && new Date(isoDate) <= new Date(maxBirthDate);

  const validate = () => {
    const e = {};
    if (!nombre?.trim()) e.nombre = "Nombre requerido";
    if (!contrasena) e.contrasena = "Contraseña requerida";
    if (!isAllowedEmail(correo)) e.correo = "Correo debe ser @duocuc.cl, @duoc.profesor.cl o @gmail.com";
    if (!isAdult(fechaNacimiento)) e.fechaNacimiento = "Debes ser mayor de 18 años";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    const result = await registerUser({ nombre, correo, contrasena, fechaNacimiento });
    if (!result.ok) {
      alert(result.error || "Error al registrarse");
      return;
    }
    alert("Registro exitoso. Has iniciado sesión.");
    navigate("/");
  };

  return (
    <div className="login-container container my-5">
      <h2>Registrar cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            pattern="^[a-zA-Z0-9._%+-]+@(duocuc\.cl|duoc\.profesor\.cl|gmail\.com)$"
            title="Correo permitido: @duocuc.cl, @duoc.profesor.cl o @gmail.com"
            required
          />
          {errors.correo && <div className="text-danger small">{errors.correo}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de nacimiento</label>
          <input
            type="date"
            className="form-control"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            max={maxBirthDate}
            required
          />
          {errors.fechaNacimiento && <div className="text-danger small">{errors.fechaNacimiento}</div>}
        </div>

        <button type="submit" className="btn btn-primary">
          Crear cuenta
        </button>
      </form>
    </div>
  );
}