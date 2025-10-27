import React from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Ofertas() {
  const productos = getProducts().filter(p => p.oferta === true);

  return (
    <div className="mt-4">
      <h2>Ofertas</h2>
      {productos.length === 0 ? (
        <p>No hay productos en oferta por ahora.</p>
      ) : (
        <div className="row">
          {productos.map(p => (
            <div key={p.id} className="col-12 col-sm-6 col-md-4 mb-3">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}