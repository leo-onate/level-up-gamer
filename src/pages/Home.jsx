import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="text-center mt-5">
      <h1>Bienvenido a LEVEL-UP GAMER 🎮</h1>
      <p className="mt-3">
        Usa las opciones del menú para <Link to="/login">iniciar sesión</Link>{" "}
      </p>
    </div>
  );
}