import React from "react";
import { NavLink } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Catalogo() {
  const productos = getProducts();

  const categorias = [...new Set(productos.map(p => p.categoria))].filter(Boolean);

  return (
    <div className="mt-4">
      <h2>Catálogo</h2>
      <div className="mb-3">
        <strong>Categorías: </strong>
        {categorias.map(cat => (
          <NavLink
            key={cat}
            to={`/categoria/${encodeURIComponent(cat)}`}
            className={({ isActive }) => `btn btn-outline-secondary btn-sm me-2 category-btn ${isActive ? 'active' : ''}`}
          >
            {cat}
          </NavLink>
        ))}
      </div>
      <div className="row">
        {productos.map(p => (
          <div key={p.id} className="col-12 col-sm-6 col-md-4 mb-3">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

