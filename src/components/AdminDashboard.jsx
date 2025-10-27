import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getUsers } from '../services/userService';
import { getOrders } from '../services/orderService';
import images from '../services/imageLoader';
// import './AdminDashboard.css';
{ /* eliminado import local de CSS; estilos ahora están en src/styles/styles.css */ }

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [prods, usrs, ords] = await Promise.all([
          getProducts(),
          getUsers(),
          Promise.resolve(getOrders()), // getOrders() es síncrono si usa localStorage
        ]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setUsers(Array.isArray(usrs) ? usrs : []);
        setOrders(Array.isArray(ords) ? ords : []);
      } catch (err) {
        console.error('AdminDashboard load error', err);
        if (mounted) {
          setProducts([]);
          setUsers([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => { mounted = false; };
  }, []);

  const recentProducts = (() => {
    if (!products || products.length === 0) return [];
    const withDate = products.filter(p => p.createdAt || p.fecha);
    if (withDate.length > 0) {
      return withDate
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha))
        .slice(0, 5);
    }
    return products.slice(-5).reverse();
  })();

  const imgSrcFor = (p) => {
    const img = p.imagen || p.image || p.img;
    return (
      (img && images[img]) ||
      (img && typeof img === 'string' && img.startsWith('/') ? img : (img ? `/assets/img/${img}` : null)) ||
      '/assets/img/placeholder.jpg'
    );
  };

  if (loading) {
    return (
      <div className="admin-dashboard card p-3 mb-4">
        <h5 className="ad-title">Dashboard (admin)</h5>
        <p className="ad-sub">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard card p-3 mb-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h5 className="ad-title mb-0">Panel de Administrador</h5>
          <small className="ad-sub">Resumen rápido del sitio</small>
        </div>
      </div>

      <div className="row mb-3 gx-3">
        <div className="col-sm-4">
          <div className="metric-card p-3">
            <div className="metric-label">Productos en catalogo</div>
            <div className="metric-value">{products.length}</div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="metric-card p-3">
            <div className="metric-label">Cuentas creadas</div>
            <div className="metric-value">{users.length}</div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="metric-card p-3">
            <div className="metric-label">Boletas</div>
            <div className="metric-value">{orders.length}</div>
            <div className="metric-note">
              {orders.length === 0 ? 'No hay boletas creadas' : `${orders.length} boleta(s) registradas`}
            </div>
            
          </div>
        </div>
      </div>

      <div>
        <h6 className="recent-title">Productos recientemente agregados</h6>

        {recentProducts.length === 0 ? (
          <p className="text-muted">No hay productos recientes.</p>
        ) : (
          <ul className="list-group recent-list">
            {recentProducts.map((p) => (
              <li className="list-group-item recent-item d-flex align-items-center" key={p.id || p._id || JSON.stringify(p)}>
                <img
                  className="product-thumb"
                  src={imgSrcFor(p)}
                  alt={p.nombre || p.title || 'producto'}
                />
                <div className="recent-info">
                  <div className="recent-name">{p.nombre || p.title || 'Sin nombre'}</div>
                  <div className="recent-meta">{p.precio ? `\$${p.precio}` : (p.price ? `\$${p.price}` : '')}</div>
                </div>
                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}