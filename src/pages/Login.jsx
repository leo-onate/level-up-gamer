import { useState } from "react";
import { login } from "../services/auth";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    const ok = login({ usuario, password }); // usa tu lógica de auth abajo
    if (!ok) alert("Usuario o contraseña incorrectos");
  };

  return (
    <div className="login-container container my-5">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={onSubmit}>
        <label htmlFor="usuario">Usuario</label>
        <input id="usuario" value={usuario} onChange={e=>setUsuario(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        <button className="btn btn-primary mt-3" type="submit">Entrar</button>
      </form>
    </div>
  );
}