import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    const result = registerUser({ nombre, correo, contrasena, fechaNacimiento });
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
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

        <label htmlFor="correo">Correo</label>
        <input id="correo" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

        <label htmlFor="contrasena">Contraseña</label>
        <input id="contrasena" type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />

        <label htmlFor="fecha">Fecha de nacimiento</label>
        <input id="fecha" type="date" value={fechaNacimiento} onChange={(e) => setFechaNacimiento(e.target.value)} />

        <button className="btn btn-primary mt-3" type="submit">Registrar</button>
      </form>
    </div>
  );
}