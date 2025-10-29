import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { getProducts } from "../services/productService";

export default function Catalogo() {
  const [items, setItems] = useState([]);
  const { products } = useCart();

  useEffect(() => {
    setItems(getProducts()); // lee merge de localStorage + JSON
  }, []);

  const categorias = [...new Set(products.map(p => p.categoria))].filter(Boolean);

  return (
    <div className="container mt-4">
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
      <div className="row g-3">
        {items.map(p => (
          <div className="col-sm-6 col-md-4 col-lg-3" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

