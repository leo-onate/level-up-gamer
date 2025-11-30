import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts as getLocalProducts } from "../services/productService";
import { fetchProducts } from "../services/productService";

export default function Catalogo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    // Try backend first; fallback to local products if backend fails
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.items || [];
        console.debug('[Catalogo] products loaded count=', list.length, list);
        if (!list || list.length === 0) {
          setError('No hay productos devueltos por el backend. Verifica la BD o el backend.');
        }
        setItems(list);
      })
      .catch(() => {
        // fallback to local
        try {
          const list = getLocalProducts();
          if (mounted) {
            if (!list || list.length === 0) {
              setError('No hay productos locales ni respuesta del backend.');
            }
            setItems(list);
          }
        } catch (e) {
          if (mounted) setError('No se pudieron cargar productos');
        }
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const categorias = [...new Set(items.map((p) => p.categoria))].filter(Boolean);

  if (loading) return <div className="container mt-4">Cargando productos...</div>;
  if (error) return <div className="container mt-4">Error: {error}</div>;

  return (
    <div className="container mt-4">
      <h2>Catálogo</h2>
      <div className="mb-3">
        <strong>Categorías: </strong>
        {categorias.map((cat) => (
          <NavLink
            key={cat}
            to={`/categoria/${encodeURIComponent(cat)}`}
            className={({ isActive }) =>
              `btn btn-outline-secondary btn-sm me-2 category-btn ${isActive ? "active" : ""}`
            }
          >
            {cat}
          </NavLink>
        ))}
      </div>
      <div className="row g-3">
        {items.map((p) => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

