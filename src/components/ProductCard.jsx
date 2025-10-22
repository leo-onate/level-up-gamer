import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="producto-card card mb-3" style={{ maxWidth: 320 }}>
      <img
        src={product.imagen}
        className="card-img-top"
        alt={product.nombre}
        style={{ height: 180, objectFit: "cover" }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.nombre}</h5>
        <p className="card-text">{product.descripcion}</p>
        <div className="d-flex justify-content-between align-items-center">
          <strong>${product.precio}</strong>
          <Link to={`/catalogo/${product.id}`} className="btn btn-sm btn-primary">
            Mostrar más
          </Link>
        </div>
      </div>
    </div>
  );
}