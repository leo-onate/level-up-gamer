import React from "react";
import { useParams, Link } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Categoria() {
  const { categoria } = useParams();
  const decoded = categoria ? decodeURIComponent(categoria) : "";
  const productos = getProducts().filter(p => p.categoria === decoded);

  return (
    <div className="mt-4">
      <h2>Categoría: {decoded || "(sin categoría)"}</h2>
      <Link to="/catalogo" className="btn btn-primary mb-3">
        Volver al Catálogo
      </Link>
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