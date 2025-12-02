import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function OrderFailure() {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar el carrito una sola vez al montar
    clearCart();
    // Limpiar la información del pedido
    localStorage.removeItem("lastOrder");
  }, []); // Sin dependencias para ejecutar solo una vez

  let order = null;
  try {
    order = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    order = null;
  }

  return (
    <>
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
        <button 
          className="btn btn-primary"
          onClick={() => navigate("/catalogo")}
        >
          Ir al catálogo
        </button>
      </div>
    </>
  );
}