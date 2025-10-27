import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/productService';
import { getUsers } from '../services/userService';
import images from '../services/imageLoader';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [prods, usrs] = await Promise.all([
          getProducts(), // espera que devuelva un array
          getUsers(),    // espera que devuelva un array
        ]);
        if (!mounted) return;
        setProducts(Array.isArray(prods) ? prods : []);
        setUsers(Array.isArray(usrs) ? usrs : []);
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

  // calcular recientes: preferir campos createdAt/fecha, si no usar últimos elementos
  const recentProducts = (() => {
    if (!products || products.length === 0) return [];
    const withDate = products.filter(p => p.createdAt || p.fecha);
    if (withDate.length > 0) {
      return withDate
        .slice()
        .sort((a, b) => new Date(b.createdAt || b.fecha) - new Date(a.createdAt || a.fecha))
        .slice(0, 5);
    }
    // fallback: tomar últimos 5 según orden del array o id
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
        <h5>Dashboard (admin)</h5>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard card p-3 mb-4">
      <h5 className="mb-3">Panel de Administrador</h5>

      <div className="row mb-3">
        <div className="col-sm-4">
          <div className="card text-center p-2">
            <div className="card-body">
              <h6>Productos</h6>
              <p className="h3 mb-0">{products.length}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center p-2">
            <div className="card-body">
              <h6>Cuentas</h6>
              <p className="h3 mb-0">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="card text-center p-2">
            <div className="card-body">
              <h6>Otras métricas</h6>
              <p className="mb-0">--</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h6>Productos recientemente agregados</h6>
        {recentProducts.length === 0 ? (
          <p className="text-muted">No hay productos recientes.</p>
        ) : (
          <ul className="list-group">
            {recentProducts.map((p) => (
              <li className="list-group-item d-flex align-items-center" key={p.id || p._id || JSON.stringify(p)}>
                <img
                  src={imgSrcFor(p)}
                  alt={p.nombre || p.title || 'producto'}
                  style={{ width: 48, height: 48, objectFit: 'cover', marginRight: 12 }}
                />
                <div style={{ flex: 1 }}>
                  <div className="fw-bold">{p.nombre || p.title || 'Sin nombre'}</div>
                  <div className="text-muted small">{p.precio ? `\$${p.precio}` : (p.price ? `\$${p.price}` : '')}</div>
                </div>
                {p.id ? (
                  <Link to={`/product/${p.id}`} className="btn btn-sm btn-outline-primary">Ver</Link>
                ) : (
                  <button className="btn btn-sm btn-outline-secondary" disabled>Ver</button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}