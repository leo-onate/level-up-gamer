import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderFailure() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

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
        <p>El carrito ha sido vaciado y el stock de los productos ha sido restaurado.</p>
        <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
      </div>
    </div>
  );
}