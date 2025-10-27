import React from "react";
import { Link } from "react-router-dom";
import images from "../services/imageLoader";

export default function ProductCard({ product }) {
  const src =
    (product.imagen && images[product.imagen]) ||
    (product.imagen && product.imagen.startsWith("/") ? product.imagen : `/assets/img/${product.imagen}`) ||
    "/assets/img/placeholder.jpg";

  return (
    <div className="card producto-card">
      <img src={src} alt={product.nombre} className="card-img-top" />
      <div className="card-body d-flex flex-column">
        <div>
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text">{product.descripcion}</p>
          {product.categoria && (
            <p className="mb-1">
              <small>Categoría: <Link to={`/categoria/${encodeURIComponent(product.categoria)}`}>{product.categoria}</Link></small>
            </p>
          )}
        </div>

        <div className="product-actions mt-2">
          <strong>${product.precio}</strong>
          <Link to={`/catalogo/${product.id}`} className="btn btn-sm btn-primary">
            Mostrar más
          </Link>
        </div>
      </div>
    </div>
  );
}