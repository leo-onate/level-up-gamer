import React from "react";
import { fetchProducts, getProducts as getLocalProducts } from "../services/productService";
import ProductCard from "../components/ProductCard";
export default function Ofertas() {
  const [productos, setProductos] = React.useState([]);

  React.useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data.items || [];
        setProductos(list.filter(p => p.oferta === true));
      })
      .catch(() => {
        setProductos(getLocalProducts().filter(p => p.oferta === true));
      });
    return () => { mounted = false; };
  }, []);

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