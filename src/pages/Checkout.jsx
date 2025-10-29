import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getCurrentUser } from "../services/auth";

export default function Checkout() {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [codigo, setCodigo] = useState("");
  const [metodo, setMetodo] = useState("tarjeta");
  const [tarjeta, setTarjeta] = useState("");
  const [procesando, setProcesando] = useState(false);
  const [error, setError] = useState("");

  const total = getTotal();

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim() || !direccion.trim() || !ciudad.trim() || !codigo.trim()) {
      setError("Completa todos los campos de envío.");
      return;
    }
    if (metodo === "tarjeta" && tarjeta.replace(/\s+/g, "").length < 12) {
      setError("Introduce un número de tarjeta válido (simulado).");
      return;
    }
    setProcesando(true);

    // obtener y actualizar contador persistente
    const last = parseInt(localStorage.getItem("orderCounter") || "0", 10);
    const number = last + 1;
    try {
      localStorage.setItem("orderCounter", String(number));
    } catch {}

    const order = {
      id: `order_${number}`,
      number,
      displayId: `Orden N°${number}`,
      createdAt: Date.now(),
      customer: { nombre, direccion, ciudad, codigo, metodo },
      items,
      total,
      // Asociar el usuario a la orden
      userEmail: user ? user.correo : null,
    };

   
    setTimeout(() => {
      const rnd = Math.floor(Math.random() * 3) + 1; 
      if (rnd === 3) {
        // fallo la compra
        order.status = "failed";
        order.error = "Pago rechazado por el procesador (simulado).";
        try {
          localStorage.setItem("lastOrder", JSON.stringify(order));
        } catch {}
        setProcesando(false);
        navigate("/checkout/fallo");
        return;
      }

      // éxito al comprar
      order.status = "success";
      try {
        localStorage.setItem("lastOrder", JSON.stringify(order));
      } catch {}
      clearCart();
      setProcesando(false);
      navigate("/checkout/success");
    }, 1200);
  };

  if (!items.length) {
    return (
      <div className="container mt-4">
        <h2>Checkout</h2>
        <p>No hay productos en el carrito.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Finalizar compra</h2>

      <form onSubmit={onSubmit} className="row g-3">
        <div className="col-12">
          <label className="form-label">Nombre completo</label>
          <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>

        <div className="col-12">
          <label className="form-label">Dirección</label>
          <input className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Ciudad</label>
          <input className="form-control" value={ciudad} onChange={(e) => setCiudad(e.target.value)} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Código postal</label>
          <input className="form-control" value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        </div>

        <div className="col-12">
          <label className="form-label">Método de pago (simulado)</label>
          <select className="form-select" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
            <option value="tarjeta">Tarjeta</option>
            <option value="paypal">PayPal</option>
            <option value="efectivo">Efectivo</option>
          </select>
        </div>

        {metodo === "tarjeta" && (
          <div className="col-12">
            <label className="form-label">Número de tarjeta (simulado)</label>
            <input className="form-control" value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} placeholder="1234 5678 9012 3456" />
          </div>
        )}

        {error && (
          <div className="col-12">
            <div className="alert alert-danger p-2">{error}</div>
          </div>
        )}

        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <strong>Total:</strong> ${total.toFixed(2)}
          </div>
          <button className="btn btn-success" type="submit" disabled={procesando}>
            {procesando ? "Procesando..." : "Confirmar y pagar"}
          </button>
        </div>
      </form>
    </div>
  );
}