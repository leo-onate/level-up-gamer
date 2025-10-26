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
      <button className="btn category-btn mb-3" onClick={() => navigate(-1)}>
        <span className="back-arrow">←</span> Volver
      </button>
      <div className="product-detail-card">
        <div className="row g-0 align-items-center">
          <div className="col-md-4">
            <img src={src} className="img-fluid" alt={product.nombre} />
          </div>
          <div className="col-md-8">
            <div className="detail-content">
              <h3>{product.nombre}</h3>
              <p>{product.descripcion}</p>
              {product.oferta ? (
                <div className="price-block">
                  <small className="price-original">${(product.precio / 0.6).toFixed(2)}</small>
                  <strong className="current-price">${product.precio}</strong>
                  <span className="badge bg-danger ms-2 offer-badge">-40% OFF</span>
                </div>
              ) : (
                <h4 className="price-normal">${product.precio}</h4>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}