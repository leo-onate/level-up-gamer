import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import images from "../services/imageLoader";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const originalPrice = product.oferta ? product.precio / 0.6 : product.precio; // 40% de descuento fijo

  const src =
    (product.imagen && images[product.imagen]) ||
    (product.imagen && product.imagen.startsWith("/") ? product.imagen : `/assets/img/${product.imagen}`) ||
    "/assets/img/placeholder.jpg";

  return (
    <div className="card producto-card">
      <div className="card-img-container">
        <img src={src} alt={product.nombre} className="card-img-top" />
      </div>
      <div className="card-body d-flex flex-column">
        <div>
          <h5 className="card-title">{product.nombre}</h5>
          <p className="card-text">{product.descripcion}</p>
          {product.categoria && (
            <p className="mb-1">
              <small>Categoría: <Link to={`/categoria/${encodeURIComponent(product.categoria)}`}>{product.categoria}</Link></small>
            </p>
          )}
          <div className="mt-2">
            {product.stock > 0 && product.stock <= 4 && (
              <span className="badge bg-warning me-2">Poco stock</span>
            )}
            {product.stock === 0 && (
              <span className="badge bg-danger me-2">Agotado</span>
            )}
            <span className="text-white">Stock: {product.stock}</span>
          </div>
        </div>

        <div className="product-actions mt-2">
          <div>
            {product.oferta ? (
              <>
                <small className="price-original">${originalPrice.toFixed(2)}</small>
                <strong className="current-price">${product.precio}</strong>
                <span className="badge bg-danger ms-2 offer-badge">-40% OFF</span>
              </>
            ) : (
              <strong>${product.precio}</strong>
            )}
          </div>
          <div className="d-flex gap-2 mt-2">
            <button 
              className="btn btn-sm btn-success" 
              onClick={() => addToCart(product, 1)}
              disabled={product.stock === 0}
            >
              Añadir
            </button>
            <Link to={`/catalogo/${product.id}`} className="stretched-link" />
          </div>
        </div>
      </div>
    </div>
  );
}