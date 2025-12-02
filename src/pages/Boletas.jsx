import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import { getCurrentUser } from '../services/auth';

export default function Boletas() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    getMyOrders()
      .then(res => {
        if (!mounted) return;
        // backend may return array or object with items
        const arr = Array.isArray(res) ? res : (res.items || []);
        setOrders(arr);
      })
      .catch(err => {
        console.error('getMyOrders error', err);
        if (!mounted) return;
        setError(err?.response?.data || err?.message || 'No se pudieron obtener las boletas.');
      })
      .finally(() => { if (mounted) setLoading(false); });

    return () => { mounted = false; };
  }, []);

  const user = getCurrentUser();

  return (
    <div className="container mt-4">
      <h2>Mis boletas</h2>
      {user && <p className="text-muted">Usuario: <strong>{user.email || user.name || user.id}</strong></p>}

      {loading && <p>Cargando boletas...</p>}
      {error && <div className="alert alert-danger">{String(error)}</div>}

      {!loading && !error && (
        <>
          {orders.length === 0 ? (
            <p>No tienes boletas aún.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id || o.orderId || Math.random()}>
                      <td>{o.id || o.orderId || o.displayId || '-'}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : (o.date || '-')}</td>
                      <td>{o.total ? `$${Number(o.total).toFixed(2)}` : (o.amount ? `$${Number(o.amount).toFixed(2)}` : '-')}</td>
                      <td>{o.status || o.state || 'Procesado'}</td>
                      <td>
                        {o.id ? <Link to={`/boletas/${o.id}`} className="btn btn-sm btn-outline-primary">Ver</Link> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
