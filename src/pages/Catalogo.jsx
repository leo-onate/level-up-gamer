import React from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Catalogo() {
  const productos = getProducts();

  return (
    <div className="mt-4">
      <h2>Catálogo</h2>
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

