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

  // sanitize error text to avoid leaking raw axios/network messages
  function sanitizeError(err) {
    if (!err) return 'Error desconocido.';
    const s = String(err).toLowerCase();
    if (s.includes('status code 403') || s.includes('403')) return 'Error de autorización (403).';
    if (s.includes('network') || s.includes('timeout')) return 'Error de red. Intenta nuevamente.';
    // truncate long messages
    if (s.length > 200) return s.slice(0, 200) + '...';
    return String(err);
  }

  return (
    <div className="container mt-4">
      <h2>Pago fallido</h2>
      {order ? (
        <>
          <p>No se pudo procesar el pago{order.displayId || order.id ? (
            <> para <strong>{order.displayId || order.id}</strong></>
          ) : null}.</p>
          <p className="text-muted">{sanitizeError(order.error)}</p>
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