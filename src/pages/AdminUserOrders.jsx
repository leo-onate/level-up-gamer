import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrdersByUserEmail } from "../services/orderService";

export default function AdminUserOrders() {
  const { userEmail } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (userEmail) {
      const userOrders = getOrdersByUserEmail(userEmail);
      setOrders(userOrders);
    }
  }, [userEmail]);

  return (
    <div className="container mt-4">
      <div className="dark-container">
        <h2>Historial de Compras de {userEmail}</h2>

        {orders.length === 0 ? (
          <p>Este usuario no tiene compras.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID de Orden</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.id}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                    <td>${(typeof order.total === 'number' ? order.total : 0).toFixed(2)}</td>
                    <td>
                      <ul>
                        {order.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            {item.nombre} - Cantidad: {item.qty} - Precio: ${(typeof item.precio === 'number' ? item.precio : 0).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3">
          <Link to="/admin/usuarios" className="btn btn-secondary">
            Volver a Usuarios
          </Link>
        </div>
      </div>
    </div>
  );
}
