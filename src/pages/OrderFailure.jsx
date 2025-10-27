import React from "react";
import { Link } from "react-router-dom";

export default function OrderFailure() {
  let order = null;
  try {
    order = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    order = null;
  }

  return (
    <div className="container mt-4">
      <h2>Pago fallido</h2>
      {order ? (
        <>
          <p>No se pudo procesar el pago para <strong>{order.displayId || order.id}</strong>.</p>
          <p className="text-muted">{order.error || "Error desconocido (simulado)."}</p>
        </>
      ) : (
        <p>El pago falló, no hay información del pedido.</p>
      )}

      <div className="mt-3">
        <Link to="/carrito" className="btn btn-primary me-2">Volver al carrito</Link>
        <Link to="/catalogo" className="btn btn-outline-secondary">Ir al catálogo</Link>
      </div>
    </div>
  );
}