import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="container mt-5">
        <h3>Producto no encontrado</h3>
        <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← Volver</button>
      <div className="card">
        <div className="row g-0">
          <div className="col-md-5">
            <img src={product.imagen} className="img-fluid" alt={product.nombre} />
          </div>
          <div className="col-md-7">
            <div className="card-body">
              <h3 className="card-title">{product.nombre}</h3>
              <p className="card-text">{product.descripcion}</p>
              <h4>${product.precio}</h4>
              {product.oferta && <span className="badge bg-success">Oferta</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}