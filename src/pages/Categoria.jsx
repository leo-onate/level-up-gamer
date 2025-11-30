import React from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, getProducts as getLocalProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";

export default function Categoria() {
  const { categoria } = useParams();
  const decoded = categoria ? decodeURIComponent(categoria) : "";
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.items || [];
        setProductos(list.filter(p => p.categoria === decoded));
      })
      .catch(() => {
        setProductos(getLocalProducts().filter(p => p.categoria === decoded));
      });
    return () => { mounted = false; };
  }, [decoded]);

  return (
    <div className="mt-4">
      <h2>Categoría: {decoded || "(sin categoría)"}</h2>
      <Link to="/catalogo" className="btn category-btn mb-3">
        <span className="back-arrow" aria-hidden>←</span>
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