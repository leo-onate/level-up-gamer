import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";
import images from "../services/imageLoader"; 

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

 
  const src =
    (product.imagen && images[product.imagen]) ||
    (product.imagen && product.imagen.startsWith("/") ? product.imagen : `/assets/img/${product.imagen}`) ||
    "/assets/img/placeholder.jpg";

  return (
    <div className="container mt-4">
      <button className="btn btn-link mb-3" onClick={() => navigate(-1)}>← Volver</button>
      <div className="card">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <img src={src} className="img-fluid" alt={product.nombre} style={{ width: "100%", objectFit: "contain" }} />
          </div>
          <div className="col-md-8">
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