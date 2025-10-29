import React, { useEffect, useState } from "react";
import { getOrders } from "../services/orderService";
import Boleta from "../components/Boleta";

export default function AdminBoletas() {
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  return (
    <div className="container mt-4">
      <div className="dark-container">
        <h2>Boletas</h2>

        {orders.length === 0 ? (
          <p>No hay boletas registradas.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Orden</th>
                  <th>Fecha</th>
                  <th>Total</th>
                  <th>Cliente</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o, idx) => (
                  <React.Fragment key={(o.id || o.displayId || idx) + "-row"}>
                    <tr>
                      <td>{idx + 1}</td>
                      <td>{o.displayId || o.id}</td>
                      <td>{o.date ? new Date(o.date).toLocaleString() : ""}</td>
                      <td>${(Number(o.total) || 0).toFixed(2)}</td>
                      <td>{o.customer?.nombre || ""}{o.userEmail ? ` (${o.userEmail})` : ""}</td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-view" onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}>
                          {openIndex === idx ? "Ocultar" : "Ver"}
                        </button>
                      </td>
                    </tr>
                    {openIndex === idx && (
                      <tr>
                        <td colSpan={6}>
                          <Boleta order={o} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
