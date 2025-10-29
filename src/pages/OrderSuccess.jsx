import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { saveOrder, getOrders } from '../services/orderService';

export default function OrderSuccess(props) {
  let order = null;
  try {
    order = JSON.parse(localStorage.getItem("lastOrder"));
  } catch {
    order = null;
  }

  // Guarda la boleta usando el servicio centralizado y evita duplicados por id/displayId
  useEffect(() => {
    if (!order) return;
    try {
      const existing = getOrders();
      const exists = existing.some(o => (
        (o.id && order.id && o.id === order.id) ||
        (o.displayId && order.displayId && o.displayId === order.displayId)
      ));
      if (!exists) {
        const nuevaBoleta = {
          id: order.id || order.displayId || `ord-${Date.now()}`,
          displayId: order.displayId,
          total: order.total || 0,
          items: order.items || [],
          customer: order.customer || {},
          date: new Date().toISOString(),
          // puedes agregar más campos si los necesitas
        };
        saveOrder(nuevaBoleta);
      }
    } catch (err) {
      console.error('OrderSuccess: error guardando boleta', err);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="container mt-4">
        <h2>Compra completada</h2>
        <p>No se encontró información del pedido.</p>
        <Link to="/catalogo" className="btn btn-primary">Ir al catálogo</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>¡Pago confirmado!</h2>
      <p>Pedido: <strong>{order.displayId || order.id}</strong></p>
      <p>Nombre: {order.customer.nombre}</p>
      <p>Dirección: {order.customer.direccion}, {order.customer.ciudad} ({order.customer.codigo})</p>
      <p>Método: {order.customer.metodo}</p>

      <h5 className="mt-3">Resumen</h5>
      <ul className="list-group mb-3">
        {order.items.map(it => (
          <li key={it.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>{it.nombre} × {it.qty}</div>
            <div>${(it.precio * it.qty).toFixed(2)}</div>
          </li>
        ))}
      </ul>

      <h4>Total pagado: ${order.total.toFixed(2)}</h4>

      <div className="mt-3">
        <Link to="/catalogo" className="btn btn-primary me-2">Seguir comprando</Link>
        <Link to="/inicio" className="btn btn-outline-secondary">Volver al inicio</Link>
      </div>
    </div>
  );
}