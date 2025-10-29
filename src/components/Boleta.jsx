import React from "react";

export default function Boleta({ order }) {
  if (!order) return null;
  const id = order.displayId || order.id;
  const items = Array.isArray(order.items) ? order.items : [];
  const total = typeof order.total === 'number' ? order.total : 0;
  const fecha = order.date ? new Date(order.date).toLocaleString() : "";

  return (
    <div className="boleta dark-container mt-2">
      <div className="d-flex justify-content-between align-items-center">
        <h4 className="mb-0">Boleta #{id}</h4>
        {fecha && <small className="text-muted">{fecha}</small>}
      </div>

      <div className="mt-2">
        {order.customer && (
          <div className="mb-2">
            <strong>Cliente:</strong> {order.customer.nombre || ""}
            {order.userEmail ? <span className="ms-2">({order.userEmail})</span> : null}
          </div>
        )}

        <div className="table-responsive">
          <table className="table table-striped mb-2">
            <thead>
              <tr>
                <th>Producto</th>
                <th style={{width: 90}}>Cantidad</th>
                <th style={{width: 140}}>Precio</th>
                <th style={{width: 160}}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => {
                const precio = Number(it.precio) || 0;
                const qty = Number(it.qty) || 0;
                const sub = precio * qty;
                return (
                  <tr key={idx}>
                    <td>{it.nombre}</td>
                    <td>{qty}</td>
                    <td>${precio.toFixed(2)}</td>
                    <td><strong>${sub.toFixed(2)}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <h5>Total: ${total.toFixed(2)}</h5>
        </div>
      </div>
    </div>
  );
}
