import React, { useEffect, useState } from "react";
import { getOrders, fetchOrdersFromBackend, updateOrderStatus } from "../services/orderService";
import Boleta from "../components/Boleta";

export default function AdminBoletas() {
  const [orders, setOrders] = useState([]);
  const [openIndex, setOpenIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Intentar cargar desde backend
      const backendOrders = await fetchOrdersFromBackend();
      setOrders(backendOrders);
    } catch (err) {
      console.error('Error al cargar desde backend, usando localStorage:', err);
      // Fallback a localStorage
      setOrders(getOrders());
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`¿Cambiar el estado de la orden #${orderId} a ${newStatus}?`)) {
      return;
    }

    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      setSelectedStatus(prev => ({ ...prev, [orderId]: newStatus }));
      alert('Estado actualizado exitosamente');
    } catch (err) {
      console.error('Error al actualizar estado:', err);
      alert('Error al actualizar el estado: ' + (err.response?.data?.error || err.message));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDIENTE': return 'bg-warning text-dark';
      case 'PROCESANDO': return 'bg-info text-dark';
      case 'ENVIADO': return 'bg-primary';
      case 'ENTREGADO': return 'bg-success';
      case 'CANCELADO': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(o => o.status === filter);

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="dark-container">
          <h2>Boletas</h2>
          <p>Cargando órdenes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="dark-container">
        <h2>Boletas</h2>

        <div className="mb-3">
          <label className="form-label">Filtrar por estado:</label>
          <select 
            className="form-select" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={{maxWidth: '300px'}}
          >
            <option value="ALL">Todas</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="PROCESANDO">Procesando</option>
            <option value="ENVIADO">Enviadas</option>
            <option value="ENTREGADO">Entregadas</option>
            <option value="CANCELADO">Canceladas</option>
          </select>
        </div>

        {filteredOrders.length === 0 ? (
          <p>No hay boletas registradas{filter !== "ALL" ? ` con estado ${filter}` : ''}.</p>
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
                  <th>Estado</th>
                  <th>Cambiar Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((o, idx) => (
                  <React.Fragment key={(o.id || o.displayId || idx) + "-row"}>
                    <tr>
                      <td>{idx + 1}</td>
                      <td>{o.displayId || `#${o.id}`}</td>
                      <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : (o.date ? new Date(o.date).toLocaleString() : "")}</td>
                      <td>${(Number(o.total) || 0).toFixed(2)}</td>
                      <td>
                        {o.customerName || o.customer?.nombre || ""}<br/>
                        <small className="text-muted">{o.customerEmail || o.userEmail || ""}</small>
                      </td>
                      <td>
                        {o.status && (
                          <span className={`badge ${getStatusBadgeClass(o.status)}`}>
                            {o.status}
                          </span>
                        )}
                      </td>
                      <td>
                        {o.id && (
                          <div className="d-flex gap-2 align-items-center">
                            <select
                              className="form-select form-select-sm"
                              value={selectedStatus[o.id] || o.status || 'PENDIENTE'}
                              onChange={(e) => setSelectedStatus(prev => ({ ...prev, [o.id]: e.target.value }))}
                              style={{minWidth: '120px'}}
                            >
                              <option value="PENDIENTE">Pendiente</option>
                              <option value="PROCESANDO">Procesando</option>
                              <option value="ENVIADO">Enviado</option>
                              <option value="ENTREGADO">Entregado</option>
                              <option value="CANCELADO">Cancelado</option>
                            </select>
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handleStatusChange(o.id, selectedStatus[o.id] || o.status)}
                              disabled={!selectedStatus[o.id] || selectedStatus[o.id] === o.status}
                            >
                              Cambiar
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="text-end">
                        <button className="btn btn-sm btn-view" onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}>
                          {openIndex === idx ? "Ocultar" : "Ver"}
                        </button>
                      </td>
                    </tr>
                    {openIndex === idx && (
                      <tr>
                        <td colSpan={8}>
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
