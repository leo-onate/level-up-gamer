import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import images from "../services/imageLoader"; 

export default function Carrito() {
  const { items, removeFromCart, updateQty, clearCart, getTotal } = useCart();
  const navigate = useNavigate();

  if (!items.length) {
    return (
      <div className="container mt-4">
        <h2>Carrito</h2>
        <p>Tu carrito está vacío.</p>
        <button className="btn btn-primary" onClick={() => navigate("/catalogo")}>Ir al catálogo</button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Carrito</h2>
      <div className="list-group">
        {items.map(it => (
          <div key={it.id} className="list-group-item d-flex align-items-center justify-content-between">
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <img
                src={
                  (it.imagen && images[it.imagen]) ||
                  (it.imagen && it.imagen.startsWith("/") ? it.imagen : `/assets/img/${it.imagen}`) ||
                  "/assets/img/placeholder.jpg"
                }
                alt={it.nombre}
                style={{ width: 80, height: 60, objectFit: "cover" }}
              />
              <div>
                <div><strong>{it.nombre}</strong></div>
                <div className="text-muted">${it.precio}</div>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <input type="number" min="1" value={it.qty} onChange={(e) => updateQty(it.id, parseInt(e.target.value || "1"))} style={{ width: 70 }} />
              <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(it.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 d-flex justify-content-between align-items-center">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => clearCart()}>Vaciar carrito</button>
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>Seguir comprando</button>
        </div>

        <div>
          <h4>Total: ${getTotal().toFixed(2)}</h4>
          
          <button className="btn btn-success mt-2" onClick={() => navigate("/checkout")}>Comprar</button>
        </div>
      </div>
    </div>
  );
}