import React from "react";
import { Link } from "react-router-dom";
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
          <Link key={cat} to={`/categoria/${encodeURIComponent(cat)}`} className="btn btn-outline-secondary btn-sm me-2">
            {cat}
          </Link>
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

